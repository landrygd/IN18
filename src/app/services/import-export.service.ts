import { Injectable } from "@angular/core";
import { GlobalService } from "./global.service";
import { Folder } from "../classes/folder";
import { SettingsService } from "./settings.service";
import { TraductionsGroup } from "../classes/traductions-group";
import { Traduction } from "../classes/traduction";
import { saveAs } from "file-saver";
import { Structure } from "../classes/structure";
import * as JSZip from "jszip";
import { ElectronService } from "ngx-electron";
import { ToastController } from "@ionic/angular";

let g: GlobalService;

let self: ImportExportService;

@Injectable({
  providedIn: "root",
})
export class ImportExportService {
  constructor(
    private global: GlobalService,
    private settings: SettingsService,
    private electronService: ElectronService,
    private toastController: ToastController
  ) {
    g = global;
    self = this;
    if (this.electronService.isElectronApp) {
      const path = this.electronService.ipcRenderer.sendSync("get-file-data");
      if (path === null || path === "./") {
      } else {
        this.load_in18(path, true);
      }
    }
  }

  _CSVToArray(strData): string[][] {
    // Create a regular expression to parse the CSV values.
    const objPattern = new RegExp(
      // Delimiters.
      "(\\" +
      this.settings.separatorCharCsv +
        "|\\r?\\n|\\r|^)" +
        // Quoted fields.
        '(?:"([^"]*(?:""[^"]*)*)"|' +
        // Standard fields.
        '([^"\\' +
        this.settings.separatorCharCsv +
        "\\r\\n]*))",
      "gi"
    );

    // Create an array to hold our data. Give the array
    // a default empty first row.
    const arrData: string[][] = [[]];

    // Create an array to hold our individual pattern
    // matching groups.
    let arrMatches = null;

    // Keep looping over the regular expression matches
    // until we can no longer find a match.
    // tslint:disable-next-line: no-conditional-assignment
    while ((arrMatches = objPattern.exec(strData))) {
      // Get the delimiter that was found.
      const strMatchedDelimiter = arrMatches[1];

      // Check to see if the given delimiter has a length
      // (is not the start of string) and if it matches
      // field delimiter. If id does not, then we know
      // that this delimiter is a row delimiter.
      if (strMatchedDelimiter.length && strMatchedDelimiter !==  this.settings.separatorCharCsv) {
        // Since we have reached a new row of data,
        // add an empty row to our data array.
        arrData.push([]);
      }

      let strMatchedValue;

      // Now that we have our delimiter out of the way,
      // let's check to see which kind of value we
      // captured (quoted or unquoted).
      if (arrMatches[2]) {
        // We found a quoted value. When we capture
        // this value, unescape any double quotes.
        strMatchedValue = arrMatches[2].replace(new RegExp('""', "g"), '"');
      } else {
        // We found a non-quoted value.
        strMatchedValue = arrMatches[3];
      }

      // Now that we have our value string, let's add
      // it to the data array.
      arrData[arrData.length - 1].push(strMatchedValue);
    }

    // Return the parsed data.
    return arrData;
  }

  async importFile(path: String) {
    if (this.electronService.isElectronApp) {
      this.electronService.ipcRenderer.send("load-file", path, true);
    }
  }

  async importCsvFile(data: String, path:string="") {
    if (path !== "") {
      this.settings.addRecentFilePath(path);
    }
    this.global.loading = true;
    const csvArray: string[][] = this._CSVToArray(data);
    if (this.global.structure === undefined) {
      this.global.structure = new Folder("project_name", undefined);
    }
    let newStructure: Folder = new Folder(
      this.global.structure.getName(),
      undefined
    );
    if (this.settings.importFusion !== "no") {
      newStructure = this.global.structure;
    } else {
      this.global.projectPath = undefined;
    }
    if (csvArray.length > 1) {
      const languages: string[] = [];
      for (let k = 1; k < csvArray[0].length; k++) {
        languages.push(csvArray[0][k]);
      }
      if (languages.length > 0) {
        for (let k = 1; k < csvArray.length; k++) {
          const res: string[] = csvArray[k][0].split(this.settings.folderCharCsv);
          let currentFolder: Folder = newStructure;
          let currentTrad: TraductionsGroup;
          for (let i = 0; i < res.length; i++) {
            if (i === res.length - 1) {
              currentFolder.addTraductionGroup(
                new TraductionsGroup(res[i], currentFolder, [])
              );
              currentTrad = currentFolder.findTraductionGroup(res[i]);
            } else {
              currentFolder.addFolder(new Folder(res[i], currentFolder));
              currentFolder = currentFolder.findFolder(res[i]);
            }
          }
          for (let i = 1; i < csvArray[k].length; i++) {
            const actualTrad = currentTrad.getTradByLanguage(csvArray[0][i]);
            const trad = new Traduction(
              csvArray[k][i],
              csvArray[0][i],
              this.settings.autoValidate
            );
            if (actualTrad !== undefined) {
              if (this.settings.importFusion === "yes_new") {
                currentTrad.removeTraduction(actualTrad);
                currentTrad.addTraduction(trad);
              }
            } else {
              currentTrad.addTraduction(trad);
            }
          }
        }
      }
      this.global.languages = languages.filter(
        (e, i) => languages.indexOf(e) === i
      );
      this.global.setStructure(newStructure);
    }
    this.global.loading = false;
  }

  async importJsonFiles(files: object[], languages: string[]) {
    for (let file of files) {
      if (file["path"] !== undefined) {
        this.settings.addRecentFilePath(file["path"]);
      }
    }
    this.global.loading = true;
    languages = languages.filter((e, i) => languages.indexOf(e) === i);
    this.global.languages = languages;
    if (this.global.structure === undefined) {
      this.global.structure = new Folder("project_name", undefined);
    }
    let newStructure = new Folder(this.global.structure.getName(), undefined);
    if (this.settings.importFusion !== "no") {
      newStructure = this.global.structure;
    } else {
      this.global.projectPath = undefined;
    }
    for (let i = 0; i < languages.length; i++) {
      this._walkInJson(files[i], "default", newStructure, languages[i]);
    }
    this.global.setStructure(newStructure);
    this.global.loading = false;
  }

  _walkInJson(
    holder: object,
    key: string,
    structure: Folder,
    language: string
  ) {
    let k;
    const json = holder[key];
    if (json && typeof json === "object") {
      for (k in json) {
        if (Object.prototype.hasOwnProperty.call(json, k)) {
          const keys = Object.keys(json[k]);
          if (typeof json[k] === "string") {
            const tradGroup = structure.findTraductionGroup(k);
            const trad = new Traduction(
              json[k],
              language,
              this.settings.autoValidate
            );
            if (tradGroup !== undefined) {
              const actualTrad = tradGroup.getTradByLanguage(language);
              if (actualTrad !== undefined) {
                if (this.settings.importFusion === "yes_new") {
                  tradGroup.removeTraduction(actualTrad);
                  tradGroup.addTraduction(trad);
                }
              } else {
                tradGroup.addTraduction(trad);
              }
            } else {
              structure.addTraductionGroup(
                new TraductionsGroup(k, structure, [trad])
              );
            }
          } else if (json[k] !== undefined) {
            let folder = structure.findFolder(k);
            if (folder === undefined) {
              folder = new Folder(k, structure);
              structure.addFolder(folder);
            }
            this._walkInJson(json, k, folder, language);
          } else {
            delete json[k];
          }
        }
      }
    }
  }

  _exportToCsv(
    structure: Structure,
    csv: string = "",
    key: string = ""
  ): string {
    if (csv == "") {
      if (this.global.languages.length > 0) {
        csv = "id";
        for (const language of this.global.languages) {
          csv += this.settings.separatorCharCsv + language;
        }
        csv += "\n";
      }
    }
    var existingKey = [];
    if (structure instanceof Folder) {
      key += structure.getName() + this.settings.folderCharCsv;
      for (const folder of structure.folderList) {
        csv = this._exportToCsv(folder, csv, key);
      }
      for (const trad of structure.tradGroupList) {
        if (
          !this.settings.folderNameOnlyForDoublon ||
          existingKey.includes(trad.getName())
        ) {
          csv += key + trad.getName();
        } else {
          csv += trad.getName();
          existingKey.push(trad.getName());
        }

        for (const t of trad.tradList) {
          csv += this.settings.separatorCharCsv + t.getValue();
        }
        csv += "\n";
      }
    }
    return csv;
  }

  _exportToJsons(structure: Structure, language: string): object {
    const json: object = {};
    if (structure instanceof Folder) {
      for (const folder of structure.folderList) {
        json[folder.getName()] = this._exportToJsons(folder, language);
      }
      for (const trad of structure.tradGroupList) {
        for (const t of trad.tradList) {
          if (t.language === language) {
            json[trad.getName()] = t.getValue();
          }
        }
      }
    }
    return json;
  }

  getCsvPreview() {
    const csv = this._exportToCsv(this.global.structure);
    const delimiter = this.settings.separatorCharCsv;
    let res = [];
    if (csv.includes(delimiter)) {
      let csv_arr = csv.split("\n");

      for (var k of csv_arr) {
        if (k.includes(delimiter)) {
          res.push(k.split(delimiter));
        }
      }
    }

    return res;
  }

  getJsonPreview() {
    const res = [];
    for (const language of this.global.languages) {
      res.push(
        JSON.stringify(
          this._exportToJsons(this.global.structure, language),
          undefined,
          2
        )
      );
    }
    return res;
  }

  async downloadCsv() {
    this.global.loading = true;
    let csv = this._exportToCsv(this.global.structure);
    const blob = new Blob(["\uFEFF" + csv], {
      type: "text/csv; charset=utf-8",
    });
    saveAs(blob, this.global.structure.getName() + ".csv");
    this.global.loading = false;
  }

  async downloadJsons() {
    this.global.loading = true;
    const zip = new JSZip();
    const jsons = {};
    for (const language of this.global.languages) {
      jsons[language] = this._exportToJsons(this.global.structure, language);
    }

    for (const key of Object.keys(jsons)) {
      zip.file(key + ".json", JSON.stringify(jsons[key]));
    }
    const data = await zip.generateAsync({ type: "blob" });
    const blob = new Blob([data], { type: "application/zip" });
    saveAs(blob, this.global.structure.getName() + ".zip");
    this.global.loading = false;
  }

  _load_in18(holder: object, key: string, structure: Folder) {
    let k;
    const json = holder[key];
    if (json && typeof json === "object") {
      for (k in json) {
        if (Object.prototype.hasOwnProperty.call(json, k)) {
          const keys = Object.keys(json[k]);
          if (
            typeof json[k] === "object" &&
            json[k][keys[0]] !== undefined &&
            json[k][keys[0]].hasOwnProperty("value") &&
            typeof json[k][keys[0]].value === "string"
          ) {
            for (const i of keys) {
              this.global.addLanguage(i);
              const tradGroup = structure.findTraductionGroup(k);
              const trad = new Traduction(
                json[k][i].value,
                i,
                json[k][i].checked
              );
              if (tradGroup !== undefined) {
                tradGroup.addTraduction(trad);
              } else {
                structure.addTraductionGroup(
                  new TraductionsGroup(k, structure, [trad])
                );
              }
            }
          } else if (json[k] !== undefined) {
            let folder = structure.findFolder(k);
            if (folder === undefined) {
              folder = new Folder(k, structure);
              structure.addFolder(folder);
            }
            this._load_in18(json, k, folder);
          } else {
            delete json[k];
          }
        }
      }
    }
  }

  load_in18(path = "", noExplorer = false) {
    if (this.electronService.isElectronApp) {
      this.electronService.ipcRenderer.send("load-file", path, noExplorer);
    }
  }

  load(data: string, path: string="") {
    const extension: string = path.split(".").pop().toLowerCase();
    console.log(extension)
    switch (extension) {
      case "json":
        this.importJsonFiles(
          [{ default: JSON.parse(data), path: path }],
          [path.split(/.*[\/|\\]/).pop().split(".").shift()]
        );
        break;
      case "csv":
        this.importCsvFile(data,path);
        break;
      default:
        this.settings.addRecentProjectPath(path);
        this.global.loading = true;
        var obj = JSON.parse(data);
        if (this.global.structure === undefined) {
          this.global.structure = new Folder("project_name", undefined);
        }
        if (Object.keys(obj).length == 1) {
          this.global.structure.setName(Object.keys(obj)[0]);
        } else {
          obj = { default: obj };
        }
        const newStructure = new Folder(
          this.global.structure.getName(),
          undefined
        );
        this.global.languages = [];
        this._load_in18(obj, Object.keys(obj)[0], newStructure);
        this.global.setStructure(newStructure);
        this.global.updateSavedStructure();
        this.global.projectPath = path;
        this.global.setSelectedStructure();
        this.presentLoadedToast();
        this.global.loading = false;
        break;
    }
  }

  async presentLoadedToast() {
    const toast = await this.toastController.create({
      message: "Project loaded.",
      duration: 2000,
    });
    await toast.present();
  }

  async download(as = false) {
    this.global.loading = true;
    const obj = this.global.savein18();
    const json = JSON.stringify(obj);
    if (!this.global.isSaved() || as) {
      if (!this.electronService.isElectronApp) {
        this.fileSaveAs(json);
      } else {
        let tmp;
        if (!as) {
          tmp = this.global.projectPath;
        }
        this.electronService.ipcRenderer.send(
          "save-file",
          json,
          tmp,
          this.global.structure.getName() + ".in18"
        );
      }
    } else {
      this.global.loading = false;
    }
  }

  fileSaveAs(data: string, name = this.global.structure.getName() + ".in18") {
    const blob = new Blob([data], { type: "application/json" });
    saveAs(blob, name);
    this.global.updateSavedStructure();
    this.global.loading = false;
  }

  /*async fileWrite(data: string) {
    console.log(this.global.projectPath);
    try {
      const result = await Filesystem.writeFile({
        path: this.global.projectPath,
        data,
        encoding: FilesystemEncoding.UTF8
      });
      console.log(result);
      this.global.updateSavedStructure();
    } catch (e) {
      this.fileSaveAs(data);
    }
  }*/
}
