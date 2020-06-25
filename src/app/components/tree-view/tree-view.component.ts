import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'app-tree-view',
  templateUrl: './tree-view.component.html',
  styleUrls: ['./tree-view.component.scss'],
})
export class TreeViewComponent implements OnInit {

  @Input() tree: any;

  paths = [];
  opened = ['default'];

  constructor() { }

  ngOnInit() {
    const paths = ['default'];
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
    const pathArr = path.split('.');
    pathArr.pop();
    path = pathArr.join('.');
    return this.isOpened(path);
  }

  getName(path) {
    return path.split('.').pop();
  }

  develop(path) {
    if (this.opened.includes(path)) {
      const index = this.opened.indexOf(path);
      this.opened.splice(index, 1);
    } else {
      this.opened.push(path);
    }
    console.log(this.opened);
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

  getColor(path: string) {
    if ((this.isFolder(path) && this.isOpened(path)) || !this.isFolder(path)) {
      return 'dark';
    }
    return 'medium';
  }
}
