import { Component, Output, EventEmitter, Input } from '@angular/core';
import { TEMPLATE_RESPONSE } from 'src/app/models/templateModel';

@Component({
  selector: 'app-simple-table',
  templateUrl: './simple-table.component.html',
  styleUrls: ['./simple-table.component.scss'],

})
export class SimpleTableComponent {

  constructor() { }

  @Input() listOfData: TEMPLATE_RESPONSE[] = [];
  @Output() deleteTriggred: EventEmitter<TEMPLATE_RESPONSE> = new EventEmitter<TEMPLATE_RESPONSE>();
  @Output() editTriggred: EventEmitter<TEMPLATE_RESPONSE> = new EventEmitter<TEMPLATE_RESPONSE>();


  listOfColumns = [
    {
      name: 'Name',
      compare: (a: TEMPLATE_RESPONSE, b: TEMPLATE_RESPONSE) => a.name.localeCompare(b.name),
      priority: 1
    },
    {
      name: 'Category',
      compare: (a: TEMPLATE_RESPONSE, b: TEMPLATE_RESPONSE) => a.category.localeCompare(b.category),
      priority: 3
    },
    {
      name: 'Preview',
      // compare: (a: TEMPLATE_RESPONSE, b: TEMPLATE_RESPONSE) => a.preview.localeCompare(b.preview),
      priority: false,
    },
    {
      name: 'Status',
      // compare: (a: TEMPLATE_RESPONSE, b: TEMPLATE_RESPONSE) => a.preview.localeCompare(b.preview),
      priority: false
    },
    {
      name: 'Languages',
      compare: (a: TEMPLATE_RESPONSE, b: TEMPLATE_RESPONSE) => a.language.localeCompare(b.language),
      priority: false
    },
    {
      name: 'Action',
      priority: false
    }
  ];

  deleteRow(item: TEMPLATE_RESPONSE): void {
    this.deleteTriggred.emit(item);
  }

  editRow(item: TEMPLATE_RESPONSE): void {
    this.editTriggred.emit(item);
  }

  copydata(item: TEMPLATE_RESPONSE) {
    // let copytext:any =this.listOfData.filter(d => d !==item);
    // console.log(copytext)
    // navigator.clipboard.writeText(copytext);

  }

}
