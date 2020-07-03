import { Component, Input } from '@angular/core';
import {  ModalController } from '@ionic/angular';

@Component({
  templateUrl: './languages-modal.component.html',
  })
  export class LanguagesModalPage {

    @Input() id = 10;

    constructor(public modalCtrl: ModalController) {
    }

    dismissModal(){
        this.modalCtrl.dismiss();
    }


  }
