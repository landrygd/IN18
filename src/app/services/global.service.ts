import { Injectable } from '@angular/core';
import * as JSZip from 'jszip';
import { saveAs } from 'file-saver';

import { Subject, BehaviorSubject } from 'rxjs';
import { Traduction } from '../classes/traduction';

@Injectable({
  providedIn: 'root'
})
export class GlobalService {

  structure = {};
  languages = [];
  paths = [];
  observablestructure = new BehaviorSubject<object>(this.structure);

  constructor() {}

  setStructure(newStructure) {
    this.structure = newStructure;
    this.observablestructure.next(this.structure);
    console.log(this.observablestructure);
    }

  newProject(){
    this.setStructure({});
    console.log('new project');
  }

  loadProjectStructure(files: any[], languages: string[]) {
    console.log(files, languages);
    const structureCopy = {};
    this.languages = languages;
    for (let i = 0; i < languages.length; i++) {
      const paths = ['default'];
      while (paths.length > 0) {
        const path = paths.shift();
        const obj = this.modifyJson(files[i], path);
        for (const key of Object.keys(obj)) {
          const subPath = path + '.' + key;
          const subObj = this.modifyJson(files[i], subPath);
          if (typeof subObj === 'object') {
            paths.push(subPath);
          } else {
            this.modifyJson(structureCopy, subPath + '.' + languages[i], subObj);
          }
        }
      }
    }
    this.setStructure(structureCopy);
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
    console.log(traduction.getPath());
    const structureCopy = this.structure;
    this.modifyJson(structureCopy, traduction.getPathWithLanguage(), traduction.getValue());
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
