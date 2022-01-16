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
import { Traduction } from "src/app/classes/traduction";
import { TranslatorService } from "src/app/services/translator.service";

@Component({
  templateUrl: "./template-popover.component.html",
})
export class PopoverMenu {
  @Input() item: any;
  @Input() parent: any;

  constructor(
    private modalController: ModalController,
    public popoverCtrl: PopoverController,
    public alertController: AlertController,
    public global: GlobalService,
    public translator: TranslatorService
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

  isStruct(): boolean {
    return this.item instanceof Structure;
  }

  isRoot(): boolean {
      if (this.isFolder()){
        return this.item.isRoot();
      }
      return false;
  }

  isFolder(): boolean {
    return this.item instanceof Folder;
  }

  isField(): boolean {
    return this.item instanceof Traduction;
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

  async translateFromMain(){
    this.translator.translateFromMain(this.item, this.parent);
    this.popoverCtrl.dismiss();
  }
}
