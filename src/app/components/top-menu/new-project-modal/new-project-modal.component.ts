import { Component, OnInit } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { GlobalService } from 'src/app/services/global.service';
import { LanguagesModalPage } from '../languages-modal/languages-modal.component';

@Component({
  selector: 'app-new-project-modal',
  templateUrl: './new-project-modal.component.html',
  styleUrls: ['./new-project-modal.component.scss'],
})
export class NewProjectModalComponent implements OnInit {

  constructor(public modalCtrl: ModalController, public global: GlobalService) { }

  ngOnInit() {}

  dismissModal() {
    this.modalCtrl.dismiss();
  }

  structureNameChanged(value){
    this.global.structure.setName(value);
  }

  async presentLanguagesModal(id: number = 0) {
    const modal = await this.modalCtrl.create({
      component: LanguagesModalPage,
      componentProps: { id },
      cssClass: ''
    });
    return await modal.present();
  }

}
