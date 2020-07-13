import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class SettingsService {

  extendTrad = false;
  tabImport = 'json';
  tabExport = 'json';

  constructor() { }
}
