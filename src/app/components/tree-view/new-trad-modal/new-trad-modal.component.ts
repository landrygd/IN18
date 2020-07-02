import { Component, OnInit, Input } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { TraductionsGroup } from 'src/app/classes/traductions-group';
import { Folder } from 'src/app/classes/folder';

@Component({
  selector: 'app-new-trad-modal',
  templateUrl: './new-trad-modal.component.html',
  styleUrls: ['./new-trad-modal.component.scss'],
})
export class NewTradModalComponent implements OnInit {

  tradGroup: TraductionsGroup;

  folder: Folder;

  folderName: String = "";

  fileName: String = "";


  constructor(
    private modalController: ModalController
  ) {
    
  }

  ngOnInit() {
    this.folderName = this.folder.getName(); 
    console.log(this.folderName);
    this.tradGroup =  new TraductionsGroup("",this.folder);
  }

  cancel() {
    this.modalController.dismiss();
  }

  onNameChange(value) {
    this.tradGroup.setName(value);
    this.fileName = value;
  }
  onFolderChange(value) {
    // this.traduction.setPath(value);
  }

  import() {
    let result = this.folder.addTraductionGroup(this.tradGroup);
    console.log(result);
    this.modalController.dismiss();
  }
}
