import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { GlobalService } from 'src/app/services/global.service';
import { TraductionsGroup } from 'src/app/classes/traductions-group';
import { AlertController, ModalController } from '@ionic/angular';
import { LanguagesModalPage } from '../top-menu/languages-modal/languages-modal.component';
import { SettingsService } from 'src/app/services/settings.service';

@Component({
  selector: 'app-trads-group',
  templateUrl: './trads-group.component.html',
  styleUrls: ['./trads-group.component.scss'],
})
export class TradsGroupComponent implements OnInit {

  @Input() tradGroup: TraductionsGroup;
  @Input() canExpand: boolean;

  constructor(public modalController: ModalController,
              public settings: SettingsService,
              private global: GlobalService,
              public alertController: AlertController) { }

  ngOnInit() {
  }

  onNameUpdate(value: string) {
    this.tradGroup.setName(value);
  }

  delete() {
    if (this.tradGroup.parentFolder.removeTradGroup(this.tradGroup)) {
      this.global.setSelectedStructure(this.global.selectedFolder);
    }
  }

  select() {
    this.global.setSelectedStructure(this.tradGroup);
  }

  selectParent() {
    this.global.setSelectedStructure(this.tradGroup.parentFolder);
  }

  async presentDeleteConfirm() {
    const alert = await this.alertController.create({
      cssClass: '',
      header: 'Attention',
      subHeader: '',
      message: 'Are you sure to delete this item?',
      buttons: [{
        text: 'No',
        role: 'cancel',
        cssClass: 'danger',
        handler: (blah) => {
        }
      }, {
        text: 'Yes',
        cssClass: 'primary',
        handler: () => {
          this.delete();
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
    return await modal.present();
  }

}
