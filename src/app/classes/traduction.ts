export class Traduction {
  private language: string;
  private value: string;
  private path: string;
  private checked: boolean;

  constructor(path: string, value: string, language: string, checked = false) {
    this.language = language;
    this.value = value;
    this.path = path;
    this.checked = checked;
  }

  // Getters
  getLanguage(): string {
    return this.language;
  }
  getValue(): string {
    return this.value;
  }
  getPath(): string {
    return this.path;
  }
  isChecked(): boolean {
    return this.checked;
  }
}
