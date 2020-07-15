import { Injectable } from '@angular/core';
import { GlobalService } from './global.service';
import { Folder } from '../classes/folder';
import { SettingsService } from './settings.service';
import { TraductionsGroup } from '../classes/traductions-group';
import { Traduction } from '../classes/traduction';
import { saveAs } from 'file-saver';
import { Structure } from '../classes/structure';
import * as JSZip from 'jszip';

@Injectable({
  providedIn: 'root'
})
export class ImportExportService {
  constructor(private global: GlobalService, private settings: SettingsService) { }


  CSVToArray(strData, strDelimiter = ','): string[][] {

    // Create a regular expression to parse the CSV values.
    const objPattern = new RegExp(
      (
        // Delimiters.
        '(\\' + strDelimiter + '|\\r?\\n|\\r|^)' +

        // Quoted fields.
        '(?:"([^"]*(?:""[^"]*)*)"|' +

        // Standard fields.
        '([^"\\' + strDelimiter + '\\r\\n]*))'
      ),
      'gi'
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
    while (arrMatches = objPattern.exec(strData)) {

      // Get the delimiter that was found.
      const strMatchedDelimiter = arrMatches[1];

      // Check to see if the given delimiter has a length
      // (is not the start of string) and if it matches
      // field delimiter. If id does not, then we know
      // that this delimiter is a row delimiter.
      if (
        strMatchedDelimiter.length &&
        strMatchedDelimiter !== strDelimiter
      ) {

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
        strMatchedValue = arrMatches[2].replace(
          new RegExp('""', 'g'),
          '"'
        );

      } else {

        // We found a non-quoted value.
        strMatchedValue = arrMatches[3];

      }


      // Now that we have our value string, let's add
      // it to the data array.
      arrData[arrData.length - 1].push(strMatchedValue);
    }

    // Return the parsed data.
    return (arrData);
  }

  async importCsvFile(file: File, separator = this.settings.folderCharCsv) {
    const csvArray: string[][] = this.CSVToArray(await file.text());
    let newStructure: Folder = new Folder(this.global.projectName, undefined);
    if (this.settings.importFusion !== 'no') {
      newStructure = this.global.structure;
    }
    if (csvArray.length > 1) {
      const languages: string[] = [];
      for (let k = 1; k < csvArray[0].length; k++) {
        languages.push(csvArray[0][k]);
      }
      if (languages.length > 0) {
        for (let k = 1; k < csvArray.length; k++) {
          const res: string[] = csvArray[k][0].split(separator);
          let currentFolder: Folder = newStructure;
          let currentTrad: TraductionsGroup;
          for (let i = 0; i < res.length; i++) {
            if (i === res.length - 1) {
              currentFolder.addTraductionGroup(new TraductionsGroup(res[i], currentFolder, []));
              currentTrad = currentFolder.findTraductionGroup(res[i]);
            } else {
              currentFolder.addFolder(new Folder(res[i], currentFolder));
              currentFolder = currentFolder.findFolder(res[i]);
            }
          }
          for (let i = 1; i < csvArray[k].length; i++) {
            const actualTrad = currentTrad.getTradByLanguage(csvArray[0][i]);
            const trad = new Traduction(csvArray[k][i], csvArray[0][i], this.settings.autoValidate);
            if (actualTrad !== undefined) {
              if (this.settings.importFusion === 'yes_new') {
                currentTrad.removeTraduction(actualTrad);
                currentTrad.addTraduction(trad);
              }
            } else {
              currentTrad.addTraduction(trad);
            }
          }
        }
      }
      this.global.languages = languages.filter((e, i) => languages.indexOf(e) === i);
      this.global.setStructure(newStructure);
    }
  }


  async importJsonFiles(files: object[], languages: string[]) {
    languages = languages.filter((e, i) => languages.indexOf(e) === i);
    this.global.languages = languages;
    let newStructure = new Folder(this.global.projectName, undefined);
    if (this.settings.importFusion !== 'no') {
      newStructure = this.global.structure;
    }
    for (let i = 0; i < languages.length; i++) {

      this.walkInJson(files[i], 'default', newStructure, languages[i]);

    }
    this.global.setStructure(newStructure);
  }

  walkInJson(holder: object, key: string, structure: Folder, language: string) {

    let k;
    const json = holder[key];
    if (json && typeof json === 'object') {
      for (k in json) {
        if (Object.prototype.hasOwnProperty.call(json, k)) {
          const keys = Object.keys(json[k]);
          if (typeof json[k] === 'string') {
            const tradGroup = structure.findTraductionGroup(k);
            const trad = new Traduction(json[k], language, this.settings.autoValidate);
            if (tradGroup !== undefined) {
              const actualTrad = tradGroup.getTradByLanguage(language);
              if (actualTrad !== undefined) {
                if (this.settings.importFusion === 'yes_new') {
                  tradGroup.removeTraduction(actualTrad);
                  tradGroup.addTraduction(trad);
                }
              } else {
                tradGroup.addTraduction(trad);
              }
            } else {
              structure.addTraductionGroup(new TraductionsGroup(k, structure, [trad]));
            }

          }
          else if (json[k] !== undefined) {
            let folder = structure.findFolder(k);
            if (folder === undefined) {
              folder = new Folder(k, structure);
              structure.addFolder(folder);
            }
            this.walkInJson(json, k, folder, language);

          } else {
            delete json[k];
          }
        }
      }
    }
  }

  exportToCsv(structure: Structure, csv: string, key: string = '', delimitor = ',', separator = this.settings.folderCharCsv): string{
    if (structure instanceof Folder) {
      key += structure.getName() + separator;
      for (const folder of structure.folderList) {
        csv = this.exportToCsv(folder, csv, key);
      }
      for (const trad of structure.tradGroupList) {
        csv += key + trad.getName();
        for (const t of trad.tradList) {
          csv += delimitor + t.getValue();
        }
        csv += '\n';
      }
    }
    return csv;
  }

  exportToJsons(structure: Structure, language: string): object {
    const json: object = {};
    if (structure instanceof Folder) {
      for (const folder of structure.folderList) {
        json[folder.getName()] = this.exportToJsons(folder, language);
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

  async downloadCsv(delimitor = ',', separator = this.settings.folderCharCsv){
    let csv = 'id';
    for (const language of this.global.languages){
      csv += delimitor + language;
    }
    csv += '\n';
    csv = this.exportToCsv(this.global.structure, csv);
    const blob = new Blob([csv], { type: 'text/csv' });
    saveAs(blob, this.global.projectName + '.csv');
  }

  async downloadJsons() {
    const zip = new JSZip();
    const jsons = {};
    for (const language of this.global.languages) {
      jsons[language] = this.exportToJsons(this.global.structure, language);
      console.log(jsons[language]);
    }

    for (const key of Object.keys(jsons)) {
      zip.file(key + '.json', JSON.stringify(jsons[key]));
    }
    const data = await zip.generateAsync({ type: 'blob' });
    const blob = new Blob([data], { type: 'application/zip' });
    saveAs(blob, this.global.projectName + '.zip');
  }

  

  loadin18(holder: object, key: string, structure: Folder) {

    let k;
    const json = holder[key];
    if (json && typeof json === 'object') {
      for (k in json) {
        if (Object.prototype.hasOwnProperty.call(json, k)) {
          const keys = Object.keys(json[k]);
          if (typeof json[k] === 'object' && json[k][keys[0]].hasOwnProperty('value') && typeof json[k][keys[0]].value === 'string') {
            for (const i of keys) {
              this.global.addLanguage(i);
              const tradGroup = structure.findTraductionGroup(k);
              const trad = new Traduction(json[k][i].value, i, json[k][i].checked);
              if (tradGroup !== undefined) {
                tradGroup.addTraduction(trad);
              } else {
                structure.addTraductionGroup(new TraductionsGroup(k, structure, [trad]));
              }
            }


          }
          else if (json[k] !== undefined) {
            let folder = structure.findFolder(k);
            if (folder === undefined) {
              folder = new Folder(k, structure);
              structure.addFolder(folder);
            }
            this.loadin18(json, k, folder);

          } else {
            delete json[k];
          }
        }
      }
    }
  }


  async load(file: File) {
    const obj = { default: JSON.parse(await file.text()) };
    console.log(obj);
    const newStructure = new Folder(this.global.projectName, undefined);
    this.global.languages = [];
    this.loadin18(obj, 'default', newStructure);
    console.log(newStructure);
    this.global.setStructure(newStructure);
  }

  async download() {
    const obj = this.global.savein18();
    const json = JSON.stringify(obj);
    if (json !== JSON.stringify(this.global.lastSavedStrcture)) {
      this.global.updateSavedStructure();
      const blob = new Blob([json], { type: 'application/json' });
      saveAs(blob, 'project.in18');
    }
  }
}
