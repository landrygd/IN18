import { Traduction } from './traduction';

export class TraductionsGroup {
  private path: string;
  public tradList: Traduction[];

  public getPath(): string {
      return this.path;
  }

  public getName(): string {
    return this.path;
  }

  public setPath(path: string): void {
      this.path = path;
  }

  public getTradList(): Traduction[] {
      return this.tradList;
  }

  public setTradList(tradList: Traduction[]): void {
      this.tradList = tradList;
  }

  public addTraduction(traduction: Traduction){
    this.tradList.push(traduction);
  }

  constructor(path: string, tradList: Traduction[]) {
    this.path = path;
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
