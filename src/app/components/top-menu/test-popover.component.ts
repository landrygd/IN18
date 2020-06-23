import { Component, Input } from "@angular/core";
import { NavParams } from '@ionic/angular';

@Component({
    template: `
    <ion-list>
        {{data}}
    </ion-list>
  `
  })
  export class PopoverPage {
    @Input() data: any;
    constructor(public navParams:NavParams) {
        this.id = this.navParams.get('id');
        this.data=this.template_by_id[this.id]
    }
  
    close() {
      
    }
    id:number=0
    template_by_id:Object={0:`
      <ion-item button (click)="testClick()">Save <ion-icon name="save" slot="end"></ion-icon></ion-item>
  `}
  }