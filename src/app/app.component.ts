import { Component, ViewChild, OnInit, Directive } from '@angular/core';
import { Platform, ModalController, IonVirtualScroll } from '@ionic/angular';
import { SplashScreen } from '@ionic-native/splash-screen/ngx';
import { StatusBar } from '@ionic-native/status-bar/ngx';
import { GlobalService } from './services/global.service';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import { NewTradModalComponent } from './components/tree-view/new-trad-modal/new-trad-modal.component';
import { Observable, Subject, of } from 'rxjs';
import {takeUntil} from 'rxjs/operators';
import { TraductionsGroup } from './classes/traductions-group';
import { Folder } from './classes/folder';
import { Structure } from './classes/structure';


@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss']
})
export class AppComponent implements OnInit {

  @ViewChild(IonVirtualScroll) virtualScroll: IonVirtualScroll;

  path: string;
  subStructure: any;
  itemGroupList: any[];

  fileUrl: SafeResourceUrl;

  selectedStructure: Structure[];

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

  ngOnInit(){
    /*this.global.selectedStructure$.subscribe(value => {
      console.log(value)
      this.selectedStructure = value;
      // this.virtualScroll.checkEnd();
    }
      );*/
  }

  async addTraduction(isFolder = false) {
    const modal = await this.modalController.create({
      component: NewTradModalComponent,
      componentProps: {parentFolder: this.global.getSelectedFolder(), isFolder}
    });
    await modal.present();
  }

}
