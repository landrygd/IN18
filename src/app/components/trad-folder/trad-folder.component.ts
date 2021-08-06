import { Component, OnInit, Input } from "@angular/core";
import { Folder } from "src/app/classes/folder";
import { GlobalService } from "src/app/services/global.service";
import {
  AlertController,
  PopoverController,
} from "@ionic/angular";
import { PopoverMenu } from "../tree-view/menu-popover/template-popover.component";

@Component({
  selector: "app-trad-folder",
  templateUrl: "./trad-folder.component.html",
  styleUrls: ["./trad-folder.component.scss"],
})
export class TradFolderComponent implements OnInit {
  @Input() folder: Folder;
  @Input() canExpand = false;

  invisible = false;

  constructor(
    public popoverCtrl: PopoverController,
    private global: GlobalService,
    public alertController: AlertController
  ) {}

  ngOnInit() {}

  select() {
    this.global.setSelectedStructure(this.folder);
  }

  selectParent() {
    this.global.setSelectedStructure(this.folder.parentFolder);
  }

  async presentPopover(ev: any, f) {
    const popover = await this.popoverCtrl.create({
      component: PopoverMenu,
      componentProps: { item: f },
      cssClass: "",
      event: ev,
      translucent: true,
    });
    await popover.present();
  }
  onNameUpdate(value: string) {
    this.folder.setName(value);
    if (this.folder.isRoot()) {
      this.global.structure.setName(this.folder.getName());
    }
  }

  
}
