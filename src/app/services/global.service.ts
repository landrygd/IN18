import { Injectable } from '@angular/core';
import * as JSZip from 'jszip';
import { saveAs } from 'file-saver';

import { Subject, BehaviorSubject } from 'rxjs';
import { Traduction } from '../classes/traduction';
import { Folder } from '../classes/folder';
import { TraductionsGroup } from '../classes/traductions-group';
import { Structure } from '../classes/structure';

@Injectable({
  providedIn: 'root'
})
export class GlobalService {

  structure: Folder = new Folder('root');
  selectedStructure: Structure;
  languages: any;
  paths: any;
  observablestructure = new BehaviorSubject<Folder>(this.structure);

  constructor() {
    this.test();
  }

  setStructure(newStructure) {
    this.structure = newStructure;
    this.observablestructure.next(this.structure);
    console.log(this.observablestructure);
    }

  newProject(){
    this.setStructure(new Folder('root'));
    console.log('new project');
  }

  test() {
    this.importJsonFiles([{"default":{"test": {"y": 'oui','n':'non'}}}, {"default":{"test": {"y": 'yes','n':'no'}}}], ['fr', 'en']);
  }

  importJsonFiles(files: object[], languages: string[]) {
    const newStructure = new Folder('root');
    for (let i = 0; i < languages.length; i++) {

      this.walkInJson(files[i], 'default', newStructure, languages[i]);

    }
    this.structure = newStructure;
    console.log(newStructure);
  }

  walkInJson(holder: object, key: string, structure: Folder, language: string) {

      let k;
      const json = holder[key];
      if (json && typeof json === 'object') {
          for (k in json) {
              if (Object.prototype.hasOwnProperty.call(json, k)) {
                  // obj = this.walk(json, k, structure, language);
                  const keys = Object.keys(json[k]);
                  if (typeof json[k] === 'string'){
                    const tradGroup = structure.findTraductionGroup(k);
                    const trad = new Traduction(k, json[k], language);
                    if (tradGroup !== undefined){
                      tradGroup.addTraduction(trad);
                    }else{
                      structure.addTraductionGroup(new TraductionsGroup(k, [trad]) );
                    }

                  }
                  else if (json[k] !== undefined) {
                    let folder = structure.findFolder(k);
                    if (folder === undefined){
                      folder = new Folder(k);
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

  updatePath(traduction: Traduction) {
    const structureCopy = this.structure;
    // this.modifyJson(structureCopy, traduction.getPathWithLanguage(), traduction.getValue());
    // this.setStructure(structureCopy)
    this.structure = structureCopy;
    return this.structure;
  }

  export(): any[] {
    const docs: any = {};
    const paths = ['default'];
    const structureCopy = this.structure;
    while (paths.length > 0) {
      const path = paths.shift();
      const obj = this.modifyJson(structureCopy, path);
      for (const key of Object.keys(obj)) {
        let subPath = path + '.' + key;
        const subObj = this.modifyJson(structureCopy, subPath);
        if (typeof subObj === 'object') {
          paths.push(subPath);
        } else {
          if (!Object.keys(docs).includes(key)) {
            docs[key] = {};
          }
          const subPathArr = subPath.split('.');
          subPathArr.pop();
          subPath = subPathArr.join('.');
          this.modifyJson(docs[key], subPath, subObj);
        }
      }
    }
    console.log(docs);
    return docs;
  }

  async download() {
    const zip = new JSZip();
    const exp = this.export();
    for (const key of Object.keys(exp)) {
      zip.file(key + '.json', JSON.stringify(exp[key].default));
    }
    const data = await zip.generateAsync({type: 'blob'});
    const blob = new Blob([data], { type: 'application/zip' });
    saveAs(blob, 'save.zip');
  }

  setPaths(paths) {
    this.paths = paths;
  }

  setPath(path, value) {
    console.log(path, value);
    this.modifyJson(this.structure, path, value);
    this.observablestructure.next(this.structure);
  }
}
