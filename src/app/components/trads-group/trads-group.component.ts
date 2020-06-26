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

  @Input() path: string;
  @Input() trads: any;

  tradGroup: TraductionsGroup = new TraductionsGroup(this.path, []);

  constructor(private global: GlobalService) { }

  ngOnInit() {
    const tradList = this.tradGroup.tradList;
    Object.keys(this.trads).forEach((key) => {
      if (typeof this.trads[key] !== 'object') {
        this.tradGroup.addTraduction(
          new Traduction(this.path, this.trads[key], key)
        );
      }
    });
  }

  onUpdate(event: Traduction) {
    this.global.updatePath(event);
  }

}
