import { Component } from "@angular/core";

@Component({
    template: `
      <ion-list>
        <ion-item button (click)="testClick()">test</ion-item>
      </ion-list>
    `
  })
  export class PopoverPage {
    constructor() {}
  
    close() {
      
    }
  }