import { Component, Input, EventEmitter, HostListener } from "@angular/core";
import {
  PopoverController,
  AlertController,
  Platform,
  ModalController,
} from "@ionic/angular";
import { GlobalService } from "src/app/services/global.service";
import { ImportExportService } from "src/app/services/import-export.service";
import { ElectronService } from "ngx-electron";
import { Structure } from "src/app/classes/structure";
import { TraductionsGroup } from "src/app/classes/traductions-group";
import { Folder } from "src/app/classes/folder";
import { NewTradModalComponent } from "../new-trad-modal/new-trad-modal.component";
import { folder } from "jszip";

@Component({
  templateUrl: "./template-popover.component.html",
})
export class PopoverMenu {
  @Input() item: Structure;

  constructor(
    private modalController: ModalController,
    public popoverCtrl: PopoverController,
    public alertController: AlertController,
    public global: GlobalService
  ) {}

  testClick() {
    this.popoverCtrl.dismiss();
  }

  newItem() {
    this.addTraduction();
  }

  newFolder() {
    this.addTraduction(true);
  }

  isFolder(): boolean {
    let i: any = this.item;
    return i instanceof Folder;
  }

  cut(){
    this.global.isCut=true;
    this.global.copyItem = this.item;
    this.popoverCtrl.dismiss();
  }

  copy(){
    this.global.isCut=false;
    this.global.copyItem = this.item;
    this.popoverCtrl.dismiss();
  }

  paste(){
    this.global.paste(this.item);
    this.popoverCtrl.dismiss();
  }

  delete() {
    this.global.removeItem(this.item);
  }

  async presentDeleteConfirm() {
    this.popoverCtrl.dismiss();
    const alert = await this.alertController.create({
      cssClass: "",
      header: "Attention",
      subHeader: "",
      message: this.isFolder()
        ? "Are you sure to delete this folder? All the items inside will also be deleted"
        : "Are you sure to delete this item?",
      buttons: [
        {
          text: "No",
          role: "cancel",
          cssClass: "danger",
          handler: (blah) => {
            
          },
        },
        {
          text: "Yes",
          cssClass: "primary",
          handler: () => {
            this.delete();
          },
        },
      ],
    });

    await alert.present();
  }

  async addTraduction(folder = false) {
    const modal = await this.modalController.create({
      component: NewTradModalComponent,
      componentProps: { parentFolder: this.item, isFolder: folder },
    });
    await modal.present();
    this.popoverCtrl.dismiss();
  }
}
