import { TraductionsGroup } from './traductions-group';
import { Structure } from './structure';

export class Folder extends Structure {


    public tradGroupList: TraductionsGroup[];
    public folderList: Folder[];

    public addTraductionGroup(traductionGroup: TraductionsGroup): boolean {
        if (!this.hasTraductionGroup(traductionGroup.getName())) {
            this.tradGroupList.push(traductionGroup);
            traductionGroup.parentFolder=this;
            return true;
        } else {
            return false;
        }

    }


    public addFolder(folder: Folder): boolean {
        if (this.folderList.findIndex(e => e.getName() === folder.getName()) === -1) {
            this.folderList.push(folder);
            folder.parentFolder=this;
            return true;
        } else {
            return false;
        }

    }

    public add(item:Structure):boolean{
        if (item instanceof Folder){
            return this.addFolder(item);
        }else if (item instanceof TraductionsGroup){
            return this.addTraductionGroup(item);
        }
        return false;
    }

    public removeFolder(folder: Folder): boolean {
        const l = this.folderList.length;
        this.folderList = this.folderList.filter(e => e !== folder);
        return l > this.folderList.length;
    }

    public removeTradGroup(TradGroup: TraductionsGroup): boolean {
        const l = this.tradGroupList.length;
        this.tradGroupList = this.tradGroupList.filter(e => e !== TradGroup);
        return l > this.tradGroupList.length;
    }

    public remove(item:Structure):boolean{
        if (item instanceof Folder){
            return this.removeFolder(item);
        }else if (item instanceof TraductionsGroup){
            return this.removeTradGroup(item);
        }
        return false;
    }

    public findTraductionGroup(path: string): TraductionsGroup {
        return this.tradGroupList.find(element => element.getName() === path);
    }

    public hasTraductionGroup(path: string): boolean {
        return this.findTraductionGroup(path) !== undefined;
    }

    public findFolder(path: string) {
        return this.folderList.find(element => element.getName() === path);
    }

    public has(e:Structure):boolean{
        if (this.tradGroupList.find(element => element === e)){
            return true;
        }
        if (this.folderList.find(element => element === e)){
            return true;
        }
        return e === this;
    }

    public isValidated(): boolean {
        for (const k of this.tradGroupList) {
            if (!k.isValidated()) {
                return false;
            }
        }
        for (const k of this.folderList) {
            if (!k.isValidated()) {
                return false;
            }
        }
        if (this.folderList.length === 0 && this.tradGroupList.length === 0) {
            return false;
        }
        return true;
    }

    public isFilled(): boolean {
        for (const k of this.tradGroupList) {
            if (!k.isFilled()) {
                return false;
            }
        }
        for (const k of this.folderList) {
            if (!k.isFilled()) {
                return false;
            }
        }
        if (this.folderList.length === 0 && this.tradGroupList.length === 0) {
            return false;
        }
        return true;
    }

    public isEmpty(): boolean{
        return this.tradGroupList.length==0 && this.folderList.length==0;
    }

    public rateValidation(): number[] {
        const count = [0.0, 0.0];
        for (const k of this.tradGroupList) {
            const tmp = k.rateValidation();
            count[0] += tmp[0];
            count[1] += tmp[1];
        }
        for (const k of this.folderList) {
            const tmp = k.rateValidation();
            count[0] += tmp[0];
            count[1] += tmp[1];
        }
        return count;
    }

    public rateFill(): number[] {
        const count = [0.0, 0.0];
        for (const k of this.tradGroupList) {
            const tmp = k.rateFill();
            count[0] += tmp[0];
            count[1] += tmp[1];
        }
        for (const k of this.folderList) {
            const tmp = k.rateFill();
            count[0] += tmp[0];
            count[1] += tmp[1];
        }
        return count;
    }

    public isRoot(): boolean {
        return this.parentFolder === undefined;
    }

    public hasFilter(filter:string):boolean{
        for (const k of this.tradGroupList) {
            if (k.hasFilter(filter)) {
                return true;
            }
        }
        for (const k of this.folderList) {
            if (k.hasFilter(filter)) {
                return true;
            }
        }
        return super.hasFilter(filter) 
    }

    public clone(): Folder {
        var cloneObj = new Folder(this.getName(),this.parentFolder);
        cloneObj.folderList = [];
        for (const k of this.folderList) {
            cloneObj.folderList.push(k.clone());
        }
        cloneObj.tradGroupList = [];
        for (const k of this.tradGroupList) {
            cloneObj.tradGroupList.push(k.clone());
        }
        return cloneObj;
    }

    constructor(name: string, parentFolder: Folder) {
        super(name, parentFolder);
        this.folderList = [];
        this.tradGroupList = [];
    }


}
