import { Injectable } from '@angular/core';
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
      for (let j = 0; j < 1000; j++) {
        if (paths.length > 0) {
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
}
