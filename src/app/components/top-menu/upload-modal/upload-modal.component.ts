import { Component, OnInit, Input } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { saveAs } from 'file-saver';
import { SettingsModalComponent } from '../settings-modal/settings-modal.component';

@Component({
  selector: 'app-upload-modal',
  templateUrl: './upload-modal.component.html',
  styleUrls: ['./upload-modal.component.scss'],
})
export class UploadModalComponent implements OnInit {

  @Input() tab = 'json';

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

  exampleCsv = `id,en,fr
id_yes,yes,oui
  `;

  constructor(
    private modalController: ModalController
  ) { }

  ngOnInit() { }

  onSelect(event) {
    this.files.push(...event.addedFiles);
  }

  typeChanged(value) {
    this.type = value;
  }

  onRemove(event) {
    this.files.splice(this.files.indexOf(event), 1);
  }

  cancel() {
    this.modalController.dismiss();
  }

  import() {
    this.modalController.dismiss({ type: this.type, files: this.files });
  }

  downloadTemplate() {
    switch (this.type) {
      case 'json':
        this.downloadJsonTemplate();
        break;
      case 'csv':
        this.downloadCsvTemplate();
        break;
    }
  }

  downloadJsonTemplate() {
    let blob = new Blob([this.exampleJsonEn], { type: 'application/json' });
    saveAs(blob, 'en.json');
    blob = new Blob([this.exampleJsonFr], { type: 'application/json' });
    saveAs(blob, 'fr.json');
  }

  downloadCsvTemplate() {
    const blob = new Blob(["\uFEFF"+this.exampleCsv], { type: 'text/csv; charset=utf-8' });
    saveAs(blob, 'example.csv');
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
