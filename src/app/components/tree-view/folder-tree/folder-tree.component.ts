import { Component, OnInit, Input } from "@angular/core";
import { Folder } from "src/app/classes/folder";
import { Structure } from "src/app/classes/structure";
import { GlobalService } from "src/app/services/global.service";
import { TraductionsGroup } from "src/app/classes/traductions-group";
import { ModalController, PopoverController } from "@ionic/angular";
import { NewTradModalComponent } from "../new-trad-modal/new-trad-modal.component";
import { PopoverMenu } from "../menu-popover/template-popover.component";

@Component({
  selector: "app-folder-tree",
  templateUrl: "./folder-tree.component.html",
  styleUrls: ["./folder-tree.component.scss"],
})
export class FolderTreeComponent implements OnInit {
  @Input() folder: Structure;

  @Input() level: number;

  @Input() collapsed = true;

  hovered = false;

  constructor(
    private popoverCtrl: PopoverController,
    private modalController: ModalController,
    private global: GlobalService
  ) {}

  ngOnInit() {}

  click() {
    if (this.isFolder()) {
      this.toggleCollapse(true);
    } else {
      this.select();
    }
  }

  toggleCollapse(select = false) {
    if (this.isFolder()) {
      if (!this.global.OneChildIsSelected(this.folder as Folder) || select) {
        if (select) {
          this.select(this.folder);
        } else {
          this.collapsed = !this.collapsed;
        }
      }
    }
  }

  isExpanded(): boolean {
    if (this.isFolder()) {
      return (
        !this.collapsed ||
        this.level < 0 ||
        this.global.OneChildIsSelected(this.folder as Folder)
      );
    }
    return false;
  }

  select(structure: Structure = this.folder) {
    this.global.setSelectedStructure(
      this.global.selectedStructure === structure
        ? this.global.structure
        : structure
    );
  }

  chevronIcon() {
    return this.collapsed ? "chevron-forward" : "chevron-down";
  }

  folderIcon() {
    return this.isFolder()
      ? this.collapsed
        ? "folder"
        : "folder-open"
      : "document";
  }

  getBgColor(structure: Structure = this.folder): boolean {
    /*if (this.global.selectedFolder === structure ||
      (this.global.selectedFolder === this.folder && this.global.selectedStructure === this.folder
      && this.global.selectedFolder !== this.global.structure) ||
      (this.folder.parentFolder === this.global.selectedFolder && this.global.selectedFolder !== this.global.structure)){
      return true;
    }*/
    if (structure === this.global.selectedStructure) {
      return true;
    }
    return false;
  }

  getColor(structure: Structure = this.folder): string {
    if (structure.isValidated()) {
      return "success";
    } else if (structure.isFilled()) {
      return "primary";
    } else if (!this.collapsed || !this.isFolder()) {
      return "dark";
    }
    return "medium";
  }

  isFolder(): boolean {
    let f: any = this.folder;
    return f instanceof Folder;
  }

  async addTraduction(isFolder = false) {
    const modal = await this.modalController.create({
      component: NewTradModalComponent,
      componentProps: { parentFolder: this.folder, isFolder },
    });
    await modal.present();
  }

  async presentPopover(ev: any, f) {
    const popover = await this.popoverCtrl.create({
      component: PopoverMenu,
      componentProps: { item:f },
      cssClass: '',
      event: ev,
      translucent: true
    });
    await popover.present();
  }
}
