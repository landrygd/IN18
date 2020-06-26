import { Injectable } from '@angular/core';
import * as JSZip from 'jszip';
import { saveAs } from 'file-saver';

// Fichiers tests //
import * as  de from '../../assets/examples/de.json';
import * as  en from '../../assets/examples/en.json';
import * as  es from '../../assets/examples/es.json';
import * as  fr from '../../assets/examples/fr.json';
import * as  it from '../../assets/examples/it.json';
import * as  ja from '../../assets/examples/ja.json';
import * as  nl from '../../assets/examples/nl.json';
import * as  pt from '../../assets/examples/pt.json';

@Injectable({
  providedIn: 'root'
})
export class GlobalService {

  structure = {};

  constructor() {
    this.test();
  }

  test() {
    this.loadProjectStructure([de, en, es, fr, it, ja, nl, pt], ['de', 'en', 'es', 'fr', 'it', 'ja', 'nl', 'pt']);
  }

  loadProjectStructure(files: any[], languages: string[]) {
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
            this.modifyJson(this.structure, subPath + '.' + languages[i], subObj);
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

  updatePath(path: string, value: string, lang: string) {
    console.log({path, value, lang});
    console.log(this.structure);
    this.modifyJson(this.structure, path, value);
    return this.structure;
  }

  export(): any[] {
    const docs: any = {};
    const paths = ['default'];
    while (paths.length > 0) {
      const path = paths.shift();
      const obj = this.modifyJson(this.structure, path);
      for (const key of Object.keys(obj)) {
        let subPath = path + '.' + key;
        const subObj = this.modifyJson(this.structure, subPath);
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
}