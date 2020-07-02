import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { GlobalService } from 'src/app/services/global.service';
import { Traduction } from 'src/app/classes/traduction';
import { TraductionsGroup } from 'src/app/classes/traductions-group';

@Component({
  selector: 'app-trads-group',
  templateUrl: './trads-group.component.html',
  styleUrls: ['./trads-group.component.scss'],
})
export class TradsGroupComponent implements OnInit {

  @Input() tradGroup: TraductionsGroup;

  constructor(private global: GlobalService) { }

  ngOnInit() {
  }

  onNameUpdate(value: string) {
    this.tradGroup.setName(value);
  }

}
