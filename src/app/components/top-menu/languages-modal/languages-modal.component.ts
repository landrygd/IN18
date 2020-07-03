import { Component, Input } from '@angular/core';
import {  ModalController } from '@ionic/angular';
import { GlobalService } from 'src/app/services/global.service';

@Component({
  templateUrl: './languages-modal.component.html',
  })
  export class LanguagesModalPage {

    @Input() id = 10;

    newLanguage = "";

    constructor(public modalCtrl: ModalController, private global: GlobalService) {
    }

    dismissModal(){
        this.modalCtrl.dismiss();
    }

    delete(){

    }

    add(){
      if (this.newLanguage !== ''){
        this.global.addLanguage(this.newLanguage);
      }
    }

    onNewLanguageChange(value:string){
      this.newLanguage = value;
    }


  }
