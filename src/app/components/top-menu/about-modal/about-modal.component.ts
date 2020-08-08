import { Component, OnInit } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { Plugins } from '@capacitor/core';
import { ElectronService } from 'ngx-electron';
const { LocalNotifications, Clipboard, Modals, App } = Plugins;

@Component({
  selector: 'app-about-modal',
  templateUrl: './about-modal.component.html',
  styleUrls: ['./about-modal.component.scss'],
})
export class AboutModalComponent implements OnInit {

  constructor(public modalCtrl: ModalController, private electronService: ElectronService) { }

  ngOnInit() { }

  dismissModal() {
    this.modalCtrl.dismiss();
  }

  deakcor() {
    if (this.electronService.isElectronApp) {
      App.openUrl({ url: 'https://twitter.com/deakcor' });
    } else {
      window.open('https://twitter.com/deakcor', '_blank');
    }

  }

  landry() {
    if (this.electronService.isElectronApp) {
      App.openUrl({ url: 'https://github.com/landry42' });
    } else {
      window.open('https://github.com/landry42', '_blank');
    }

  }

  donation() {
    if (this.electronService.isElectronApp) {
      App.openUrl({ url: 'https://liberapay.com/IN18/donate' });
    } else {
      window.open('https://liberapay.com/IN18/donate', '_blank');
    }

  }

  copyright() {
    if (this.electronService.isElectronApp) {
      App.openUrl({ url: 'https://github.com/landry42/IN18/blob/master/LICENSE' });
    } else {
      window.open('https://github.com/landry42/IN18/blob/master/LICENSE', '_blank');
    }

  }

}
