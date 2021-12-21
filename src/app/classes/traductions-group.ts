import { Traduction } from "./traduction";
import { Structure } from "./structure";
import { Folder } from "./folder";

export class TraductionsGroup extends Structure {
  public tradList: Traduction[];

  public getTradList(): Traduction[] {
    return this.tradList;
  }

  public setTradList(tradList: Traduction[]): void {
    this.tradList = tradList;
  }

  public getTradByLanguage(language: string): Traduction {
    return this.tradList.find((t) => t.language === language);
  }

  public addTraduction(traduction: Traduction) {
    this.tradList.push(traduction);
  }

  public removeTraduction(traduction: Traduction) {
    this.tradList = this.tradList.filter((trad) => trad !== traduction);
  }

  public hasLanguage(language: string) {
    return this.getTradByLanguage(language) !== undefined;
  }

  public removeTradWrongLanguage(languages: string[]) {
    this.tradList = this.tradList.filter(
      (t) => languages.find((l) => l === t.language) !== undefined
    );
  }

  public swapTradLanguage(oldLanguage:string,newLanguage:string) {
    for (const k of this.tradList) {
      if (k.language==oldLanguage) {
        k.language=newLanguage;
      }
    }
  }

  public addMissingTrad(languages: string[]) {
    for (const l of languages) {
      if (!this.hasLanguage(l)) {
        this.addTraduction(new Traduction("", l));
      }
    }
  }

  public isValidated(): boolean {
    for (const k of this.tradList) {
      if (!k.isChecked()) {
        return false;
      }
    }
    if (this.tradList.length === 0) {
      return false;
    }
    return true;
  }

  public isFilled(): boolean {
    for (const k of this.tradList) {
      if (!k.isFilled()) {
        return false;
      }
    }
    if (this.tradList.length === 0) {
      return false;
    }
    return true;
  }

  public rateValidation(): number[] {
    let count = 0.0;
    for (const k of this.tradList) {
      if (k.isChecked()) {
        count += 1.0;
      }
    }
    return [count, this.tradList.length];
  }

  public rateFill(): number[] {
    let count = 0.0;
    for (const k of this.tradList) {
      if (k.isFilled()) {
        count += 1.0;
      }
    }
    return [count, this.tradList.length];
  }

  public setTrad(traduction: Traduction) {
    const language = traduction.getLanguage();
    for (let trad of this.tradList) {
      if (language === trad.getLanguage()) {
        trad = traduction;
        break;
      }
    }
  }

  public emptyTrad() {
    return this.tradList.length === 0;
  }

  public clone(): TraductionsGroup {
    var cloneObj = new TraductionsGroup(this.getName(), this.parentFolder, []);
    cloneObj.tradList = [];
    for (const k of this.tradList) {
      cloneObj.tradList.push(k.clone());
    }
    return cloneObj;
  }

  public hasFilter(filter:string):boolean{
    if (super.hasFilter(filter)){
      return true;
    }
    for (let trad of this.tradList) {
      if (trad.hasFilter(filter)) {
        return true;
      }
    }
    return false;
}

  constructor(name: string, parentFolder: Folder, tradList: Traduction[] = []) {
    super(name, parentFolder);
    this.tradList = tradList;
  }
}
