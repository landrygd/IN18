import { Component, OnInit, Input } from '@angular/core';
import { Folder } from 'src/app/classes/folder';
import { Structure } from 'src/app/classes/structure';
import { GlobalService } from 'src/app/services/global.service';
import { TraductionsGroup } from 'src/app/classes/traductions-group';
import { ModalController } from '@ionic/angular';
import { NewTradModalComponent } from '../new-trad-modal/new-trad-modal.component';

@Component({
  selector: 'app-folder-tree',
  templateUrl: './folder-tree.component.html',
  styleUrls: ['./folder-tree.component.scss'],
})
export class FolderTreeComponent implements OnInit {

  @Input() folder: Folder;

  @Input() level: number;


  collapsed = true;

  constructor(private modalController: ModalController, private global: GlobalService) {
  }

  ngOnInit() { }

  toggleCollapse(select = false) {
    if (!this.global.OneChildIsSelected(this.folder) || select){
      this.collapsed = !this.collapsed;
      if (select){
        this.select(this.collapsed ? this.global.structure : this.folder);
      }
    }
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

  getBgColor(folder: boolean, structure: Structure = this.folder): boolean {
    /*if (this.global.selectedFolder === structure ||
      (this.global.selectedFolder === this.folder && this.global.selectedStructure === this.folder
      && this.global.selectedFolder !== this.global.structure) ||
      (this.folder.parentFolder === this.global.selectedFolder && this.global.selectedFolder !== this.global.structure)){
      return true;
    }*/
    if (structure === this.global.selectedStructure){
      return true;
    }
    return false;
  }

  getColor(folder: boolean, structure: Structure = this.folder): string {
    if (structure.isFilled()) {
      return 'primary';
    }
    else if (structure.isValidated()){
      return 'success';
    }

    else if (!this.collapsed || !folder) {
      return 'dark';
    }
    return 'medium';
  }

  async addTraduction(isFolder = false) {
    const modal = await this.modalController.create({
      component: NewTradModalComponent,
      componentProps: {parentFolder: this.folder, isFolder}
    });
    await modal.present();
  }


}
