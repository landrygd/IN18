import { Component, ViewChild, OnInit, Directive, ChangeDetectorRef, ElementRef } from '@angular/core';
import { Platform, ModalController, IonVirtualScroll, ToastController, AlertController } from '@ionic/angular';
import { SplashScreen } from '@ionic-native/splash-screen/ngx';
import { StatusBar } from '@ionic-native/status-bar/ngx';
import { GlobalService } from './services/global.service';
import { SafeResourceUrl } from '@angular/platform-browser';
import { NewTradModalComponent } from './components/tree-view/new-trad-modal/new-trad-modal.component';
import { Structure } from './classes/structure';
import { LanguagesModalPage } from './components/top-menu/languages-modal/languages-modal.component';
import { ElectronService } from 'ngx-electron';
import { ImportExportService } from './services/import-export.service';
import { SettingsService } from './services/settings.service';
import { TopMenuComponent } from './components/top-menu/top-menu.component';

let self;

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss']
})
export class AppComponent implements OnInit {

  @ViewChild(IonVirtualScroll) virtualScroll: IonVirtualScroll;
  @ViewChild('topmenu') topMenu:TopMenuComponent;

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
    public global: GlobalService,
    private electronService: ElectronService,
    private cdr: ChangeDetectorRef,
    public importExportService: ImportExportService,
    private toastController: ToastController,
    private alertController: AlertController,
    public settings:SettingsService
  ) {
    this.initializeApp();
    self = this;
    if (this.electronService.isElectronApp) {
      // this.electronService.ipcRenderer.on('save-file', this.fileSaved);
      this.electronService.ipcRenderer.on('file-loaded', this.fileLoaded);
      this.electronService.ipcRenderer.on('file-saved', this.fileSaved);
      this.electronService.ipcRenderer.on('file-exported', this.fileExported)
    }
  }
  async fileLoaded(event, filePath: string, data: string, success: boolean) {
    if (success) {
      self.importExportService.load(data, filePath);
      // self.presentLoadedToast();
      self.presentLoadConfirm();
    }
  }

  async fileSaved(event, filePath: string, success: boolean) {
    if (success && filePath !== '' && filePath !== undefined) {
      self.global.projectPath = filePath;
      self.global.updateSavedStructure();
      self.presentSavedToast();
    }
    self.cdr.detectChanges();
    self.global.loading = false;
  }

  async fileExported(event, filePath: string, success: boolean) {
    if (success && filePath !== '' && filePath !== undefined) {
      var ext =  filePath.split('.').pop();
      self.global.ExportingPaths["ext"] = filePath;
    }
  }

  openFile(path:String){
    console.log("a")
    console.log(path)
  }

  async presentLoadConfirm() {
    const alert = await this.alertController.create({
      cssClass: '',
      header: 'Confirmation',
      subHeader: '',
      message: 'Project well loaded',
      buttons: [{
        text: 'Ok',
        cssClass: 'primary',
        handler: () => {
        }
      }]
    });

    await alert.present();
  }


  

  async presentLoadedToast() {
    const toast = await this.toastController.create({
      message: 'Project loaded.',
      duration: 2000
    });
    await toast.present();
  }

  async presentSavedToast() {
    const toast = await this.toastController.create({
      message: 'Project saved.',
      duration: 2000
    });
    await toast.present();

  }

  initializeApp() {
    this.platform.ready().then(() => {
      this.statusBar.styleDefault();
      this.splashScreen.hide();
    });
  }

  ngOnInit() {
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
      componentProps: { parentFolder: this.global.getSelectedFolder(), isFolder }
    });
    await modal.present();
  }

  async presentLanguagesModal(id: number = 0) {
    const modal = await this.modalController.create({
      component: LanguagesModalPage,
      componentProps: { id },
      cssClass: ''
    });
    return await modal.present();
  }

}
