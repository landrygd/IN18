import { Component, OnInit } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { Traduction } from 'src/app/classes/traduction';

@Component({
  selector: 'app-new-trad-modal',
  templateUrl: './new-trad-modal.component.html',
  styleUrls: ['./new-trad-modal.component.scss'],
})
export class NewTradModalComponent implements OnInit {

  traduction: Traduction = new Traduction('', '', 'en');


  constructor(
    private modalController: ModalController
  ) { }

  ngOnInit() {}

  cancel() {
    this.modalController.dismiss();
  }

  onLanguageChange(value){
    this.traduction.setLanguage(value.detail.value);
  }

  onValueChange(value){
    this.traduction.setValue(value);
  }
  onPathChange(value){
    // this.traduction.setPath(value);
  }

  import() {
    this.modalController.dismiss(this.traduction);
  }
}
