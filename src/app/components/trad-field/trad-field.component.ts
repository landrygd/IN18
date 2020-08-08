import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { Traduction } from 'src/app/classes/traduction';

@Component({
  selector: 'app-trad-field',
  templateUrl: './trad-field.component.html',
  styleUrls: ['./trad-field.component.scss'],
})
export class TradFieldComponent implements OnInit {

  @Input() trad: Traduction;

  btnColor: string;
  btnFill: string;
  btnText: string;

  constructor() {

  }

  ngOnInit() {
    this.updateBtn();
  }

  confirm() {
    this.trad.checked = !this.trad.checked;
    this.updateBtn();
  }

  updateBtn() {
    if (!this.trad.checked) {
      this.btnColor = 'primary';
      this.btnFill = 'clear';
      this.btnText = 'Validate';
    } else {
      this.btnColor = 'success';
      this.btnFill = 'solid';
      this.btnText = 'Validated';
    }
  }

  onUpdate(value) {
    this.trad.value = value;
  }
}
