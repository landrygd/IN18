import { Injectable } from '@angular/core';
import * as JSZip from 'jszip';
import { saveAs } from 'file-saver';

import { Subject, BehaviorSubject, Observable, of } from 'rxjs';
import { Traduction } from '../classes/traduction';
import { Folder } from '../classes/folder';
import { TraductionsGroup } from '../classes/traductions-group';
import { Structure } from '../classes/structure';

@Injectable({
  providedIn: 'root'
})
export class GlobalService {

  structure: Folder = new Folder('root', undefined);
  selectedStructure: Structure;
  selectedFolder: Folder;
  languages: string[] = [];
  paths: any;

  selectedTragGroups$: Observable<TraductionsGroup[]>;
  selectedFolders$: Observable<Folder[]>;

  constructor() {
    this.setSelectedStructure();
  }

  async setSelectedStructure(structure: Structure = this.structure) {
    if (structure instanceof TraductionsGroup){
      this.setSelectedFolder(structure.parentFolder);
    }else if (structure instanceof Folder){
      this.setSelectedFolder(structure);
    }
    this.selectedTragGroups$ = of(this.getSelectedFolder().tradGroupList);
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

  setSelectedFolder(folder: Folder){
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
    let exist = this.languages.find(e => e == language)
    if (exist){
      this.languages=this.languages.filter(l => l !== exist)
      this.majLanguages(this.structure);
      return true;
    }else{
      return false;
    }
  }
  
  

  addLanguage(language: string): boolean{
    let exist = this.languages.find(e => e == language)
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
        this.majLanguages(k)
      }
      for (const k of structure.tradGroupList){
        this.majLanguages(k)
      }
    }else if (structure instanceof TraductionsGroup){
      structure.removeTradWrongLanguage(this.languages);
      structure.addMissingTrad(this.languages);
    }

  }

  importJsonFiles(files: object[], languages: string[]) {
    this.languages = languages.filter((e,i)=>{return languages.indexOf(e) === i});
    const newStructure = new Folder('root', undefined);
    for (let i = 0; i < this.languages.length; i++) {

      this.walkInJson(files[i], 'default', newStructure, this.languages[i]);

    }
    this.structure = newStructure;
    this.setSelectedStructure(this.structure);
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
    let json: object = {}
    if (structure instanceof Folder){
      for (const folder of structure.folderList){
        json[folder.getName()] = this.exportToJsons(folder, language);
      }
      for (const trad of structure.tradGroupList){
        for (const t of trad.tradList){
          if (t.language == language){
            json[trad.getName()] = t.getValue();
          }
          
        }
      }
    }
    return json;
  }

  async downloadJsons() {
    const zip = new JSZip();
    let jsons = {};
    for (const language of this.languages){
      jsons[language] = this.exportToJsons(this.structure,language);
      console.log(jsons[language])
    }
    
    for (const key of Object.keys(jsons)) {
      zip.file(key + '.json', JSON.stringify(jsons[key]));
    }
    const data = await zip.generateAsync({ type: 'blob' });
    const blob = new Blob([data], { type: 'application/zip' });
    saveAs(blob, 'save.zip');
  }

}
