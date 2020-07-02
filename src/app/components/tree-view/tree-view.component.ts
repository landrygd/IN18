import { Component, Input, Output, EventEmitter, OnInit } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { GlobalService } from 'src/app/services/global.service';
import { NewTradModalComponent } from './new-trad-modal/new-trad-modal.component';
import { Folder } from 'src/app/classes/folder';

@Component({
  selector: 'app-tree-view',
  templateUrl: './tree-view.component.html',
  styleUrls: ['./tree-view.component.scss'],
})
export class TreeViewComponent implements OnInit {


  tree: any;

  @Output() selected = new EventEmitter();
  @Output() newTrad = new EventEmitter();

  paths: any[];
  opened: any[];
  visible: string[];
  selectedPath: string;
  structure: Folder;

  constructor(
    private modalController: ModalController,
    private global: GlobalService
  ) {
      this.structure = this.global.structure;
      console.log(this.structure);
   }

  ngOnInit(){
    this.global.observablestructure.subscribe((value) => {
      // this.updateTree(value);
    });
  }

  updateTree(value) {
    console.log(value);
    this.tree = value;
    this.paths = [];
    this.opened = [];
    this.visible = [];
    this.selectedPath = undefined;
    const paths = ['default'];
    this.develop('default');
    while (paths.length > 0) {
      const path = paths.shift();
      this.paths.push(path);
      const obj = this.modifyJson(this.tree, path);
      for (const key of Object.keys(obj)) {
        const subPath = path + '.' + key;
        const subObj = this.modifyJson(this.tree, subPath);
        if (typeof subObj === 'object') {
          paths.push(subPath);
        }
      }
    }
    this.paths.sort();
    this.global.setPaths(this.paths);
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

  isOpened(path: string) {
    return this.opened.includes(path);
  }

  isVisible(path: string) {
    return this.visible.includes(path);
  }

  getName(path) {
    return path.split('.').pop();
  }

  develop(path) {
    if (this.isFolder(path)) {
      if (this.opened.includes(path)) {
        const index = this.opened.indexOf(path);
        this.opened.splice(index, 1);
        this.selectedPath = undefined;
        const res = [];
        for (const key of this.visible) {
          if (!key.startsWith(path) || key === path) {
            res.push(key);
          }
        }
        this.visible = res;
      } else {
        this.opened.push(path);
        this.selectPath(path);
        const folder = this.modifyJson(this.tree, path);
        for (const key of Object.keys(folder)) {
          this.visible.push(path + '.' + key);
        }
      }
    } else {
      this.selectPath(path);
    }
  }

  selectPath(path: string) {
    if (this.selectedPath !== path) {
      this.selectedPath = path;
      this.selected.emit(path);
    } else {
      this.selectedPath = undefined;
    }
  }

  getIcon(path, iconName) {
    if (iconName === 'chevron') {
      if (this.isOpened(path)) {
        return 'chevron-down';
      }
      return 'chevron-forward';
    } else if (iconName === 'folder') {
      if (this.isFolder(path)) {
        if (this.isOpened(path)) {
          return 'folder-open';
        }
        return 'folder';
      } else {
        return 'document';
      }
    }
  }

  isFolder(path: string) {
    const obj = this.modifyJson(this.tree, path);
    const lang = obj[Object.keys(obj)[0]];
    return typeof lang === 'object';
  }

  getLevels(path: string) {
    return new Array(path.split('.').length - 2);
  }

  isSelected(path: string) {
    return this.selectedPath === path;
  }


  async addTraduction() {
    const modal = await this.modalController.create({
      component: NewTradModalComponent,
      componentProps: {folder: this.global.getSelectedFolder()}
    });
    await modal.present();
  }
}
