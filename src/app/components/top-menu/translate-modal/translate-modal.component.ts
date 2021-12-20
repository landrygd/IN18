import { Component, OnInit } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { GlobalService } from 'src/app/services/global.service';
import { LanguagesModalPage } from '../languages-modal/languages-modal.component';
import { TranslatorService } from 'src/app/services/translator.service';

@Component({
  selector: 'app-translate-modal',
  templateUrl: './translate-modal.component.html',
  styleUrls: ['./translate-modal.component.scss'],
})
export class TranslateModalComponent implements OnInit {

  unfilled = true;
  unverified = false;

  words = 0;
  characters = 0;

  constructor(public modalCtrl: ModalController,
              public global: GlobalService,
              public translator: TranslatorService) {

                translator.mainLanguage = global.mainLanguage;
               }

  ngOnInit() { }

  languagesAvailable() {
    return this.global.languages.filter(l => l !== this.translator.mainLanguage);
  }

  unfilledChanged(value) {
    this.translator.unfilled = value;
  }

  unverifiedChanged(value) {
    this.translator.unverified = value;
  }

  dismissModal() {
    this.modalCtrl.dismiss();
  }

  languagesSelectedChanged(value: string[]) {
    this.translator.languages = value;
  }

  mainLanguageSelectedChanged(value: string) {
    this.translator.mainLanguage = value;
  }


  async presentLanguagesModal(id: number = 0) {
    const modal = await this.modalCtrl.create({
      component: LanguagesModalPage,
      componentProps: { id },
      cssClass: ''
    });
    return await modal.present();
  }

  translate() {
    this.translator.translate();
    this.dismissModal();
  }

}
