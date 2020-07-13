import { Component, OnInit, Input } from '@angular/core';
import { ModalController, AlertController } from '@ionic/angular';
import { SettingsService } from 'src/app/services/settings.service';

@Component({
  selector: 'app-settings-modal',
  templateUrl: './settings-modal.component.html',
  styleUrls: ['./settings-modal.component.scss'],
})
export class SettingsModalComponent implements OnInit {

  @Input() tab = 'general';

  extendTrad = this.settings.extendTrad;
  tabImport = this.settings.tabImport;
  tabExport = this.settings.tabExport;

  change = false;

  constructor(private modalController: ModalController,
              public alertController: AlertController,
              private settings: SettingsService) { }

  ngOnInit() {}

  tabChanged(value){
    this.tab = value;
  }

  extendTradChanged(value){
    this.extendTrad = value;
    this.change = true;
  }

  tabImportChanged(value){
    this.tabImport = value;
    this.change = true;
  }

  tabExportChanged(value){
    this.tabExport = value;
    this.change = true;
  }

  reset(){}

  close() {
    if (this.change){
      this.presentTradConfirm();
    }else{
      this.modalController.dismiss();
    }

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
          console.log('Confirm Cancel: blah');
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

  save(){
    this.settings.extendTrad = this.extendTrad;
    this.settings.tabExport = this.tabExport;
    this.settings.tabImport = this.tabImport;
    this.change = false;
  }

}
