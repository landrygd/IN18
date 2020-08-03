import { Component, Input, EventEmitter, HostListener } from '@angular/core';
import { PopoverController, AlertController, Platform, ModalController } from '@ionic/angular';
import { GlobalService } from 'src/app/services/global.service';
import { ImportExportService } from 'src/app/services/import-export.service';
import { ElectronService } from 'ngx-electron';
import { Plugins } from '@capacitor/core';
import { NewProjectModalComponent } from '../new-project-modal/new-project-modal.component';
const { LocalNotifications, Clipboard, Modals, App } = Plugins;

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

  load(){
    this.popoverCtrl.dismiss("load");
  }
  

  quit() {
    this.popoverCtrl.dismiss("close");
    
  }

  import(files) {
    this.popoverCtrl.dismiss();
  }

  save() {
    this.popoverCtrl.dismiss("save");
  }

  new() {
    
    this.popoverCtrl.dismiss("new");
  }

  close() { }

  

}
