import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class SettingsService {

  extendTrad = false;
  tabImportExport = 'json';
  folderCharCsv = '.';
  importFusion = 'no';

  constructor() { }
}
