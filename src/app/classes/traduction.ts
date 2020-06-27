export class Traduction {
    public language: string;
    public value: string;
    public path: string;
    public checked: boolean;

    public getLanguage(): string {
        return this.language;
    }

    public setLanguage(language: string): void {
        this.language = language;
    }

    public getValue(): string {
        return this.value;
    }

    public setValue(value: string): void {
        this.value = value;
    }

    public getPath(): string {
        return this.path;
    }

    public getPathWithLanguage(): string {
        return this.path + '.' + this.language;
    }

    public setPath(path: string): void {
        this.path = path;
    }

    public isChecked(): boolean {
        return this.checked;
    }

    public setChecked(checked: boolean): void {
        this.checked = checked;
    }


  constructor(path: string, value: string, language: string, checked = false) {
    this.language = language;
    this.value = value;
    this.path = path;
    this.checked = checked;
  }
}
