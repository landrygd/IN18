import { Component, OnInit } from '@angular/core';
import { PopoverController, AlertController,ModalController } from '@ionic/angular';
import { PopoverPage } from './template-popover.component';
import { ModalPage } from './template-modal.component';

@Component({
  selector: 'app-top-menu',
  templateUrl: './top-menu.component.html',
  styleUrls: ['./top-menu.component.scss'],
})
export class TopMenuComponent implements OnInit {

  constructor(public popoverCtrl: PopoverController,public modalController: ModalController,public alertController: AlertController) { }

  ngOnInit() {}

  async presentPopover(ev: any,id:number) {
    const popover = await this.popoverCtrl.create({
      component: PopoverPage,
      componentProps:{id:id},
      cssClass: '',
      event: ev,
      translucent: true
    });
    return await popover.present();
  }

  async presentModal(id:number) {
    const modal = await this.modalController.create({
      component: ModalPage,
      componentProps:{id:id},
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

}
