import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { PopoverController, AlertController, ModalController } from '@ionic/angular';
import { PopoverPage } from './menu-popover/template-popover.component';
import { LanguagesModalPage } from './languages-modal/languages-modal.component';
import { GlobalService } from 'src/app/services/global.service';
import { UploadModalComponent } from './upload-modal/upload-modal.component';
import { TranslatorService } from 'src/app/services/translator.service';

interface Import {
  type?: string;
  files?: File[];
}

@Component({
  selector: 'app-top-menu',
  templateUrl: './top-menu.component.html',
  styleUrls: ['./top-menu.component.scss'],
})
export class TopMenuComponent implements OnInit {


  constructor(
    public popoverCtrl: PopoverController,
    public modalController: ModalController,
    public alertController: AlertController,
    public global: GlobalService,
    public translator: TranslatorService
    ) { }

  ngOnInit() {}

  async presentPopover(ev: any, id: number) {
    const popover = await this.popoverCtrl.create({
      component: PopoverPage,
      componentProps: {id},
      cssClass: '',
      event: ev,
      translucent: true
    });
    return await popover.present();
  }

  async presentLanguagesModal(id: number) {
    const modal = await this.modalController.create({
      component: LanguagesModalPage,
      componentProps: {id},
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
    this.global.downloadJsons();
  }

CSVToArray( strData, strDelimiter = ',' ){

    // Create a regular expression to parse the CSV values.
    const objPattern = new RegExp(
        (
            // Delimiters.
            '(\\' + strDelimiter + '|\\r?\\n|\\r|^)' +

            // Quoted fields.
            '(?:"([^"]*(?:""[^"]*)*)"|' +

            // Standard fields.
            '([^"\\' + strDelimiter + '\\r\\n]*))'
        ),
        'gi'
        );


    // Create an array to hold our data. Give the array
    // a default empty first row.
    const arrData = [[]];

    // Create an array to hold our individual pattern
    // matching groups.
    let arrMatches = null;


    // Keep looping over the regular expression matches
    // until we can no longer find a match.
    while (arrMatches = objPattern.exec( strData )){

        // Get the delimiter that was found.
        const strMatchedDelimiter = arrMatches[ 1 ];

        // Check to see if the given delimiter has a length
        // (is not the start of string) and if it matches
        // field delimiter. If id does not, then we know
        // that this delimiter is a row delimiter.
        if (
            strMatchedDelimiter.length &&
            strMatchedDelimiter !== strDelimiter
            ){

            // Since we have reached a new row of data,
            // add an empty row to our data array.
            arrData.push( [] );

        }

        let strMatchedValue;

        // Now that we have our delimiter out of the way,
        // let's check to see which kind of value we
        // captured (quoted or unquoted).
        if (arrMatches[ 2 ]){

            // We found a quoted value. When we capture
            // this value, unescape any double quotes.
            strMatchedValue = arrMatches[ 2 ].replace(
                new RegExp( '""', 'g' ),
                '"'
                );

        } else {

            // We found a non-quoted value.
            strMatchedValue = arrMatches[ 3 ];

        }


        // Now that we have our value string, let's add
        // it to the data array.
        arrData[ arrData.length - 1 ].push( strMatchedValue );
    }

    // Return the parsed data.
    return( arrData );
}

async upload() {
    const modal = await this.modalController.create({
    component: UploadModalComponent,
    });
    await modal.present();
    const docs: Import = (await modal.onDidDismiss()).data;
    switch (docs.type){
      case 'json':
        const files = [];
        const languages = [];
        for (const doc of docs.files) {
          files.push({default: JSON.parse(await doc.text())});
          const name = doc.name;
          const nameArray = name.split('.');
          nameArray.pop();
          const language = nameArray.join('.');
          languages.push(language);
        }
        this.global.importJsonFiles(files, languages);
        break;
      case 'csv':
        for (const doc of docs.files) {
          console.log(doc.text())
          console.log(this.CSVToArray(doc.text()));
        }
        break;
      }

  }

translate() {
    this.translator.translate();
  }

fileNameToISO(fileName: string) {
    const isoLanguages = ['aa', 'ab', 'ae', 'af', 'ak', 'am', 'an', 'ar', 'as', 'av', 'ay', 'az', 'ba', 'be', 'bg', 'bh', 'bi', 'bm', 'bn', 'bo', 'br', 'bs', 'ca', 'ce', 'ch', 'co', 'cr', 'cs', 'cu', 'cv', 'cy', 'da', 'de', 'dv', 'dz', 'ee', 'el', 'en', 'eo', 'es', 'et', 'eu', 'fa', 'ff', 'fi', 'fj', 'fo', 'fr', 'fy', 'ga', 'gd', 'gl', 'gn', 'gu', 'gv', 'ha', 'he', 'hi', 'ho', 'hr', 'ht', 'hu', 'hy', 'hz', 'ia', 'id', 'ie', 'ig', 'ii', 'ik', 'io', 'is', 'it', 'iu', 'ja', 'jv', 'ka', 'kg', 'ki', 'kj', 'kk', 'kl', 'km', 'kn', 'ko', 'kr', 'ks', 'ku', 'kv', 'kw', 'ky', 'la', 'lb', 'lg', 'li', 'ln', 'lo', 'lt', 'lu', 'lv', 'mg', 'mh', 'mi', 'mk', 'ml', 'mn', 'mo', 'mr', 'ms', 'mt', 'my', 'na', 'nb', 'nd', 'ne', 'ng', 'nl', 'nn', 'no', 'nr', 'nv', 'ny', 'oc', 'oj', 'om', 'or', 'os', 'pa', 'pi', 'pl', 'ps', 'pt', 'qu', 'rc', 'rm', 'rn', 'ro', 'ru', 'rw', 'sa', 'sc', 'sd', 'se', 'sg', 'sh', 'si', 'sk', 'sl', 'sm', 'sn', 'so', 'sq', 'sr', 'ss', 'st', 'su', 'sv', 'sw', 'ta', 'te', 'tg', 'th', 'ti', 'tk', 'tl', 'tn', 'to', 'tr', 'ts', 'tt', 'tw', 'ty', 'ug', 'uk', 'ur', 'uz', 've', 'vi', 'vo', 'wa', 'wo', 'xh', 'yi', 'yo', 'za', 'zh', 'zu'];
    for (const lang of isoLanguages) {
      if (fileName.includes(lang)) {
        return lang;
      }
    }
  }
}
