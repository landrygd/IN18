import { Injectable } from '@angular/core';
import { ToastController, AlertController } from '@ionic/angular';
import { HttpClient } from '@angular/common/http';
import { GlobalService } from './global.service';
import { Traduction } from '../classes/traduction';
import { TraductionsGroup } from '../classes/traductions-group';
import { SettingsService } from './settings.service';

const translate = require("deepl");

export interface GoogleObj {
  q: string[];
  target: string;
}

export interface ResponseTradMyMemory {
  error?: ResponseTradMyMemory;
  responseData?: ResponseTradMyMemory;
  translatedText?: string;
  responseDetails?: string;
}

export interface ResponseTradDeepl {
  translations?: TranslationDeepl[]
}

export interface TranslationDeepl {
  text: String
  detected_source_language?: String
}

@Injectable({
  providedIn: 'root'
})

export class TranslatorService {

  // toast: HTMLIonToastElement;

  // url = 'https://translation.googleapis.com/language/translate/v2?key=';

  apiMyMemory = 'https://api.mymemory.translated.net/get';

  

  // count = 0;
  // untranslated: any;
  translators: string[] = ["Deepl","MyMemory"];
  translator : string = "Deepl";
  languages: string[] = [];
  mainLanguage: string;
  unfilled = true;
  unverified = false;
  translating = false;

  traductionsTargeted: Traduction[][];

  constructor(
    private toastController: ToastController,
    private http: HttpClient,
    private alertController: AlertController,
    private global: GlobalService,
    private settings: SettingsService
  ) { }

  prepareTranslation(structure = this.global.structure) {
    if (structure === this.global.structure) {
      this.traductionsTargeted = [];
    }
    for (const folder of structure.folderList) {
      this.prepareTranslation(folder);
    }
    for (const tradGroup of structure.tradGroupList) {
      const mainTrad = tradGroup.getTradByLanguage(this.mainLanguage);
      for (const trad of tradGroup.tradList) {
        if (mainTrad !== undefined && mainTrad.isFilled() && mainTrad !== trad) {
          if ((!trad.isFilled() && this.unfilled) || (!trad.checked && this.unverified)) {
            if (this.languages.findIndex(k => k === trad.language) !== -1) {
              this.traductionsTargeted.push([mainTrad, trad]);
            }
          }
        }
      }
    }
  }

  getTrad(): number {
    let count = 0;
    this.prepareTranslation();
    for (const trad of this.traductionsTargeted) {
      count += 1;
    }
    return count;
  }

  getMain(t:Traduction,structure):Traduction {
    if (structure ===undefined){
      structure = this.global.structure
    }
    if (structure instanceof TraductionsGroup){
      const mainTrad = structure.getTradByLanguage(this.global.mainLanguage);
      for (const trad of structure.tradList) {
        if (mainTrad !== undefined && mainTrad.isFilled() && mainTrad !== trad && t==trad) {
          if (!trad.checked) {
            return mainTrad;
          }
        }
      }
    }else{
      for (const folder of structure.folderList) {
        var tmp = this.getMain(t,folder);
        if (tmp !== undefined){
          return tmp;
        }
      }
      for (const tradGroup of structure.tradGroupList) {
        var tmp = this.getMain(t,tradGroup);
        if (tmp !== undefined){
          return tmp;
        }
      }
    }
    
  }

  async translateFromMain(trad:Traduction,parent:TraductionsGroup){
    let mainTrad = this.getMain(trad,parent);
    if (mainTrad !== undefined){
      this.applyTranslation(mainTrad,trad);
    }
    
  }

  async translate() {
    this.prepareTranslation();
    for (const trad of this.traductionsTargeted) {
      this.applyTranslation(trad[0],trad[1]);
    }

  }

  async applyTranslation(fromTrad,toTrad){
    let error = false;
    this.translating = true;
    if (this.translator == "MyMemory"){
      this.http.get(this.apiMyMemory + '?q=' + fromTrad.value + '&langpair=' + fromTrad.language + '|' + toTrad.language).subscribe(
        res => {
          const r = res as ResponseTradMyMemory;
          if (r.responseDetails === '') {
            toTrad.value = r.responseData.translatedText;
          } else if (!error) {
            error = true;
            this.error(r.responseDetails);
          }
          this.translating = false;
        }, err => {
          if (!error) {
            error = true;
            const r = err as ResponseTradMyMemory;
            this.error(r.error.responseDetails);
          }
          this.translating = false;
        }
      );
      }else if (this.translator == "Deepl"){
        if (this.settings.deeplAPIKey == ""){
          error = true;
          this.error("Please fill Deepl API key in settings. Get it here https://www.deepl.com/fr/pro-account/summary");
        }else{
          translate({
            free_api: true,
            text: fromTrad.value,
            source_lang: fromTrad.language,
            target_lang: toTrad.language,
            auth_key: this.settings.deeplAPIKey,
          })
          .then(res => {
            const r = res.data as ResponseTradDeepl;
            if (r.translations.length>0) {
              toTrad.value = r.translations[0].text;
            } else if (!error) {
              error = true;
              this.error(r);
            
            }
            this.translating = false;
            })
          .catch(err => {
            if (!error) {
              error = true;
              this.error(err);
            }
            this.translating = false;
          });
        }
        
      }
  }

  /*async translate() {
    this.getUntranslated();
    const alert = await this.alertController.create({
      message: 'You are going to translate ' + this.count + ' caracters in ' + this.languages.length + ' languages',
      inputs: [
        {
          name: 'key',
          type: 'text',
          placeholder: 'Google translate API key'
        },
      ],
      buttons: [
        {
          text: 'Cancel',
          role: 'cancel',
          cssClass: 'secondary',
        }, {
          text: 'Confirm',
          handler: (data) => {
            this.googleTranslate(data.key);
          }
        }
      ]
    });
    await alert.present();
  }

  getUntranslated() {
    const paths = this.global.paths;
    const res: any = {};
    this.languages = this.global.languages;
    let count = 0;
    for (const lang of this.languages) {
      res[lang] = {sentences: [], paths: []};
    }
    for (const path of paths) {
      const obj = this.global.getJSON(path);
      let sentence: string;
      const languages = this.global.languages.slice();
      for (const key of Object.keys(obj)) {
        if (typeof obj[key] !== 'object') {
          sentence = obj[key];
          const index = languages.indexOf(key);
          if (index > -1) {
            languages.splice(index, 1);
          }
        }
      }
      if (languages.length < this.global.languages.length) {
        for (const lang of languages) {
          res[lang].sentences.push(sentence);
          res[lang].paths.push(path);
          count += sentence.length;
        }
      }
    }
    for (const lang of this.languages) {
      if (res[lang].sentences.length <= 0) {
        delete res[lang];
      }
    }
    this.count = count;
    this.untranslated = res;
  }

  async googleTranslate(key: string) {
    this.toast = await this.toastController.create({});
    this.toast.present();
    console.log(this.untranslated);
    this.http.post(this.url + key, {q: [''], target: 'en'}).toPromise().then(async () => {
      for (const lang of this.languages) {
        if (this.untranslated[lang]) {
          this.toast.message = 'translate... ' + lang;
          const queries: string[][] = [];
          const sentences = this.untranslated[lang].sentences;
          const paths = this.untranslated[lang].paths;
          const translated: string[] = [];
          let counter = 0;
          let query = [];
          for (const s of sentences) {
            query.push(s);
            counter ++;
            if (counter >= 100) {
              queries.push(query);
              query = [];
              counter = 0;
            }
          }
          if (query.length !== 0) {
            queries.push(query);
          }
          for (const q of queries) {
            const googleObj: GoogleObj = {
              q,
              target: lang
            };
            const translatedArr: any = await this.http.post(this.url + key, googleObj).toPromise();
            const translatedArray: {translatedText: string}[] = translatedArr.data.translations;
            for (const t of translatedArray) {
              translated.push(t.translatedText.replace('&#39', '\''));
            }
          }
          console.log({paths, translated});
          for (let i = 0; i < translated.length; i++) {
            this.global.setPath(paths[i] + '.' + lang, translated[i]);
          }
          console.log(this.global.structure);
        }
      }
      this.toast.message = 'Done!';
      setTimeout(() => this.toast.dismiss(), 2000);
    }).catch((e) => {
      this.toast.dismiss();
      this.error('Invalid API key');
      return;
    });
  }
  */
  async error(message) {
    const alert = await this.alertController.create({
      header: 'Error',
      message,
      buttons: ['OK']
    });
    await alert.present();
  }
}
