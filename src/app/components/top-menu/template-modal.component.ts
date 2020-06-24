import { Component, Input } from "@angular/core";
import {  ModalController } from '@ionic/angular';

@Component({
  templateUrl: './template-modal.component.html',
  })
  export class ModalPage {

    @Input() id:number=10

    constructor(public modalCtrl: ModalController) {
    }

    dismissModal(){
        this.modalCtrl.dismiss()
    }
    

  }