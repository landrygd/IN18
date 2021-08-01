import { Component, OnInit, Input, HostListener } from '@angular/core';
import { ModalController, AlertController, ToastController } from '@ionic/angular';
import { SettingsService } from 'src/app/services/settings.service';

@Component({
  selector: 'app-settings-modal',
  templateUrl: './settings-modal.component.html',
  styleUrls: ['./settings-modal.component.scss'],
})
export class SettingsModalComponent implements OnInit {

  @Input() tab = 'general';

  extendTrad = this.settings.extendTrad;
  tabImportExport = this.settings.tabImportExport;
  separatorCharCsv = this.settings.separatorCharCsv;
  folderCharCsv = this.settings.folderCharCsv;
  importFusion = this.settings.importFusion;
  autoValidate = this.settings.autoValidate;
  folderNameOnlyForDoublon = this.settings.folderNameOnlyForDoublon;
  change = false;

  constructor(private modalController: ModalController,
              public alertController: AlertController,
              private settings: SettingsService,
              private toastController: ToastController) { }

  ngOnInit() { }

  tabChanged(value) {
    this.tab = value;
  }

  extendTradChanged(value) {
    this.extendTrad = value;
    this.change = true;
  }

  tabImportExportChanged(value) {
    this.tabImportExport = value;
    this.change = true;
  }

  importFusionChanged(value) {
    this.importFusion = value;
    this.change = true;
  }

  folderCharCsvChanged(value) {
    this.folderCharCsv = value;
    this.change = true;
  }

  folderNameOnlyForDoublonChanged(value) {
    this.folderNameOnlyForDoublon = value;
    this.change = true;
  }

  separatorCharCsvChanged(value){
    this.separatorCharCsv = value;
    this.change = true;
  }

  reset() { }

  close() {
    if (this.change) {
      this.presentTradConfirm();
    } else {
      this.modalController.dismiss();
    }

  }

  autoValidateChanged(value) {
    this.autoValidate = value;
    this.change = true;
  }

  async presentTradConfirm() {
    const alert = await this.alertController.create({
      cssClass: '',
      header: 'Attention',
      subHeader: '',
      message: 'Some changes have not been saved.',
      buttons: [{
        text: 'No',
        role: 'cancel',
        cssClass: 'danger',
        handler: (blah) => {
        }
      }, {
        text: 'Close without save',
        cssClass: 'primary',
        handler: () => {
          this.modalController.dismiss();
        }
      }, {
        text: 'Save and close',
        cssClass: 'primary',
        handler: () => {
          this.save();
          this.modalController.dismiss();
        }
      }]
    });

    await alert.present();
  }

  save() {
    this.settings.extendTrad = this.extendTrad;
    this.settings.tabImportExport = this.tabImportExport;
    this.settings.folderCharCsv = this.folderCharCsv;
    this.settings.importFusion = this.importFusion;
    this.settings.autoValidate = this.autoValidate;
    this.settings.folderNameOnlyForDoublon = this.folderNameOnlyForDoublon;
    this.settings.separatorCharCsv = this.separatorCharCsv;
    this.change = false;
    this.settings.save();
    this.presentSettingsToast();
  }

  async presentSettingsToast() {
    const toast = await this.toastController.create({
      message: 'Settings saved.',
      duration: 2000
    });
    await toast.present();
  }

  @HostListener('window:keydown', ['$event'])
  handleKeyboardEvent(event: KeyboardEvent) {
    // tslint:disable: deprecation
    if (event.keyCode === 13) {
      this.save();
    }
  }

}
