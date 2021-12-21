import { Component, OnInit, Input } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { GlobalService } from 'src/app/services/global.service';
import { ImportExportService } from 'src/app/services/import-export.service';
import { SettingsService } from 'src/app/services/settings.service';
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

  previewExport =[];

  constructor(
    private modalController: ModalController,
    public global: GlobalService,
    private importExport: ImportExportService,
    public settings: SettingsService
  ) { }

  ngOnInit() {this.typeChanged(this.type); }


  typeChanged(value) {
    this.type = value;
    switch (this.type){
      case 'json':
        this.previewExport = this.importExport.getJsonPreview();
        break;
      case 'csv':
        this.previewExport = this.importExport.getCsvPreview();
        break;
    }
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
    await modal.present();
    await modal.onDidDismiss();
    this.typeChanged(this.type);
  }

}
