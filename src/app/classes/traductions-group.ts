import { Traduction } from './traduction';
import { Structure } from './structure';
import { Folder } from './folder';

export class TraductionsGroup extends Structure {
  public tradList: Traduction[];

  private parentFolder: Folder;

  public getTradList(): Traduction[] {
      return this.tradList;
  }

  public setTradList(tradList: Traduction[]): void {
      this.tradList = tradList;
  }

  public addTraduction(traduction: Traduction){
    this.tradList.push(traduction);
  }

  constructor(name: string, parentFolder: Folder, tradList: Traduction[]=[]) {
    super(name);
    this.parentFolder = parentFolder;
    this.tradList = tradList;
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
}
