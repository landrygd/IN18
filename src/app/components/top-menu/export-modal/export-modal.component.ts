import { Component, OnInit, Input } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { SettingsModalComponent } from '../settings-modal/settings-modal.component';

@Component({
  selector: 'app-export-modal',
  templateUrl: './export-modal.component.html',
  styleUrls: ['./export-modal.component.scss'],
})
export class ExportModalComponent implements OnInit {

  @Input() tab = 'json';

  files: File[] = [];

  @Input() type = 'json';


  constructor(
    private modalController: ModalController
  ) { }

  ngOnInit() { }


  typeChanged(value) {
    this.type = value;
  }
  cancel() {
    this.modalController.dismiss();
  }

  export() {
    this.modalController.dismiss({ type: this.type, files: this.files });
  }

  async presentSettingsModal() {
    const modal = await this.modalController.create({
      component: SettingsModalComponent,
      componentProps: { tab: 'import_export' },
      cssClass: ''
    });
    return await modal.present();
  }

}
