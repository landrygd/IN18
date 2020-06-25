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

  files: any;
  structure: any;

  constructor() {
    this.test();
  }

  test() {
    this.indexFiles([de, en, es, fr, it, ja, nl, pt], ['de', 'en', 'es', 'fr', 'it', 'ja', 'nl', 'pt']);
    this.loadProjectStructure('fr');
  }

  indexFiles(files: any[], languages: string[]) {
    for (let i; i < files.length; i++) {
      this.files[languages[i]] = files[i];
    }
  }

  loadProjectStructure(primaryLang: string) {
    let paths: string[];
    for (const langName of this.files) {
      this.recursivePath(paths, langName);
    }
  }

  recursivePath(paths: string[], language: string) {
    if (paths === undefined) {
      paths = [];
      for (const key of this.files[language]) {
        if (Object.keys(key).length > 0) {
          paths.push(key);
        }
      }
    }
    for (const key of this.files[language]) {
      if (Object.keys(key).length > 0) {
        paths.push(key);
      }
    }
  }

  modifyJson(obj, is, value) {
    if (typeof is === 'string') {
      return this.modifyJson(obj, is.split('.'), value);
    } else if (is.length === 1 && value !== undefined) {
      return obj[is[0]] = value;
    } else if (is.length === 0) {
      return obj;
    } else {
      return this.modifyJson(obj[is[0]], is.slice(1), value);
    }
  }
}
