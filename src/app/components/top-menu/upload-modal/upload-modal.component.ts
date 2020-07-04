import { Component, OnInit } from '@angular/core';
import { ModalController } from '@ionic/angular';

@Component({
  selector: 'app-upload-modal',
  templateUrl: './upload-modal.component.html',
  styleUrls: ['./upload-modal.component.scss'],
})
export class UploadModalComponent implements OnInit {

  files: File[] = [];

  type = 'json';

  exampleJsonEn = `
  {"folder" :
        {"id_yes" : "yes"}
      }
  `;

  exampleJsonFr = `
  {"folder" :
        {"id_yes" : "oui"}
      }
  `;

  constructor(
    private modalController: ModalController
  ) { }

  ngOnInit() {}

  onSelect(event) {
    console.log(event);
    this.files.push(...event.addedFiles);
  }

  typeChanged(value){
    this.type = value;
  }

  onRemove(event) {
    console.log(event);
    this.files.splice(this.files.indexOf(event), 1);
  }

  cancel() {
    this.modalController.dismiss();
  }

  import() {
    this.modalController.dismiss(this.files);
  }
}
