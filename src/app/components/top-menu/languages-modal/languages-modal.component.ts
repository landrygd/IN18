import { Component, Input, ViewChild, HostListener } from '@angular/core';
import { ModalController, AlertController, IonInput } from '@ionic/angular';
import { ElectronService } from 'ngx-electron';
import { GlobalService } from 'src/app/services/global.service';

@Component({
  templateUrl: './languages-modal.component.html',
  styleUrls: ['./languages-modal.component.scss']
})
export class LanguagesModalPage {

  @Input() id = 10;

  newLanguage = '';

  tmpLanguages:object = {};

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
    this.tmpLanguages[id]=value
    
  }

  applyLanguageChange(){
    for (var k in this.tmpLanguages){
      var res = this.global.swapLanguage(this.global.languages[k],this.tmpLanguages[k]);
    }
    this.tmpLanguages={}
  }

  getCompletion(){
    if (this.newLanguage=="" || this.global.availableLanguages === undefined){
      return [];
    }
    var res=this.global.availableLanguages.filter(l => !this.global.languages.includes(l.toLowerCase()) && l.toLowerCase().startsWith(this.newLanguage.toLowerCase()));
    res.length = Math.min(res.length,5);
    return res;
  }

}
