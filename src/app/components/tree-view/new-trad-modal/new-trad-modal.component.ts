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

  newFolder: Folder;

  parentFolder: Folder;

  parentFolderName = '';

  fileName = '';

  isFolder = false;


  constructor(
    private modalController: ModalController
  ) {

  }

  ngOnInit() {
    this.parentFolderName = this.parentFolder.getName();
    this.tradGroup = new TraductionsGroup('', this.parentFolder);
    this.newFolder = new Folder('', this.parentFolder);
  }

  cancel() {
    this.modalController.dismiss();
  }

  onNameChange(value) {
    this.tradGroup.setName(value);
    this.newFolder.setName(value);
    this.fileName = value;
  }
  onFolderChange(value) {
    // this.traduction.setPath(value);
  }

  onIsFolderChange(value) {
    this.isFolder = value;
  }

  import() {
    let result = false;
    if (this.isFolder) {
      result = this.parentFolder.addFolder(this.newFolder);
    } else {
      result = this.parentFolder.addTraductionGroup(this.tradGroup);
    }

    console.log(result);
    this.modalController.dismiss();
  }
}
