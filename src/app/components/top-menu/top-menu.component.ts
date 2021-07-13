import { Component, OnInit, Output, EventEmitter, HostListener, ViewChild, ElementRef } from '@angular/core';
import { PopoverController, AlertController, ModalController, ToastController } from '@ionic/angular';
import { PopoverPage } from './menu-popover/template-popover.component';
import { LanguagesModalPage } from './languages-modal/languages-modal.component';
import { GlobalService } from 'src/app/services/global.service';
import { UploadModalComponent } from './upload-modal/upload-modal.component';
import { TranslatorService } from 'src/app/services/translator.service';
import { SettingsModalComponent } from './settings-modal/settings-modal.component';
import { settings } from 'cluster';
import { SettingsService } from 'src/app/services/settings.service';
import { ImportExportService } from 'src/app/services/import-export.service';
import { AboutModalComponent } from './about-modal/about-modal.component';
import { TranslateModalComponent } from './translate-modal/translate-modal.component';
import { Plugins } from '@capacitor/core';
import { ElectronService } from 'ngx-electron';
import { NewProjectModalComponent } from './new-project-modal/new-project-modal.component';
import { ExportModalComponent } from './export-modal/export-modal.component';
const { LocalNotifications, Clipboard, Modals, App } = Plugins;

interface Import {
  type?: string;
  files?: File[];
}

interface Menu {
  type?: string;
  value?: any;
}



@Component({
  selector: 'app-top-menu',
  templateUrl: './top-menu.component.html',
  styleUrls: ['./top-menu.component.scss'],
})
export class TopMenuComponent implements OnInit {

  ctrlDown = false;
  shiftDown = false;
  canNewProject = true;

  forceClose = false;

  @ViewChild('load', { static: false }) loadInput: ElementRef;


  constructor(
    public popoverCtrl: PopoverController,
    public modalController: ModalController,
    public alertController: AlertController,
    public global: GlobalService,
    public translator: TranslatorService,
    private setting: SettingsService,
    private importExport: ImportExportService,
    private electronService: ElectronService
  ) {

  }

  ngOnInit() { }
  async presentPopover(ev: any, id: number) {
    const popover = await this.popoverCtrl.create({
      component: PopoverPage,
      componentProps: { id },
      cssClass: '',
      event: ev,
      translucent: true
    });
    await popover.present();
    const data: string = (await popover.onDidDismiss()).data;
    console.log(data);
    if (data !== undefined) {
      switch (data) {
        case 'load':
          if (this.electronService.isElectronApp) {
            this.importExport.load_in18();
          } else {
            this.loadInput.nativeElement.click();
          }
          break;
        case 'close':
          this.close();
          break;
        case 'save':
          this.importExport.download();
          break;
        case 'saveas':
          this.importExport.download(true);
          break;
        case 'new':
          this.presentNewProject();
          break;

      }
    }

  }

  async close() {
    window.close();
  }

  quit() {
    if (this.electronService.isElectronApp) {
      App.exitApp();
    }
  }

  async presentLanguagesModal(id: number) {
    const modal = await this.modalController.create({
      component: LanguagesModalPage,
      componentProps: { id },
      cssClass: ''
    });
    return await modal.present();
  }

  async presentSettingsModal() {
    const modal = await this.modalController.create({
      component: SettingsModalComponent,
      componentProps: {},
      cssClass: ''
    });
    return await modal.present();
  }

  async presentTranslateModal() {
    const modal = await this.modalController.create({
      component: TranslateModalComponent,
      componentProps: {},
      cssClass: ''
    });
    return await modal.present();
  }

  async aboutModal() {
    const modal = await this.modalController.create({
      component: AboutModalComponent,
      componentProps: {},
      cssClass: ''
    });
    return await modal.present();
  }



  async presentTradConfirm() {
    const alert = await this.alertController.create({
      cssClass: '',
      header: 'Attention',
      subHeader: '',
      message: 'Translate all the blank fields with Google Traduction?',
      buttons: [{
        text: 'No',
        role: 'cancel',
        cssClass: 'danger',
        handler: (blah) => {
          console.log('Confirm Cancel: blah');
        }
      }, {
        text: 'Yes',
        cssClass: 'primary',
        handler: () => {
          console.log('Confirm Okay');
        }
      }]
    });

    await alert.present();
  }


  async export() {
    const modal = await this.modalController.create({
      component: ExportModalComponent,
      componentProps: { tab: this.setting.tabImportExport, type:this.setting.tabImportExport },
    });
    await modal.present();
    const docs: Import = (await modal.onDidDismiss()).data;
    if (docs !== undefined) {
      switch (docs.type) {
        case 'json':
          this.importExport.downloadJsons();
          break;
        case 'csv':
          this.importExport.downloadCsv();
          break;
      }
    }


  }



  async upload() {
    const modal = await this.modalController.create({
      component: UploadModalComponent,
      componentProps: { tab: this.setting.tabImportExport },
    });
    await modal.present();
    const docs: Import = (await modal.onDidDismiss()).data;
    if (docs !== undefined) {
      switch (docs.type) {
        case 'json':
          const files = [];
          const languages = [];
          for (const doc of docs.files) {
            files.push({ default: JSON.parse(await doc.text()) });
            const name = doc.name;
            const nameArray = name.split('.');
            nameArray.pop();
            const language = nameArray.join('.');
            languages.push(language);
          }
          this.importExport.importJsonFiles(files, languages);
          break;
        case 'csv':
          for (const doc of docs.files) {
            this.importExport.importCsvFile(doc);
          }
          break;
      }
    }

  }

  translate() {
    this.translator.translate();
  }

  fileNameToISO(fileName: string): string {
    const isoLanguages = ['aa', 'ab', 'ae', 'af', 'ak', 'am', 'an', 'ar', 'as', 'av', 'ay', 'az', 'ba', 'be', 'bg', 'bh', 'bi', 'bm', 'bn', 'bo', 'br', 'bs', 'ca', 'ce', 'ch', 'co', 'cr', 'cs', 'cu', 'cv', 'cy', 'da', 'de', 'dv', 'dz', 'ee', 'el', 'en', 'eo', 'es', 'et', 'eu', 'fa', 'ff', 'fi', 'fj', 'fo', 'fr', 'fy', 'ga', 'gd', 'gl', 'gn', 'gu', 'gv', 'ha', 'he', 'hi', 'ho', 'hr', 'ht', 'hu', 'hy', 'hz', 'ia', 'id', 'ie', 'ig', 'ii', 'ik', 'io', 'is', 'it', 'iu', 'ja', 'jv', 'ka', 'kg', 'ki', 'kj', 'kk', 'kl', 'km', 'kn', 'ko', 'kr', 'ks', 'ku', 'kv', 'kw', 'ky', 'la', 'lb', 'lg', 'li', 'ln', 'lo', 'lt', 'lu', 'lv', 'mg', 'mh', 'mi', 'mk', 'ml', 'mn', 'mo', 'mr', 'ms', 'mt', 'my', 'na', 'nb', 'nd', 'ne', 'ng', 'nl', 'nn', 'no', 'nr', 'nv', 'ny', 'oc', 'oj', 'om', 'or', 'os', 'pa', 'pi', 'pl', 'ps', 'pt', 'qu', 'rc', 'rm', 'rn', 'ro', 'ru', 'rw', 'sa', 'sc', 'sd', 'se', 'sg', 'sh', 'si', 'sk', 'sl', 'sm', 'sn', 'so', 'sq', 'sr', 'ss', 'st', 'su', 'sv', 'sw', 'ta', 'te', 'tg', 'th', 'ti', 'tk', 'tl', 'tn', 'to', 'tr', 'ts', 'tt', 'tw', 'ty', 'ug', 'uk', 'ur', 'uz', 've', 'vi', 'vo', 'wa', 'wo', 'xh', 'yi', 'yo', 'za', 'zh', 'zu'];
    for (const lang of isoLanguages) {
      if (fileName.toLowerCase().includes(lang)) {
        return lang;
      }
    }
    return '';
  }

  async onFileSelected(event) {
    console.log(event);
    const file: File = event.target.files[0];
    this.importExport.load(await file.text(), file.path);
  }


  @HostListener('window:keydown', ['$event'])
  handleKeyboardEvent(event: KeyboardEvent) {
    // tslint:disable: deprecation
    if (event.keyCode === 17) {
      this.ctrlDown = true;
    }
    else if (event.keyCode === 16) {
      this.shiftDown = true;
    }
    else if (event.keyCode === 83 && this.ctrlDown && this.shiftDown) {
      this.ctrlDown = false;
      this.shiftDown = false;
      this.importExport.download(true);
    }
    else if (event.keyCode === 83 && this.ctrlDown) {
      this.ctrlDown = false;
      this.importExport.download();
    }

    else if (event.keyCode === 79 && this.ctrlDown) {
      this.ctrlDown = false;
      if (this.electronService.isElectronApp) {
        this.importExport.load_in18();
        // this.loadInput.nativeElement.click();
      } else {
        this.loadInput.nativeElement.click();
      }
    }
    else if (event.keyCode === 78 && this.ctrlDown) {
      this.presentNewProject();
      this.ctrlDown = false;
    }
    else if (event.keyCode === 81 && this.ctrlDown) {
      this.close();
      this.ctrlDown = false;
    }




  }

  @HostListener('window:keyup', ['$event'])
  handleKeyboardEvent2(event: KeyboardEvent) {
    if (event.keyCode === 17) {
      this.ctrlDown = false;
    }
    else if (event.keyCode === 16) {
      this.shiftDown = false;
    }
  }

  async presentNewProject() {
    if (this.canNewProject) {
      if (this.global.isSaved()) {

        this.global.newProject();
        this.NewProjectModal();
      } else {
        const alert = await this.alertController.create({
          cssClass: '',
          header: 'Attention',
          subHeader: '',
          message: 'Create a new project? The unsave changes of your actual project will be lost.',
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
              this.NewProjectModal();
            }
          }]
        });

        await alert.present();
      }
    }


  }

  async NewProjectModal() {
    this.canNewProject = false;
    const modal = await this.modalController.create({
      component: NewProjectModalComponent,
      componentProps: {},
      cssClass: ''
    });
    await modal.present();
    await modal.onDidDismiss();
    this.canNewProject = true;
  }

  @HostListener('window:beforeunload', ['$event'])
  async handleClose($event) {
    if (!this.global.isSaved() && !this.forceClose) {
      $event.returnValue = false;
      const alert = await this.alertController.create({
        cssClass: '',
        header: 'Attention',
        subHeader: '',
        message: 'Are you sure want to close? Some change aren\'t saved',
        buttons: [{
          text: 'No',
          role: 'cancel',
          cssClass: 'danger',
          handler: (blah) => {
            //
          }
        }, {
          text: 'Yes',
          cssClass: 'primary',
          handler: () => {
            this.forceClose = true;
            close();
          }
        }]
      });

      await alert.present();
    }
  }
}


