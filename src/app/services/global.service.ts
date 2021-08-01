import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { Folder } from '../classes/folder';
import { TraductionsGroup } from '../classes/traductions-group';
import { Structure } from '../classes/structure';
import { SettingsService } from './settings.service';

@Injectable({
  providedIn: 'root'
})
export class GlobalService {
  projectPath: string;
  structure: Folder; //= new Folder('project_name', undefined);
  lastSavedStrcture: object;
  selectedStructure: Structure;
  selectedFolder: Folder;
  languages: string[] = [];
  paths: any;

  loading = false;


  selectedTradGroups$: Observable<TraductionsGroup[]>;
  selectedFolders$: Observable<Structure[]>;


  constructor(private setting: SettingsService) {
    this.setSelectedStructure();
    this.updateSavedStructure();
  }

  // Set selectedstructure with the folder or the item which is selected, set the new selected folder (parent folder if it's an item)
  async setSelectedStructure(structure: Structure = this.structure) {
    if (structure !== undefined) {
      if (structure instanceof TraductionsGroup) {
        this.setSelectedFolder(structure.parentFolder);
      } else if (structure instanceof Folder) {
        this.setSelectedFolder(structure);
      }
      this.selectedTradGroups$ = of(this.getSelectedFolder().tradGroupList);
      this.selectedFolders$ = of(this.getSelectedFolder().folderList);
      this.selectedStructure = structure;
    }

  }

  // update lastsavedstructure when we save the structure
  updateSavedStructure() {
    this.lastSavedStrcture = this.savein18(this.structure);
  }

  isSaved(): boolean {
    return JSON.stringify(this.lastSavedStrcture) === JSON.stringify(this.savein18(this.structure));
  }

  getProjectName(): String {
    return this.structure === undefined ? "" : this.structure.getName();
  }

  // get selectedstructure only if it's an item
  getSelectedStructureAsTradGroup(): TraductionsGroup {
    if (this.selectedStructure instanceof TraductionsGroup) {
      return this.selectedStructure;
    } else {
      return undefined;
    }
  }

  isSelectedStructureFolder(): boolean {
    return this.selectedStructure instanceof Folder;
  }

  // false if all children aren't selected
  OneChildIsSelected(folder: Folder): boolean {
    for (const k of folder.folderList) {
      if (k === this.selectedStructure) {
        return true;
      } else {
        return this.OneChildIsSelected(k);
      }
    }
    for (const k of folder.tradGroupList) {
      if (k === this.selectedStructure) {
        return true;
      }
    }
    return false;

  }

  getSelectedFolder() {
    return this.selectedFolder === undefined ? this.structure : this.selectedFolder;
  }

  async setSelectedFolder(folder: Folder) {
    this.selectedFolder = folder;
  }

  // to set a new structure, also select it and update the languages list
  setStructure(newStructure) {
    this.structure = newStructure;
    this.setSelectedStructure(this.structure);
    this.majLanguages(this.structure);
  }

  newProject() {
    this.setStructure(new Folder('project_name', undefined));
    this.languages = [];
    this.setSelectedStructure();
    this.projectPath = undefined;
  }

  /*test() {
    this.importJsonFiles([{ default: { test: { y: 'oui', n: 'non' } } }, { default: { test: { y: 'yes', n: 'no' } } }], ['fr', 'en']);
  }*/

  removeLanguage(language: string): boolean {
    const exist = this.languages.find(e => e === language);
    if (exist) {
      this.languages = this.languages.filter(l => l !== exist);
      this.majLanguages(this.structure);
      return true;
    } else {
      return false;
    }
  }



  addLanguage(language: string): boolean {
    const exist = this.languages.find(e => e === language);
    if (exist) {
      return false;
    } else {
      this.languages.push(language);
      this.majLanguages(this.structure);
      return true;
    }
  }

  majLanguages(structure: Structure) {
    if (structure instanceof Folder) {
      for (const k of structure.folderList) {
        this.majLanguages(k);
      }
      for (const k of structure.tradGroupList) {
        this.majLanguages(k);
      }
    } else if (structure instanceof TraductionsGroup) {
      structure.removeTradWrongLanguage(this.languages);
      structure.addMissingTrad(this.languages);
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

  savein18(structure: Structure = this.structure): object {
    const json: object = {};
    if (this.structure !== undefined) {


      if (structure == this.structure) {
        json[structure.getName()] = {}
      }

      if (structure instanceof Folder) {
        for (const folder of structure.folderList) {
          if (structure == this.structure) {
            json[structure.getName()][folder.getName()] = this.savein18(folder);
          } else {
            json[folder.getName()] = this.savein18(folder);
          }
        }
        for (const trad of structure.tradGroupList) {
          if (structure == this.structure) {
            json[structure.getName()][trad.getName()] = {};
            for (const t of trad.tradList) {
              json[structure.getName()][trad.getName()][t.language] = { value: t.value, checked: t.checked };

            }
          } else {
            json[trad.getName()] = {};
            for (const t of trad.tradList) {
              json[trad.getName()][t.language] = { value: t.value, checked: t.checked };

            }
          }

        }
      }
    }
    return json;
  }

}
