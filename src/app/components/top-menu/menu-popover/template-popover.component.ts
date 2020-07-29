import { Component, Input, EventEmitter } from '@angular/core';
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

  public onFileSelected(event) {
    console.log(event.target.files[0]);
    const file: File = event.target.files[0];
    this.importExport.load(file);
    this.popoverCtrl.dismiss();
  }

  quit() {
    if (this.electronService.isElectronApp) {
      App.exitApp();
    } else {
      window.close();
    }
  }

  import(files) {
    this.popoverCtrl.dismiss();
  }

  save() {
    this.importExport.download();
    this.popoverCtrl.dismiss();
  }

  new() {
    this.presentNewProject();
    this.popoverCtrl.dismiss();
  }

  close() { }

  async presentNewProject() {
    if (this.global.isSaved()) {
      
      this.global.newProject();
      this.NewProjectModal();
    } else {
      const alert = await this.alertController.create({
        cssClass: '',
        header: 'Attention',
        subHeader: '',
        message: 'Create a new project? The unsave changes of your actual project will be lost.',
        buttons: [{
          text: 'No',
          role: 'cancel',
          cssClass: 'danger',
          handler: (blah) => {
            console.log('cancel');
          }
        }, {
          text: 'Yes',
          cssClass: 'primary',
          handler: () => {
            
            this.global.newProject();
            this.NewProjectModal();
          }
        }]
      });

      await alert.present();
    }

  }

  async NewProjectModal() {
    const modal = await this.modalController.create({
      component: NewProjectModalComponent,
      componentProps: {},
      cssClass: ''
    });
    return await modal.present();
  }
}
