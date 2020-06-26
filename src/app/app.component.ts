import { Component } from '@angular/core';
import { Platform } from '@ionic/angular';
import { SplashScreen } from '@ionic-native/splash-screen/ngx';
import { StatusBar } from '@ionic-native/status-bar/ngx';
import { GlobalService } from './services/global.service';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss']
})
export class AppComponent {

  tree: any;
  path: string;
  subStructure: any;
  itemGroupList: any[];

  fileUrl: SafeResourceUrl;

  constructor(
    private platform: Platform,
    private splashScreen: SplashScreen,
    private statusBar: StatusBar,
    private global: GlobalService,
    private sanitizer: DomSanitizer
  ) {
    this.initializeApp();
    this.tree = this.global.structure;
  }

  initializeApp() {
    this.platform.ready().then(() => {
      this.statusBar.styleDefault();
      this.splashScreen.hide();
    });
  }

  selected(event) {
    this.path = event;
    this.subStructure = this.global.getSubJSON(this.global.structure, event);
    this.itemGroupList = [];
    for (const key of Object.keys(this.subStructure)) {
      if (typeof this.subStructure[key] === 'object') {
        this.itemGroupList.push(
          {
            path: this.path + '.' + key,
            trads: this.subStructure[key]
          }
        );
      } else {
        return this.itemGroupList.push(
          {
            path: this.path,
            trads: this.subStructure,
          }
        );
      }
    }
    console.log(this.subStructure);
  }


  update() {
    this.tree = this.global.structure;
  }

  onUpdate(event) {
    this.tree = this.global.updatePath(event.path, event.value, event.lang);
    console.log(event.path, event.value, event.lang);
  }

  addTraduction(traduction: any) {
    console.log(traduction);
    // this.tree = this.global.updatePath(traduction.path, traduction.value, traduction.lang);
  }
}
