import { Component, Input, OnInit } from '@angular/core';
import { GlobalService } from 'src/app/services/global.service';
import { ImportExportService } from 'src/app/services/import-export.service';
import { SettingsService } from 'src/app/services/settings.service';

@Component({
  selector: 'app-recent-file',
  templateUrl: './recent-file.component.html',
  styleUrls: ['./recent-file.component.scss'],
})
export class RecentFileComponent implements OnInit {

  @Input() path :string;

  @Input() project = true;

  hovered = false;

  constructor(private setting: SettingsService,public global: GlobalService,public importExport: ImportExportService) { }

  ngOnInit() {}

  remove(){
    if (this.project){
      this.setting.removeProjectPath(this.path);
    }else{
      this.setting.removeFilePath(this.path);
    }
  }

}
