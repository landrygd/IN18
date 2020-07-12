import { Component, OnInit } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { saveAs } from 'file-saver';
import { SettingsModalComponent } from '../settings-modal/settings-modal.component';

@Component({
  selector: 'app-upload-modal',
  templateUrl: './upload-modal.component.html',
  styleUrls: ['./upload-modal.component.scss'],
})
export class UploadModalComponent implements OnInit {

  files: File[] = [];

  type = 'json';

  exampleJsonEn = `
  {"folder" :
        {"id_yes" : "yes"}
      }
  `;

  exampleJsonFr = `
  {"folder" :
        {"id_yes" : "oui"}
      }
  `;

  constructor(
    private modalController: ModalController
  ) { }

  ngOnInit() {}

  onSelect(event) {
    console.log(event);
    this.files.push(...event.addedFiles);
  }

  typeChanged(value){
    this.type = value;
  }

  onRemove(event) {
    console.log(event);
    this.files.splice(this.files.indexOf(event), 1);
  }

  cancel() {
    this.modalController.dismiss();
  }

  import() {
    this.modalController.dismiss({type: this.type, files: this.files});
  }

  downloadTemplate(){
    switch (this.type){
      case 'json':
        this.downloadJsonTemplate();
        break;
      case 'csv':
        this.downloadCsvTemplate();
        break;
    }
  }

  downloadJsonTemplate(){
    let blob = new Blob([this.exampleJsonEn], { type: 'application/json' });
    saveAs(blob, 'en.json');
    blob = new Blob([this.exampleJsonFr], { type: 'application/json' });
    saveAs(blob, 'fr.json');
  }

  downloadCsvTemplate(){

  }

  async presentSettingsModal() {
    const modal = await this.modalController.create({
      component: SettingsModalComponent,
      componentProps: {tab: 'import'},
      cssClass: ''
    });
    return await modal.present();
  }
}
