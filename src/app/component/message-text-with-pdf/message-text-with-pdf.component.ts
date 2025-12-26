
import { Component, Input } from '@angular/core';
import { FormArray, FormGroup } from '@angular/forms';

@Component({
  selector: 'app-message-text-with-pdf',
  templateUrl: './message-text-with-pdf.component.html',
  styleUrls: ['./message-text-with-pdf.component.scss']
})
export class MessageTextWithPdfComponent {
 
  @Input() messageOrder: 'textTop' | 'textBottom' = 'textBottom';
  @Input() uploadedFileName: string = '';
  @Input() messageBody: string = '';
  @Input() templateForm!: FormGroup;
  constructor() {}

  ngOnInit(): void {}

  get suggestionsFormArray(): FormArray {
    return this.templateForm?.get('suggestions') as FormArray;
  }

 

  getPdfFileName(): string {
    return this.uploadedFileName || this.templateForm.get('documentFileName')?.value || 'Document.pdf';
  }

  getmessageOrder() : string {
    return this.messageOrder || this.templateForm.get('messageOrder')?.value || 'textBottom';
  }
  getMessageBody(): string {
    return this.messageBody || this.templateForm.get('messageBody')?.value || 'Message content goes here.';
  }

  getSuggestionIcon(type: string): string {
    switch (type) {
      case 'view_location_query':
      case 'share_location':
      case 'view_location_latlong':
        return 'environment';
      case 'dialer_action':
        return 'phone';
      case 'url_action':
        return 'global';
      case 'calendar_event':
        return 'calendar';
      default:
        return '';
    }
  }
}
