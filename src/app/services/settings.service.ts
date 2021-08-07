import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class SettingsService {

  extendTrad = false;
  tabImportExport = 'json';
  separatorCharCsv = ',';
  folderCharCsv = '.';
  folderNameOnlyForDoublon = false;
  importFusion = 'no';
  autoValidate = false;
  recentProjects:String[]=[];
  recentFiles:String[]=[];
  constructor() {
    this.load();
  }

  save() {
    localStorage.setItem('extendTrad', this.extendTrad ? '1' : '0');
    localStorage.setItem('autoValidate', this.autoValidate ? '1' : '0');
    localStorage.setItem('tabImportExport', this.tabImportExport);
    localStorage.setItem('separatorCharCsv', this.separatorCharCsv);
    localStorage.setItem('folderCharCsv', this.folderCharCsv);
    localStorage.setItem('folderNameOnlyForDoublon', this.folderNameOnlyForDoublon ? '1' : '0');
    localStorage.setItem('importFusion', this.importFusion);
    localStorage.setItem("recentProjects", JSON.stringify(this.recentProjects));
    localStorage.setItem("recentFiles", JSON.stringify(this.recentFiles));
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
    const newSeparatorCharCsv = localStorage.getItem('separatorCharCsv');
    if (newSeparatorCharCsv !== undefined && newSeparatorCharCsv !== null) {
      this.separatorCharCsv = newSeparatorCharCsv;
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
    const newrecentProjects = localStorage.getItem('recentProjects');
    if (newrecentProjects !== undefined && newrecentProjects !== null) {
      this.recentProjects = JSON.parse(newrecentProjects);
    }
    const newrecentFiles = localStorage.getItem('recentFiles');
    if (newrecentFiles !== undefined && newrecentFiles !== null) {
      this.recentFiles = JSON.parse(newrecentFiles);
    }
  }

  addRecentProjectPath(path:string){
    if (path !==undefined && path !==null && path!=="" && !this.recentProjects.includes(path)){
      if (this.recentProjects.length>10){
        this.recentProjects.pop();
      }
      this.recentProjects.unshift(path);
      this.save();
    }
  }

  addRecentFilePath(path:string){
    if (path !==undefined && path !==null && path!=="" && !this.recentFiles.includes(path)){
      if (this.recentFiles.length>10){
        this.recentFiles.pop();
      }
      this.recentFiles.unshift(path);
      this.save();
    }
  }

  removeProjectPath(path:string){
    let index = this.recentProjects.indexOf(path);
    if (index !== -1) {
      this.recentProjects.splice(index, 1);
      this.save();
    }
    
  }

  removeFilePath(path:string){
    let index = this.recentFiles.indexOf(path);
    if (index !== -1) {
      this.recentFiles.splice(index, 1);
      this.save();
    }
  }
}
