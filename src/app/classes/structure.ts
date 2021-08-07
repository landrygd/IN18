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

    public isValidated(): boolean {
        return true;
    }

    public isFilled(): boolean {
        return true;
    }

    public hasParent(): boolean {
        return this.parentFolder !== undefined;
    }

    public rateValidation(): number[] {
        return [0.0, 0.0];
    }

    public rateFill(): number[] {
        return [0.0, 0.0];
    }

    public percentValidation(): number {
        const count = this.rateValidation();
        if (count[1] === 0) {
            return 0.0;
        }
        return count[0] / count[1];
    }

    public percentFill(): number {
        const count = this.rateFill();
        if (count[1] === 0) {
            return 0.0;
        }
        return count[0] / count[1];
    }

    public isRoot(): boolean {
        return false;
    }

    public hasFilter(filter:string):boolean{
        return this.getName().toLowerCase().includes(filter.toLowerCase());
    }

    public clone(): Structure {
        var cloneObj = new Structure(this.name,this.parentFolder);
        return cloneObj;
    }

    constructor(name: string, parentFolder: Folder) {
        this.name = name;
        this.parentFolder = parentFolder;
    }
}
