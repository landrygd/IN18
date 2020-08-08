import { Component, OnInit, Input } from '@angular/core';
import { Structure } from 'src/app/classes/structure';
import { GlobalService } from 'src/app/services/global.service';

@Component({
  selector: 'app-breadcrumb',
  templateUrl: './breadcrumb.component.html',
  styleUrls: ['./breadcrumb.component.scss'],
})
export class BreadcrumbComponent implements OnInit {

  @Input() structure: Structure;

  constructor(private global: GlobalService) { }

  ngOnInit() { }

  changeStructure(structure) {
    this.global.setSelectedStructure(structure);
  }

}
