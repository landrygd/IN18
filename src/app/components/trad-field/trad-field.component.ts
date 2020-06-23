import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-trad-field',
  templateUrl: './trad-field.component.html',
  styleUrls: ['./trad-field.component.scss'],
})
export class TradFieldComponent implements OnInit {

  checked: boolean;
  btnColor: string;
  btnFill: string;
  btnText: string;
  language: string;

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
}
