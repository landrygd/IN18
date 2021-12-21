import { Injectable } from "@angular/core";
import { Observable, of } from "rxjs";
import { Folder } from "../classes/folder";
import { TraductionsGroup } from "../classes/traductions-group";
import { Structure } from "../classes/structure";
import { SettingsService } from "./settings.service";
import { ElectronService } from "ngx-electron";

@Injectable({
  providedIn: "root",
})
export class GlobalService {
  version:string = "1.3.0"
  availableLanguages:String[];

  projectPath: string;
  ExportingPaths: object = {};
  structure: Folder; //= new Folder('project_name', undefined);
  lastSavedStrcture: object;
  selectedStructure: Structure;
  selectedFolder: Folder;
  languages: string[] = [];
  mainLanguage: string;
  paths: any;

  loading: boolean = false;
  filter: string = "";

  isCut: boolean = false;
  copyItem: Structure;

  selectedTradGroups$: Observable<TraductionsGroup[]>;
  selectedFolders$: Observable<Structure[]>;

  constructor(
    private setting: SettingsService,
    private electronService: ElectronService
  ) {
    if (this.electronService.isElectronApp) {
      this.structure = undefined;
    } else {
      this.newProject();
    }
    this.setSelectedStructure();
    this.updateSavedStructure();
  }

  // Set selectedstructure with the folder or the item which is selected, set the new selected folder (parent folder if it's an item)
  async setSelectedStructure(structure: Structure = this.structure) {
    if (structure !== undefined) {
      if (structure instanceof TraductionsGroup) {
        this.setSelectedFolder(structure.parentFolder);
      } else if (structure instanceof Folder) {
        this.setSelectedFolder(structure);
      }
      this.selectedTradGroups$ = of(this.getSelectedFolder().tradGroupList);
      this.selectedFolders$ = of(this.getSelectedFolder().folderList);
      this.selectedStructure = structure;
    }
  }

  // update lastsavedstructure when we save the structure
  updateSavedStructure() {
    this.lastSavedStrcture = this.savein18();
  }

  isSaved(): boolean {
    return (
      JSON.stringify(this.lastSavedStrcture) ===
      JSON.stringify(this.savein18())
    );
  }

  hasProject(): boolean {
    return this.structure !== undefined;
  }

  getProjectName(): String {
    return this.structure === undefined ? "" : this.structure.getName();
  }

  // get selectedstructure only if it's an item
  getSelectedStructureAsTradGroup(): TraductionsGroup {
    if (this.selectedStructure instanceof TraductionsGroup) {
      return this.selectedStructure;
    } else {
      return undefined;
    }
  }

  isSelectedStructureFolder(): boolean {
    return this.selectedStructure instanceof Folder;
  }

  // false if all children aren't selected
  OneChildIsSelected(folder: Folder): boolean {
    for (const k of folder.folderList) {
      if (k === this.selectedStructure) {
        return true;
      } else {
        return this.OneChildIsSelected(k);
      }
    }
    for (const k of folder.tradGroupList) {
      if (k === this.selectedStructure) {
        return true;
      }
    }
    return false;
  }

  getSelectedFolder() {
    return this.selectedFolder === undefined
      ? this.structure
      : this.selectedFolder;
  }

  async setSelectedFolder(folder: Folder) {
    this.selectedFolder = folder;
  }

  // to set a new structure, also select it and update the languages list
  setStructure(newStructure) {
    this.structure = newStructure;
    this.setSelectedStructure(this.structure);
    this.majLanguages(this.structure);
  }

  newProject() {
    this.setStructure(new Folder("project_name", undefined));
    this.languages = [];
    this.setSelectedStructure();
    this.projectPath = undefined;
    this.ExportingPaths = {};
    this.mainLanguage = undefined;
  }

  setFilter(newFilter: string) {
    this.filter = newFilter;
  }

  setMainLanguage(newMainLanguage: string) {
    if (this.languages.includes(newMainLanguage)){
      this.mainLanguage = newMainLanguage;
    }
  }

  isValidPaste(newParent: Structure): boolean {
    if (newParent instanceof Folder) {
      if (this.copyItem !== undefined) {
        if (!newParent.has(this.copyItem as Structure)) {
          return true;
        }
      }
    }
    return false;
  }

  paste(newParent: Structure) {
    if (newParent instanceof Folder) {
      if (this.isValidPaste(newParent)) {
        if (this.isCut) {
          this.removeItem(this.copyItem);
          newParent.add(this.copyItem);
        } else {
          newParent.add(this.copyItem.clone());
        }
      }
    }
    this.copyItem = undefined;
  }

  removeItem(item: Structure) {
    if (item instanceof Folder) {
      if (item.parentFolder.removeFolder(item)) {
        this.setSelectedStructure();
      }
    } else if (item instanceof TraductionsGroup) {
      if (item.parentFolder.removeTradGroup(item)) {
        this.setSelectedStructure(this.selectedFolder);
      }
    }
  }

  /*test() {
    this.importJsonFiles([{ default: { test: { y: 'oui', n: 'non' } } }, { default: { test: { y: 'yes', n: 'no' } } }], ['fr', 'en']);
  }*/

  removeLanguage(language: string): boolean {
    const exist = this.languages.find((e) => e === language);
    if (exist) {
      this.languages = this.languages.filter((l) => l !== exist);
      this.majLanguages(this.structure);
      if (! this.languages.includes(this.mainLanguage)){
        this.mainLanguage = this.languages.length>0? this.languages[0]:undefined;
      }
      if (this.electronService.isElectronApp) {
        this.electronService.ipcRenderer.send(
          "update-languages",
          this.languages
        );
      }
      return true;
    } else {
      return false;
    }
  }

  setLanguages(newLanguages: string[]){
    newLanguages = newLanguages.filter((e, i) => newLanguages.indexOf(e) === i);
    this.languages = newLanguages;
    this.majLanguages(this.structure);
    if (this.mainLanguage === undefined){
      this.mainLanguage = this.languages.length>0? this.languages[0]:undefined;
    }
    if (this.electronService.isElectronApp) {
      this.electronService.ipcRenderer.send(
        "update-languages",
        this.languages
      );
    }
  }

  addLanguage(language: string): boolean {
    const exist = this.languages.find((e) => e === language);
    if (exist) {
      return false;
    } else {
      this.languages.push(language);
      this.majLanguages(this.structure);
      if (this.mainLanguage === undefined){
        this.mainLanguage = this.languages[0];
      }
      if (this.electronService.isElectronApp) {
        this.electronService.ipcRenderer.send(
          "update-languages",
          this.languages
        );
      }
      return true;
    }
  }

  swapLanguage(oldLanguage:string,newLanguage:string):boolean{
    const existNew = this.languages.find((e) => e === newLanguage);
    const existOld = this.languages.find((e) => e === oldLanguage);
    if (existNew || !existOld) {
      return false;
    } else {
      let i = this.languages.indexOf(oldLanguage);
      if (i!==-1){
        this.languages[i]=newLanguage;
        this._swapLanguage(this.structure,oldLanguage,newLanguage);
        this.majLanguages(this.structure);
        if (this.mainLanguage === oldLanguage){
          this.mainLanguage = newLanguage;
        }
        if (this.mainLanguage === undefined){
          this.mainLanguage = this.languages[0];
        }
        if (this.electronService.isElectronApp) {
          this.electronService.ipcRenderer.send(
            "update-languages",
            this.languages
          );
      }
      return true;
      }
      return false;
      
    }
  }

  _swapLanguage(structure: Structure,oldLanguage:string,newLanguage:string){
    if (structure instanceof Folder) {
      for (const k of structure.folderList) {
        this._swapLanguage(k,oldLanguage,newLanguage);
      }
      for (const k of structure.tradGroupList) {
        this._swapLanguage(k,oldLanguage,newLanguage);
      }
    } else if (structure instanceof TraductionsGroup) {
      structure.swapTradLanguage(oldLanguage,newLanguage);
    }
  }

  majLanguages(structure: Structure) {
    if (structure instanceof Folder) {
      for (const k of structure.folderList) {
        this.majLanguages(k);
      }
      for (const k of structure.tradGroupList) {
        this.majLanguages(k);
      }
    } else if (structure instanceof TraductionsGroup) {
      structure.removeTradWrongLanguage(this.languages);
      structure.addMissingTrad(this.languages);
    }
  }

  modifyJson(obj, is, value = "") {
    if (typeof is === "string") {
      return this.modifyJson(obj, is.split("."), value);
    } else if (is.length === 1 && value !== "") {
      return (obj[is[0]] = value);
    } else if (is.length === 0) {
      return obj;
    } else {
      if (!obj[is[0]]) {
        obj[is[0]] = {};
      }
      return this.modifyJson(obj[is[0]], is.slice(1), value);
    }
  }

  getSubJSON(obj: any, path: string) {
    return this.modifyJson(obj, path);
  }

  getJSON(path: string) {
    return this.modifyJson(this.structure, path);
  }

  savein18(): object{
    const json:object={};
    json["version"] = this.version;
    json["mainLanguage"] = this.mainLanguage;
    json["ExportingPaths"] = this.ExportingPaths;
    json["project"] = this._savein18();
    return json;
  }

  _savein18(structure: Structure = this.structure): object {
    const json: object = {};
    if (this.structure !== undefined) {
      if (structure == this.structure) {
        json[structure.getName()] = {};
      }

      if (structure instanceof Folder) {
        for (const folder of structure.folderList) {
          if (structure == this.structure) {
            json[structure.getName()][folder.getName()] = this._savein18(folder);
          } else {
            json[folder.getName()] = this._savein18(folder);
          }
        }
        for (const trad of structure.tradGroupList) {
          if (structure == this.structure) {
            json[structure.getName()][trad.getName()] = {};
            for (const t of trad.tradList) {
              json[structure.getName()][trad.getName()][t.language] = {
                value: t.value,
                checked: t.checked,
              };
            }
          } else {
            json[trad.getName()] = {};
            for (const t of trad.tradList) {
              json[trad.getName()][t.language] = {
                value: t.value,
                checked: t.checked,
              };
            }
          }
        }
      }
    }
    return json;
  }

  getFileDirectory(path: String) {
    if (path.indexOf("/") == -1) {
      // windows
      return path.substring(0, path.lastIndexOf("\\")).split("\\").pop();
    } else {
      // unix
      return path.substring(0, path.lastIndexOf("/")).split("/").pop();
    }
  }

  getPrettyPath(path: String) {
    let tmp = path.split(/.*[\/|\\]/);
    let str: String = "";
    if (tmp.length > 1) {
      str += this.getFileDirectory(path);
      if (str != "") {
        str += "/";
      }
      str += tmp[1];
    } else {
      str = path;
    }
    return str;
  }
}
