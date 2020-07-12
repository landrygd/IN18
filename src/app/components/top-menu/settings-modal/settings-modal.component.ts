import { Component, OnInit, Input } from '@angular/core';
import { ModalController } from '@ionic/angular';

@Component({
  selector: 'app-settings-modal',
  templateUrl: './settings-modal.component.html',
  styleUrls: ['./settings-modal.component.scss'],
})
export class SettingsModalComponent implements OnInit {

  @Input() tab = 'export';

  constructor(private modalController: ModalController) { }

  ngOnInit() {}

  tabChanged(value){

  }

  reset(){}

  close() {
    this.modalController.dismiss();
  }

  save(){}

}
