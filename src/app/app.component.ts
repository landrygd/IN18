import { Component } from '@angular/core';
import { Platform, ModalController } from '@ionic/angular';
import { SplashScreen } from '@ionic-native/splash-screen/ngx';
import { StatusBar } from '@ionic-native/status-bar/ngx';
import { GlobalService } from './services/global.service';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import { NewTradModalComponent } from './components/tree-view/new-trad-modal/new-trad-modal.component';

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss']
})
export class AppComponent {

  path: string;
  subStructure: any;
  itemGroupList: any[];

  fileUrl: SafeResourceUrl;

  constructor(
    private modalController: ModalController,
    private platform: Platform,
    private splashScreen: SplashScreen,
    private statusBar: StatusBar,
    private global: GlobalService,
    private sanitizer: DomSanitizer
  ) {
    this.initializeApp();
  }

  initializeApp() {
    this.platform.ready().then(() => {
      this.statusBar.styleDefault();
      this.splashScreen.hide();
    });
  }

  async addTraduction(isFolder = false) {
    const modal = await this.modalController.create({
      component: NewTradModalComponent,
      componentProps: {parentFolder: this.global.getSelectedFolder(), isFolder}
    });
    await modal.present();
  }

}
