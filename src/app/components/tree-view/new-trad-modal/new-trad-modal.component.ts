import { Component, OnInit } from '@angular/core';
import { ModalController } from '@ionic/angular';

@Component({
  selector: 'app-new-trad-modal',
  templateUrl: './new-trad-modal.component.html',
  styleUrls: ['./new-trad-modal.component.scss'],
})
export class NewTradModalComponent implements OnInit {

  traduction: {
    path: string;
    lang: string;
    value: string;
  };

  constructor(
    private modalController: ModalController
  ) { }

  ngOnInit() {}

  cancel() {
    this.modalController.dismiss();
  }

  confirm() {
    this.modalController.dismiss(this.traduction);
  }

}
