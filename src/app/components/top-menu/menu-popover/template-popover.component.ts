import { Component, Input, EventEmitter, HostListener } from '@angular/core';
import { PopoverController, AlertController, Platform, ModalController } from '@ionic/angular';
import { GlobalService } from 'src/app/services/global.service';
import { ImportExportService } from 'src/app/services/import-export.service';
import { ElectronService } from 'ngx-electron';

@Component({
  templateUrl: './template-popover.component.html',
})
export class PopoverPage {

  @Input() id = 10;

  constructor(public popoverCtrl: PopoverController,
              private modalController: ModalController,
              public alertController: AlertController,
              public global: GlobalService,
              private importExport: ImportExportService,
              private electronService: ElectronService) {
  }


  testClick() {
    this.popoverCtrl.dismiss();
  }

  load() {
    this.popoverCtrl.dismiss('load');
  }


  quit() {
    this.popoverCtrl.dismiss('quit');

  }

  import(files) {
    this.popoverCtrl.dismiss();
  }

  save() {
    this.popoverCtrl.dismiss('save');
  }

  saveAs() {
    this.popoverCtrl.dismiss('saveas');
  }

  new() {

    this.popoverCtrl.dismiss('new');
  }

  close() {
    this.popoverCtrl.dismiss('close');
   }



}
