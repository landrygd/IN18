import { Injectable } from '@angular/core';
import { ToastController, AlertController } from '@ionic/angular';
import { HttpClient } from '@angular/common/http';
import { GlobalService } from './global.service';

export interface GoogleObj {
  q: string[];
  target: string;
}

@Injectable({
  providedIn: 'root'
})

export class TranslatorService {

  toast: HTMLIonToastElement;

  url = 'https://translation.googleapis.com/language/translate/v2?key=';

  count = 0;
  untranslated: any;
  languages: string[];

  constructor(
    private toastController: ToastController,
    private http: HttpClient,
    private alertController: AlertController,
    private global: GlobalService
  ) {}

  async translate() {
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

  async error(message) {
    const alert = await this.alertController.create({
      header: 'Error',
      message,
      buttons: ['OK']
    });
    await alert.present();
  }
}
