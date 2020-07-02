import { Component, OnInit, Input } from '@angular/core';
import { Folder } from 'src/app/classes/folder';
import { Structure } from 'src/app/classes/structure';
import { GlobalService } from 'src/app/services/global.service';
import { TraductionsGroup } from 'src/app/classes/traductions-group';

@Component({
  selector: 'app-folder-tree',
  templateUrl: './folder-tree.component.html',
  styleUrls: ['./folder-tree.component.scss'],
})
export class FolderTreeComponent implements OnInit {

  @Input() folder: Folder;

  @Input() level: number;


  collapsed = true;

  constructor(private global: GlobalService) {
  }

  ngOnInit() { }

  toggleCollapse() {
    this.collapsed = !this.collapsed;
    this.select(this.collapsed ? this.global.structure : this.folder);
  }

  isExpanded(): boolean{
    return !this.collapsed || this.level < 0 || this.global.selectedFolder === this.folder || this.global.OneChildIsSelected(this.folder);
  }

  select(structure: Structure) {
    this.global.setSelectedStructure(this.global.selectedStructure === structure ? this.global.structure : structure);
  }

  chevronIcon() {
    return this.collapsed ? 'chevron-forward' : 'chevron-down';
  }

  folderIcon(){
    return this.collapsed ? 'folder' : 'folder-open';
  }

  getColor(folder: boolean, structure: Structure = this.folder) {
    if (this.global.selectedStructure === structure) {
      return 'primary';
    }else if (this.global.selectedFolder === structure ||
      (this.global.selectedFolder === this.folder && this.global.selectedStructure === this.folder
      && this.global.selectedFolder !== this.global.structure) ||
      (this.folder.parentFolder === this.global.selectedFolder && this.global.selectedFolder !== this.global.structure)){
      return 'secondary';
    }
    if (!this.collapsed || !folder) {
      return 'dark';
    }
    return 'medium';
  }


}
