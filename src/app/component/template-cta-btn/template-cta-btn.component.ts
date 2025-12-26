import { Component, EventEmitter, Input, Output } from '@angular/core';

@Component({
  selector: 'app-template-cta-btn',
  templateUrl: './template-cta-btn.component.html',
  styleUrls: ['./template-cta-btn.component.scss']
})
export class TemplateCtaBtnComponent {

  @Input() index: any;
  @Output() deleteEvent = new EventEmitter();
  @Output() dataEvent = new EventEmitter();

  btnLabel: string = '';
  phoneLable: string = '';
  urlLabel: string = '';

  selectedValue:any = 'phone';

  ngOnChanges() {

  }

  emitChanges(event: any) {
    console.log(event);

    console.log(this.index);
    let btnData = this.index;
    btnData.value = this.btnLabel;
    if(this.selectedValue =='phone') {
      btnData.type = 'PHONE_NUMBER'
      btnData.text = this.phoneLable;
      btnData.url = '';
    }
    if(this.selectedValue =='url') {
      btnData.type = 'URL'
      btnData.text = this.urlLabel;
      btnData.phone_number = '';
    }
    console.log(btnData)
    this.dataEvent.emit(btnData)
  }

  deleteTriggered() {
    this.deleteEvent.emit(this.index);
  }

}
