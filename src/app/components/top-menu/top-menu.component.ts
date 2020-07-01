import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { PopoverController, AlertController, ModalController } from '@ionic/angular';
import { PopoverPage } from './template-popover.component';
import { ModalPage } from './template-modal.component';
import { GlobalService } from 'src/app/services/global.service';
import { UploadModalComponent } from './upload-modal/upload-modal.component';
import { TranslatorService } from 'src/app/services/translator.service';

@Component({
  selector: 'app-top-menu',
  templateUrl: './top-menu.component.html',
  styleUrls: ['./top-menu.component.scss'],
})
export class TopMenuComponent implements OnInit {

  @Output() update = new EventEmitter();

  constructor(
    public popoverCtrl: PopoverController,
    public modalController: ModalController,
    public alertController: AlertController,
    public global: GlobalService,
    public translator: TranslatorService
    ) { }

  ngOnInit() {}

  async presentPopover(ev: any, id: number) {
    const popover = await this.popoverCtrl.create({
      component: PopoverPage,
      componentProps: {id},
      cssClass: '',
      event: ev,
      translucent: true
    });
    return await popover.present();
  }

  async presentModal(id: number) {
    const modal = await this.modalController.create({
      component: ModalPage,
      componentProps: {id},
      cssClass: ''
    });
    return await modal.present();
  }

  async presentTradConfirm() {
    const alert = await this.alertController.create({
      cssClass: '',
      header: 'Attention',
      subHeader: '',
      message: 'Translate all the blank fields with Google Traduction?',
      buttons: [{
        text: 'No',
        role: 'cancel',
        cssClass: 'danger',
        handler: (blah) => {
          console.log('Confirm Cancel: blah');
        }
      }, {
        text: 'Yes',
        cssClass: 'primary',
        handler: () => {
          console.log('Confirm Okay');
        }
      }]
    });

    await alert.present();
  }

  async download() {
    this.global.download();
  }

  async upload() {
    const modal = await this.modalController.create({
    component: UploadModalComponent,
    });
    await modal.present();
    const docs: File[] = (await modal.onDidDismiss()).data;
    const files = [];
    const languages = [];
    for (const doc of docs) {
      files.push({default: JSON.parse(await doc.text())});
      const name = doc.name;
      const nameArray = name.split('.');
      nameArray.pop();
      const language = nameArray.join('.');
      languages.push(language);
    }
    this.global.importJsonFiles(files, languages);
    this.update.emit();
  }

  translate() {
    this.translator.translate();
  }
}
