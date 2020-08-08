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
export class TreeViewComponent {
  constructor(
    private modalController: ModalController,
    public global: GlobalService
  ) {
  }


  async addTraduction() {
    const modal = await this.modalController.create({
      component: NewTradModalComponent,
      componentProps: { parentFolder: this.global.getSelectedFolder() }
    });
    await modal.present();
  }
}
