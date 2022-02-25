import { Component, OnInit, Input } from '@angular/core';
import { ModalController, AlertController } from '@ionic/angular';
import { TraductionsGroup } from 'src/app/classes/traductions-group';
import { Folder } from 'src/app/classes/folder';
import { GlobalService } from 'src/app/services/global.service';
import { LanguagesModalPage } from '../../top-menu/languages-modal/languages-modal.component';
import { Traduction } from 'src/app/classes/traduction';

@Component({
  selector: 'app-new-trad-modal',
  templateUrl: './new-trad-modal.component.html',
  styleUrls: ['./new-trad-modal.component.scss'],
})
export class NewTradModalComponent implements OnInit {

  tradGroup: TraductionsGroup;

  newFolder: Folder;

  parentFolder: Folder;

  parentFolderName = '';

  fileName = '';

  isFolder = false;


  constructor(
    private modalController: ModalController, public alertController: AlertController, private global: GlobalService
  ) {

  }

  ngOnInit() {
    this.parentFolderName = this.parentFolder.getName();
    this.tradGroup = new TraductionsGroup('', this.parentFolder);
    this.newFolder = new Folder('', this.parentFolder);
    this.tradGroup.addMissingTrad(this.global.languages);
  }

  cancel() {
    this.modalController.dismiss();
  }

  onNameChange(value) {
    this.tradGroup.setName(value);
    this.newFolder.setName(value);
    this.fileName = value;
  }
  onFolderChange(value) {
    // this.traduction.setPath(value);
  }

  onIsFolderChange(value) {
    this.isFolder = value;
  }


  import() {
    let result = false;
    if (this.isFolder) {
      result = this.parentFolder.addFolder(this.newFolder);
    } else {
      result = this.parentFolder.addTraductionGroup(this.tradGroup);
      this.tradGroup.addMissingTrad(this.global.languages);
    }

    if (!result) {
      this.presentExistDialog();
    } else {
      this.modalController.dismiss();
    }
  }

  async presentExistDialog() {
    const alert = await this.alertController.create({
      cssClass: '',
      header: 'Attention',
      subHeader: '',
      message: 'Item or folder with same name already exist in this folder.',
      buttons: [{
        text: 'Ok',
        role: 'cancel',
        cssClass: 'danger',
        handler: (blah) => {
        }
      }]
    });

    await alert.present();
  }

  async presentLanguagesModal(id: number = 0) {
    const modal = await this.modalController.create({
      component: LanguagesModalPage,
      componentProps: { id },
      cssClass: ''
    });
    await modal.present();
    await modal.onDidDismiss();
    this.tradGroup.addMissingTrad(this.global.languages);
  }
}
