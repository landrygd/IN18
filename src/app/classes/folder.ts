import { TraductionsGroup } from './traductions-group';
import { Structure } from './structure';

export class Folder extends Structure {


    public tradGroupList: TraductionsGroup[];
    public folderList: Folder[];

    public addTraductionGroup(traductionGroup: TraductionsGroup): boolean {
        if (this.tradGroupList.findIndex(e => e.getName() === traductionGroup.getName()) === -1) {
            this.tradGroupList.push(traductionGroup);
            return true;
        } else {
            return false;
        }

    }

    public addFolder(folder: Folder): boolean {
        if (this.folderList.findIndex(e => e.getName() === folder.getName()) === -1) {
            this.folderList.push(folder);
            return true;
        } else {
            return false;
        }

    }

    public findTraductionGroup(path: string) {
        return this.tradGroupList.find(element => element.getName() === path);
    }

    public findFolder(path: string) {
        return this.folderList.find(element => element.getName() === path);
    }

    constructor(name: string, parentFolder: Folder) {
        super(name, parentFolder);
        this.folderList = [];
        this.tradGroupList = [];
    }
}
