import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { GlobalService } from 'src/app/services/global.service';
import { TraductionsGroup } from 'src/app/classes/traductions-group';
import { AlertController, ModalController, PopoverController } from '@ionic/angular';
import { LanguagesModalPage } from '../top-menu/languages-modal/languages-modal.component';
import { SettingsService } from 'src/app/services/settings.service';
import { PopoverMenu } from '../tree-view/menu-popover/template-popover.component';

@Component({
  selector: 'app-trads-group',
  templateUrl: './trads-group.component.html',
  styleUrls: ['./trads-group.component.scss'],
})
export class TradsGroupComponent implements OnInit {

  @Input() tradGroup: TraductionsGroup;
  @Input() canExpand: boolean;

  constructor(public popoverCtrl: PopoverController, public modalController: ModalController,
              public settings: SettingsService,
              private global: GlobalService,
              public alertController: AlertController) { }

  ngOnInit() {
  }

  onNameUpdate(value: string) {
    this.tradGroup.setName(value);
  }

  select() {
    this.global.setSelectedStructure(this.tradGroup);
  }

  selectParent() {
    this.global.setSelectedStructure(this.tradGroup.parentFolder);
  }

  async presentPopover(ev: any, f) {
    const popover = await this.popoverCtrl.create({
      component: PopoverMenu,
      componentProps: { item:f },
      cssClass: '',
      event: ev,
      translucent: true
    });
    await popover.present();
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
