import { Component, OnInit, Input } from '@angular/core';
import { Folder } from 'src/app/classes/folder';
import { Structure } from 'src/app/classes/structure';
import { GlobalService } from 'src/app/services/global.service';

@Component({
  selector: 'app-folder-tree',
  templateUrl: './folder-tree.component.html',
  styleUrls: ['./folder-tree.component.scss'],
})
export class FolderTreeComponent implements OnInit {

  @Input() folder: Folder;

  @Input() level: number;

  selectedStructure: Structure;

  collapsed = true;

  constructor(private global: GlobalService) {
  }

  ngOnInit() { }

  toggleCollapse() {
    this.collapsed = !this.collapsed;
    this.select(this.collapsed ? undefined : this.folder);
  }

  select(structure: Structure) {
    this.selectedStructure = structure;
    this.global.selectedStructure = structure;
  }

  chevronIcon() {
    return this.collapsed ? 'chevron-forward' : 'chevron-down';
  }

  getColor(folder: boolean, structure: Structure = this.folder) {
    if (this.selectedStructure === structure || this.selectedStructure === this.folder) {
      return 'primary';
    }
    if (!this.collapsed || !folder) {
      return 'dark';
    }
    return 'medium';
  }


}
