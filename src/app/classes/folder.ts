import { TraductionsGroup } from './traductions-group';

export class Folder {

    private path: string;

    public tradGroupList: TraductionsGroup[];
    public folderList: Folder[];

    public getPath(): string {
        return this.path;
    }


    public addTraductionGroup(traductionGroup: TraductionsGroup){
        this.tradGroupList.push(traductionGroup);
    }

    public addFolder(folder: Folder){
        this.folderList.push(folder);
    }

    public findTraductionGroup(path: string){
        return this.tradGroupList.find(element => element.getPath() === path);
    }

    public findFolder(path: string){
        return this.folderList.find(element => element.getPath() === path);
    }

    constructor(path: string) {
        this.path = path;
        this.folderList = [];
        this.tradGroupList = [];
      }
}
