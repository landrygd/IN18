import { Component, Input, ViewChild, HostListener } from '@angular/core';
import { ModalController, AlertController, IonInput } from '@ionic/angular';
import { GlobalService } from 'src/app/services/global.service';

@Component({
  templateUrl: './languages-modal.component.html',
})
export class LanguagesModalPage {

  @Input() id = 10;

  newLanguage = '';

  constructor(public alertController: AlertController, public modalCtrl: ModalController, public global: GlobalService) {
  }

  dismissModal() {
    this.modalCtrl.dismiss();
  }

  delete(language) {
    this.global.removeLanguage(language);
  }

  async presentDeleteConfirm(language: string) {
    const alert = await this.alertController.create({
      cssClass: '',
      header: 'Attention',
      subHeader: '',
      message: 'Are you sure to delete this language? All the translation of this language will be deleted.',
      buttons: [{
        text: 'No',
        role: 'cancel',
        cssClass: 'danger',
        handler: (blah) => {
        }
      }, {
        text: 'Yes',
        cssClass: 'primary',
        handler: () => {
          this.delete(language);
        }
      }]
    });
    await alert.present();
  }

  add() {
    if (this.newLanguage !== '') {
      this.global.addLanguage(this.newLanguage);
      this.newLanguage = '';
    }
  }

  onNewLanguageChange(value: string) {
    this.newLanguage = value;
  }

  onLanguageChange(value: string, id: number) {
    this.global.languages[id] = value;
  }



}
