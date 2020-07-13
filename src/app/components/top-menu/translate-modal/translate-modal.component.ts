import { Component, OnInit } from '@angular/core';
import { ModalController } from '@ionic/angular';

@Component({
  selector: 'app-translate-modal',
  templateUrl: './translate-modal.component.html',
  styleUrls: ['./translate-modal.component.scss'],
})
export class TranslateModalComponent implements OnInit {

  constructor(public modalCtrl: ModalController) { }

  ngOnInit() {}

  dismissModal() {
    this.modalCtrl.dismiss();
  }


}
