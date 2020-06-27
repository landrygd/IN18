import { Injectable } from '@angular/core';
import { ToastController } from '@ionic/angular';

@Injectable({
  providedIn: 'root'
})
export class TranslatorService {

  toast: HTMLIonToastElement;

  constructor(
    private toastController: ToastController,
  ) { }

  async translate() {
    this.toast = await this.toastController.create({
      message: 'loading... 0%',
    });
    this.toast.present();
  }


}
