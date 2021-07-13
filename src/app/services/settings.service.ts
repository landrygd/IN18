import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class SettingsService {

  extendTrad = false;
  tabImportExport = 'json';
  folderCharCsv = '.';
  folderNameOnlyForDoublon = false;
  importFusion = 'no';
  autoValidate = false;

  constructor() {
    this.load();
  }

  save() {
    localStorage.setItem('extendTrad', this.extendTrad ? '1' : '0');
    localStorage.setItem('autoValidate', this.autoValidate ? '1' : '0');
    localStorage.setItem('tabImportExport', this.tabImportExport);
    localStorage.setItem('folderCharCsv', this.folderCharCsv);
    localStorage.setItem('folderNameOnlyForDoublon', this.folderNameOnlyForDoublon ? '1' : '0');
    localStorage.setItem('importFusion', this.importFusion);
  }

  load() {
    const newExtendTrad = localStorage.getItem('extendTrad');
    if (newExtendTrad !== undefined && newExtendTrad !== null) {
      this.extendTrad = newExtendTrad === '1';
    }
    const newAutoValidate = localStorage.getItem('autoValidate');
    if (newAutoValidate !== undefined && newAutoValidate !== null) {
      this.autoValidate = newAutoValidate === '1';
    }
    const newTabImportExport = localStorage.getItem('tabImportExport');
    if (newTabImportExport !== undefined && newTabImportExport !== null) {
      this.tabImportExport = newTabImportExport;
    }
    const newFolderCharCsv = localStorage.getItem('folderCharCsv');
    if (newFolderCharCsv !== undefined && newFolderCharCsv !== null) {
      this.folderCharCsv = newFolderCharCsv;
    }
    const newFolderNameOnlyForDoublon = localStorage.getItem('folderNameOnlyForDoublon');
    if (newFolderNameOnlyForDoublon !== undefined && newFolderNameOnlyForDoublon !== null) {
      this.folderNameOnlyForDoublon = newFolderNameOnlyForDoublon === '1';
    }
    const newImportFusion = localStorage.getItem('importFusion');
    if (newImportFusion !== undefined && newImportFusion !== null) {
      this.importFusion = newImportFusion;
    }
  }
}
