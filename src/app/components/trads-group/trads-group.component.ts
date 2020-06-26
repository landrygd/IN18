import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'app-trads-group',
  templateUrl: './trads-group.component.html',
  styleUrls: ['./trads-group.component.scss'],
})
export class TradsGroupComponent implements OnInit {

  @Input() path: string;
  @Input() trads: any;
  @Output() update = new EventEmitter();

  tradList: any[];

  constructor() { }

  ngOnInit() {
    this.tradList = [];
    Object.keys(this.trads).forEach((key) => {
      if (typeof this.trads[key] !== 'object') {
        this.tradList.push(
          {
            language: key,
            value: this.trads[key],
            path: this.path + '.' + key
          }
        );
      }
    });
  }

  onUpdate(event) {
    this.update.emit(event);
  }

}
