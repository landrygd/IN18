import { Component, OnInit, Input } from '@angular/core';
import { Folder } from 'src/app/classes/folder';

@Component({
  selector: 'app-folder-tree',
  templateUrl: './folder-tree.component.html',
  styleUrls: ['./folder-tree.component.scss'],
})
export class FolderTreeComponent implements OnInit {

  @Input() folder: Folder;

  @Input() level: number;

  collapsed = true;

  constructor() {
  }

  ngOnInit() { }

  toggleCollapse() {
    this.collapsed = !this.collapsed;
  }

  chevronIcon() {
    return this.collapsed ? 'chevron-forward' : 'chevron-down';
  }


}
