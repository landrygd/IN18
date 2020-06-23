import { Traduction } from './traduction';

export class TraductionsGroup {
  private path: string;
  private tradList: Traduction[];

  public getPath(): string {
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

  constructor(path: string, value: string, language: string) {
    const firstTrad = new Traduction(path, value, language);
    this.path = path;
    this.tradList = [firstTrad];
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
