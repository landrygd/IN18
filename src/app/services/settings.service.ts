import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class SettingsService {

  extendTrad = false;
  tabImportExport = 'json';
  folderCharCsv = '.';
  importFusion = 'no';
  autoValidate = false;

  constructor() { 
    this.load();
  }

  save(){
    localStorage.setItem('extendTrad', this.extendTrad?'1':'0');
    localStorage.setItem('autoValidate', this.autoValidate?'1':'0');
    localStorage.setItem('tabImportExport', this.tabImportExport);
    localStorage.setItem('folderCharCsv', this.folderCharCsv);
    localStorage.setItem('importFusion', this.importFusion);
  }

  load(){
    const new_extendTrad = localStorage.getItem('extendTrad');
    if (new_extendTrad !== undefined && new_extendTrad!==null){
      this.extendTrad = new_extendTrad=='1';
    }
    const new_autoValidate = localStorage.getItem('autoValidate');
    if (new_autoValidate !== undefined && new_autoValidate!==null){
      this.autoValidate = new_autoValidate=='1';
    }
    const new_tabImportExport = localStorage.getItem('tabImportExport');
    if (new_tabImportExport !== undefined && new_tabImportExport!==null){
      this.tabImportExport = new_tabImportExport;
    }
    const new_folderCharCsv = localStorage.getItem('folderCharCsv');
    if (new_folderCharCsv !== undefined && new_folderCharCsv!==null){
      this.folderCharCsv = new_folderCharCsv;
    }
    const new_importFusion = localStorage.getItem('importFusion');
    if (new_importFusion !== undefined && new_importFusion!==null){
      this.importFusion = new_importFusion;
    }
  }
}
