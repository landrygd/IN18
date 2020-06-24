import { Component, Input } from "@angular/core";
import {  PopoverController } from '@ionic/angular';

@Component({
  templateUrl: './template-popover.component.html',
  })
  export class PopoverPage {

    @Input() id:number=10

    constructor(public popoverCtrl: PopoverController) {
    }
    

    testClick(){
      this.popoverCtrl.dismiss()
    }

    load(files){
      console.log(files)
      //var myBlob = new Blob([new Uint8Array(file)], {type: "octet/stream"});

      
      this.popoverCtrl.dismiss()

    }

    import(files){
      this.popoverCtrl.dismiss()
    }

    save(){
      this.popoverCtrl.dismiss()
    }
  }