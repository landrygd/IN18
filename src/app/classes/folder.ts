import { TraductionsGroup } from './traductions-group';
import { Structure } from './structure';

export class Folder extends Structure {


    public tradGroupList: TraductionsGroup[];
    public folderList: Folder[];

    public addTraductionGroup(traductionGroup: TraductionsGroup) {
        this.tradGroupList.push(traductionGroup);
    }

    public addFolder(folder: Folder) {
        this.folderList.push(folder);
    }

    public findTraductionGroup(path: string) {
        return this.tradGroupList.find(element => element.getName() === path);
    }

    public findFolder(path: string) {
        return this.folderList.find(element => element.getName() === path);
    }

    constructor(name: string) {
        super(name);
        this.folderList = [];
        this.tradGroupList = [];
    }
}
