import { Folder } from './folder';

export class Structure {
    public parentFolder: Folder;
    private name: string;

    public getName(): string {
        return this.name;
    }

    public setName(name: string) {
        this.name = name;
    }

    public isValidated(): boolean{
        return true;
    }

    constructor(name: string, parentFolder: Folder) {
        this.name = name;
        this.parentFolder = parentFolder;
    }
}
