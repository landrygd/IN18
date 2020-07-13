import { Component, OnInit, Input } from '@angular/core';
import { Folder } from 'src/app/classes/folder';
import { GlobalService } from 'src/app/services/global.service';
import { AlertController, ModalController } from '@ionic/angular';
import { NewTradModalComponent } from '../tree-view/new-trad-modal/new-trad-modal.component';

@Component({
  selector: 'app-trad-folder',
  templateUrl: './trad-folder.component.html',
  styleUrls: ['./trad-folder.component.scss'],
})
export class TradFolderComponent implements OnInit {

  @Input() folder: Folder;
  @Input() canExpand = false;

  invisible = false;

  constructor(private modalController: ModalController, private global: GlobalService, public alertController: AlertController) { }

  ngOnInit() {}

  select(){
    this.global.setSelectedStructure(this.folder);
  }

  selectParent(){
    this.global.setSelectedStructure(this.folder.parentFolder);
  }

  delete(){
    if (this.folder.parentFolder.removeFolder(this.folder)){
      this.global.setSelectedStructure();
    }
  }

  async presentDeleteConfirm() {
    const alert = await this.alertController.create({
      cssClass: '',
      header: 'Attention',
      subHeader: '',
      message: 'Are you sure to delete this folder? All the items inside it will also be deleted',
      buttons: [{
        text: 'No',
        role: 'cancel',
        cssClass: 'danger',
        handler: (blah) => {
          console.log('Confirm Cancel: blah');
        }
      }, {
        text: 'Yes',
        cssClass: 'primary',
        handler: () => {
          this.delete();
        }
      }]
    });

    await alert.present();
  }

  onNameUpdate(value: string) {
    this.folder.setName(value);
    if (this.folder.isRoot()){
      this.global.projectName = this.folder.getName();
    }
  }

  async addTraduction(isFolder = false) {
    const modal = await this.modalController.create({
      component: NewTradModalComponent,
      componentProps: {parentFolder: this.folder, isFolder}
    });
    await modal.present();
  }

}
