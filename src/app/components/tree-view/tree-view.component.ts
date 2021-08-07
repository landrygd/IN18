import { Component, Input, Output, EventEmitter, OnInit } from '@angular/core';
import { ModalController, PopoverController } from '@ionic/angular';
import { GlobalService } from 'src/app/services/global.service';
import { NewTradModalComponent } from './new-trad-modal/new-trad-modal.component';
import { Folder } from 'src/app/classes/folder';
import { PopoverMenu } from './menu-popover/template-popover.component';

@Component({
  selector: 'app-tree-view',
  templateUrl: './tree-view.component.html',
  styleUrls: ['./tree-view.component.scss'],
})
export class TreeViewComponent {
  constructor(
    private popoverCtrl: PopoverController,
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

  async presentPopover(ev: any, f) {
    const popover = await this.popoverCtrl.create({
      component: PopoverMenu,
      componentProps: { item:f },
      cssClass: '',
      event: ev,
      translucent: true
    });
    await popover.present();
  }
}
