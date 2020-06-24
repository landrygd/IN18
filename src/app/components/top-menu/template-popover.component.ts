import { Component, Input } from "@angular/core";
import { NavParams, PopoverController } from '@ionic/angular';

@Component({
  templateUrl: './template-popover.component.html',
  })
  export class PopoverPage {
    constructor(public navParams:NavParams,public popoverCtrl: PopoverController) {
        this.id = this.navParams.get('id');
    }
  
    close() {
      
    }
    id:number=0

    testClick(){
      this.popoverCtrl.dismiss()
    }
  }