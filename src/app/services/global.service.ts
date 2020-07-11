import { Injectable } from '@angular/core';
import * as JSZip from 'jszip';
import { saveAs } from 'file-saver';

import { Subject, BehaviorSubject, Observable, of, interval } from 'rxjs';
import { Traduction } from '../classes/traduction';
import { Folder } from '../classes/folder';
import { TraductionsGroup } from '../classes/traductions-group';
import { Structure } from '../classes/structure';
import { map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class GlobalService {

  structure: Folder = new Folder('root', undefined);
  lastSavedStrcture = JSON.stringify({});
  selectedStructure: Structure;
  selectedFolder: Folder;
  languages: string[] = [];
  paths: any;

  selectedTradGroups$: Observable<TraductionsGroup[]>;
  selectedFolders$: Observable<Structure[]>;


  constructor() {
    this.setSelectedStructure();
  }


  async setSelectedStructure(structure: Structure = this.structure) {
    if (structure instanceof TraductionsGroup){
      this.setSelectedFolder(structure.parentFolder);
    }else if (structure instanceof Folder){
      this.setSelectedFolder(structure);
    }
    this.selectedTradGroups$ = of(this.getSelectedFolder().tradGroupList);
    this.selectedFolders$ = of(this.getSelectedFolder().folderList);
    this.selectedStructure = structure;
  }

  getSelectedStructureAsTradGroup(): TraductionsGroup{
    if (this.selectedStructure instanceof TraductionsGroup){
      return this.selectedStructure;
    }else{
      return undefined;
    }
  }

  isSelectedStructureFolder(){
    return this.selectedStructure instanceof Folder;
  }

  OneChildIsSelected(folder: Folder): boolean{
    for (const k of folder.folderList){
      if (k === this.selectedStructure) {
        return true;
      }else{
        return this.OneChildIsSelected(k);
      }
    }
    for (const k of folder.tradGroupList){
      if (k === this.selectedStructure) {
        return true;
      }
    }
    return false;

  }

  getSelectedFolder() {
    return this.selectedFolder === undefined ? this.structure : this.selectedFolder;
  }

  async setSelectedFolder(folder: Folder){
    this.selectedFolder = folder;
  }

  setStructure(newStructure) {
    this.structure = newStructure;
  }

  newProject() {
    this.setStructure(new Folder('root', undefined));
    this.setSelectedStructure();
  }

  test() {
    this.importJsonFiles([{ default: { test: { y: 'oui', n: 'non' } } }, { default: { test: { y: 'yes', n: 'no' } } }], ['fr', 'en']);
  }

  removeLanguage(language: string): boolean{
    const exist = this.languages.find(e => e === language);
    if (exist){
      this.languages = this.languages.filter(l => l !== exist);
      this.majLanguages(this.structure);
      return true;
    }else{
      return false;
    }
  }



  addLanguage(language: string): boolean{
    const exist = this.languages.find(e => e === language);
    if (exist){
      return false;
    }else{
      this.languages.push(language);
      this.majLanguages(this.structure);
      return true;
    }
  }

  majLanguages(structure: Structure){
    if (structure instanceof Folder){
      for (const k of structure.folderList){
        this.majLanguages(k);
      }
      for (const k of structure.tradGroupList){
        this.majLanguages(k);
      }
    }else if (structure instanceof TraductionsGroup){
      structure.removeTradWrongLanguage(this.languages);
      structure.addMissingTrad(this.languages);
    }

  }

  CSVToArray( strData, strDelimiter = ',' ): string[][]{

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
    while (arrMatches = objPattern.exec( strData )){

        // Get the delimiter that was found.
        const strMatchedDelimiter = arrMatches[ 1 ];

        // Check to see if the given delimiter has a length
        // (is not the start of string) and if it matches
        // field delimiter. If id does not, then we know
        // that this delimiter is a row delimiter.
        if (
            strMatchedDelimiter.length &&
            strMatchedDelimiter !== strDelimiter
            ){

            // Since we have reached a new row of data,
            // add an empty row to our data array.
            arrData.push( [] );

        }

        let strMatchedValue;

        // Now that we have our delimiter out of the way,
        // let's check to see which kind of value we
        // captured (quoted or unquoted).
        if (arrMatches[ 2 ]){

            // We found a quoted value. When we capture
            // this value, unescape any double quotes.
            strMatchedValue = arrMatches[ 2 ].replace(
                new RegExp( '""', 'g' ),
                '"'
                );

        } else {

            // We found a non-quoted value.
            strMatchedValue = arrMatches[ 3 ];

        }


        // Now that we have our value string, let's add
        // it to the data array.
        arrData[ arrData.length - 1 ].push( strMatchedValue );
    }

    // Return the parsed data.
    return( arrData );
}

  async importCsvFile(file: File, separator = '.') {
    const  csvArray: string[][] = this.CSVToArray(await file.text());
    const newStructure: Folder = new Folder('root', undefined);
    console.log(csvArray);
    if (csvArray.length > 1){
      const languages: string[] = [];
      for (let k = 1; k < csvArray[0].length; k++){
        languages.push(csvArray[0][k]);
      }
      if (languages.length > 0){
        for (let k = 1; k < csvArray.length; k++){
          const res: string[] = csvArray[k][0].split(separator);
          let currentFolder: Folder = newStructure;
          let currentTrad: TraductionsGroup;
          console.log(res)
          for (let i = 0; i < res.length; i++){
            if (i === res.length - 1){
              currentFolder.addTraductionGroup(new TraductionsGroup(res[i], currentFolder, []));
              currentTrad = currentFolder.findTraductionGroup(res[i]);
              console.log(currentFolder)
              console.log(currentTrad)
            }else{
              currentFolder.addFolder(new Folder(res[i], currentFolder));
              currentFolder = currentFolder.findFolder(res[i]);
            }
          }
          for (let i = 1; i < csvArray[k].length; i++){
            console.log( csvArray[0][i])
            currentTrad.addTraduction(new Traduction(csvArray[k][i], csvArray[0][i]));
            console.log(currentTrad.tradList);
          }
        }
      }
      this.languages = languages;
      this.structure = newStructure;
      this.setSelectedStructure(this.structure);
      this.majLanguages(this.structure);
    }
  }

  async importJsonFiles(files: object[], languages: string[]) {
    this.languages = languages.filter((e, i) => languages.indexOf(e) === i);
    const newStructure = new Folder('root', undefined);
    for (let i = 0; i < this.languages.length; i++) {

      this.walkInJson(files[i], 'default', newStructure, this.languages[i]);

    }
    this.structure = newStructure;
    this.setSelectedStructure(this.structure);
    this.majLanguages(this.structure);
  }

  walkInJson(holder: object, key: string, structure: Folder, language: string) {

    let k;
    const json = holder[key];
    if (json && typeof json === 'object') {
      for (k in json) {
        if (Object.prototype.hasOwnProperty.call(json, k)) {
          // obj = this.walk(json, k, structure, language);
          const keys = Object.keys(json[k]);
          if (typeof json[k] === 'string') {
            const tradGroup = structure.findTraductionGroup(k);
            const trad = new Traduction(json[k], language);
            if (tradGroup !== undefined) {
              tradGroup.addTraduction(trad);
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

  modifyJson(obj, is, value = '') {
    if (typeof is === 'string') {
      return this.modifyJson(obj, is.split('.'), value);
    } else if (is.length === 1 && value !== '') {
      return obj[is[0]] = value;
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

  exportToJsons(structure: Structure, language: string): object {
    const json: object = {};
    if (structure instanceof Folder){
      for (const folder of structure.folderList){
        json[folder.getName()] = this.exportToJsons(folder, language);
      }
      for (const trad of structure.tradGroupList){
        for (const t of trad.tradList){
          if (t.language === language){
            json[trad.getName()] = t.getValue();
          }

        }
      }
    }
    return json;
  }

  async downloadJsons() {
    const zip = new JSZip();
    const jsons = {};
    for (const language of this.languages){
      jsons[language] = this.exportToJsons(this.structure, language);
      console.log(jsons[language]);
    }

    for (const key of Object.keys(jsons)) {
      zip.file(key + '.json', JSON.stringify(jsons[key]));
    }
    const data = await zip.generateAsync({ type: 'blob' });
    const blob = new Blob([data], { type: 'application/zip' });
    saveAs(blob, 'save.zip');
  }

  savein18(structure: Structure): object {
    const json: object = {};
    if (structure instanceof Folder){
      for (const folder of structure.folderList){
        json[folder.getName()] = this.savein18(folder);
      }
      for (const trad of structure.tradGroupList){
        json[trad.getName()] = {};
        for (const t of trad.tradList){
            json[trad.getName()][t.language] = {value : t.value, checked : t.checked};

        }
      }
    }
    return json;
  }

  loadin18(holder: object, key: string, structure: Folder) {

    let k;
    const json = holder[key];
    if (json && typeof json === 'object') {
      for (k in json) {
        if (Object.prototype.hasOwnProperty.call(json, k)) {
          const keys = Object.keys(json[k]);
          if (typeof json[k] === 'object' && json[k][keys[0]].hasOwnProperty('value') && typeof json[k][keys[0]].value === 'string') {
            for (const i of keys){
              if (this.languages.indexOf(i) === -1){
                this.languages.push(i);
              }
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


  async load(file){
    const obj = {default: JSON.parse(await file.text())};
    console.log(obj);
    const newStructure = new Folder('root', undefined);
    this.languages = [];
    this.loadin18(obj, 'default', newStructure);
    console.log(newStructure);
    this.structure = newStructure;
    this.setSelectedStructure(this.structure);
    this.majLanguages(this.structure);
  }

  async download(){
    const obj = this.savein18(this.structure);
    const json = JSON.stringify(obj);
    if (json !== this.lastSavedStrcture){
      this.lastSavedStrcture = json;
      const blob = new Blob([json], { type: 'application/json' });
      saveAs(blob, 'project.in18');
    }
  }

}
