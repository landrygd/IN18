import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'app-trad-field',
  templateUrl: './trad-field.component.html',
  styleUrls: ['./trad-field.component.scss'],
})
export class TradFieldComponent implements OnInit {

  @Input() language: string;
  @Input() value: string;
  @Input() path: string;

  @Output() update = new EventEmitter();

  checked: boolean;
  btnColor: string;
  btnFill: string;
  btnText: string;

  constructor() {
    this.checked = true;
    this.updateBtn();
    this.language = 'Français';
  }

  ngOnInit() {}

  confirm() {
    this.checked = !this.checked;
    this.updateBtn();
  }

  updateBtn() {
    if (this.checked) {
      this.btnColor = 'primary';
      this.btnFill = 'clear';
      this.btnText = 'Valider';
    } else {
      this.btnColor = 'success';
      this.btnFill = 'solid';
      this.btnText = 'Validé';
    }
  }

  onUpdate(event) {
    const res = {
      value: event.target.value,
      lang: this.language,
      path: this.path
    };
    this.update.emit(res);
  }
}
