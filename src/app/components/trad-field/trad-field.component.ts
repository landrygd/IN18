import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { PopoverController } from '@ionic/angular';
import { ElectronService } from 'ngx-electron';
import { Traduction } from 'src/app/classes/traduction';
import { GlobalService } from 'src/app/services/global.service';
import { PopoverMenu } from '../tree-view/menu-popover/template-popover.component';

@Component({
  selector: 'app-trad-field',
  templateUrl: './trad-field.component.html',
  styleUrls: ['./trad-field.component.scss'],
})
export class TradFieldComponent implements OnInit {

  @Input() trad: Traduction;

  btnColor: string;
  btnFill: string;
  btnText: string;

  constructor(public popoverCtrl: PopoverController, private electronService:ElectronService) {

  }

  ngOnInit() {
    this.updateBtn();
  }

  confirm() {
    this.trad.checked = !this.trad.checked;
    this.updateBtn();
  }

  updateBtn() {
    if (!this.trad.checked) {
      this.btnColor = 'primary';
      this.btnFill = 'clear';
      this.btnText = 'Validate';
    } else {
      this.btnColor = 'success';
      this.btnFill = 'solid';
      this.btnText = 'Validated';
    }
  }

  onUpdate(value) {
    this.trad.value = value;
  }

  updateLanguage(){
    if (this.electronService.isElectronApp) {
      this.electronService.ipcRenderer.send(
        "update-language",
        this.trad.language
      );
    }
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
}
