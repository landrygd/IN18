import { Structure } from './structure';

export class Traduction extends Structure {
    public language: string;
    public value: string;
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

    public isChecked(): boolean {
        return this.checked;
    }

    public setChecked(checked: boolean): void {
        this.checked = checked;
    }


    constructor(name: string, value: string, language: string, checked = false) {
        super(name);
        this.language = language;
        this.value = value;
        this.checked = checked;
    }
}
