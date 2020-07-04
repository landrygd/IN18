import { Component, Input, EventEmitter} from '@angular/core';
import {  PopoverController, AlertController } from '@ionic/angular';
import { GlobalService } from 'src/app/services/global.service';

@Component({
  templateUrl: './template-popover.component.html',
  })
  export class PopoverPage {

    @Input() id = 10;

    constructor(public popoverCtrl: PopoverController,
                public alertController: AlertController,
                public global: GlobalService) {
    }


    testClick(){
      this.popoverCtrl.dismiss();
    }

    public onFileSelected(event) {
      const file: File = event.target.files[0];
      this.global.load(file);
      this.popoverCtrl.dismiss();
    }

    quit() {}

    import(files){
      this.popoverCtrl.dismiss();
    }

    save(){
      this.global.download();
      this.popoverCtrl.dismiss();
    }

    new(){
      this.presentNewProject();
      this.popoverCtrl.dismiss();
    }

    close() {}

    async presentNewProject() {
      const alert = await this.alertController.create({
        cssClass: '',
        header: 'Attention',
        subHeader: '',
        message: 'Create a new project, the unsave changes of your actual project will be lost.',
        buttons: [{
          text: 'No',
          role: 'cancel',
          cssClass: 'danger',
          handler: (blah) => {
            console.log('cancel');
          }
        }, {
          text: 'Yes',
          cssClass: 'primary',
          handler: () => {
            this.global.newProject();
          }
        }]
      });

      await alert.present();
    }
  }
