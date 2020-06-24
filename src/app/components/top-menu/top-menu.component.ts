import { Component, OnInit } from '@angular/core';
import { PopoverController } from '@ionic/angular';
import { PopoverPage } from './template-popover.component';

@Component({
  selector: 'app-top-menu',
  templateUrl: './top-menu.component.html',
  styleUrls: ['./top-menu.component.scss'],
})
export class TopMenuComponent implements OnInit {

  constructor(public popoverCtrl: PopoverController) { }

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

}
