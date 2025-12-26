import { Component, EventEmitter, Input, Output } from '@angular/core';

@Component({
  selector: 'app-template-quick-rply-btn',
  templateUrl: './template-quick-rply-btn.component.html',
  styleUrls: ['./template-quick-rply-btn.component.scss']
})
export class TemplateQuickRplyBtnComponent {

  @Input() index: any;
  @Output() deleteEvent = new EventEmitter();
  @Output() dataEvent = new EventEmitter();

  btnLabel: string = '';

  ngOnChanges() {
    console.log(this.btnLabel)
  }

  emitChanges(event: any) {
    let btnData = this.index;
    btnData.value = this.btnLabel;
    // console.log(this.index, this.btnLabel)
    this.dataEvent.emit(btnData)
  }

  deleteTriggered() {
    this.deleteEvent.emit(this.index);
  }
}
