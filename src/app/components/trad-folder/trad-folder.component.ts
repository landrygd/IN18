import { Component, OnInit, Input } from '@angular/core';
import { Folder } from 'src/app/classes/folder';
import { GlobalService } from 'src/app/services/global.service';

@Component({
  selector: 'app-trad-folder',
  templateUrl: './trad-folder.component.html',
  styleUrls: ['./trad-folder.component.scss'],
})
export class TradFolderComponent implements OnInit {

  @Input() folder: Folder;

  constructor(private global: GlobalService) { }

  ngOnInit() {}

  select(){
    this.global.setSelectedStructure(this.folder);
  }

  onNameUpdate(value: string) {
    this.folder.setName(value);
  }

}
