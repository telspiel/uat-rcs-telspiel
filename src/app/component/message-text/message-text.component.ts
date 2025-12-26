import { Component, Input, OnInit } from '@angular/core';
import { FormArray, FormGroup } from '@angular/forms';
@Component({
  selector: 'app-message-text',
  templateUrl: './message-text.component.html',
  styleUrls: ['./message-text.component.scss']
})
export class MessageTextComponent {
  @Input() selectedTemplate!: boolean;
  @Input() type!: string;
  @Input() templateForm!: FormGroup;
  @Input() messageContent: string = '';  // optional external binding
  @Input() messagecontent: string = '';  // optional fallback binding

  constructor() {}

  ngOnInit(): void {}

 
  get suggestionsFormArray(): FormArray {
    return this.templateForm.get('suggestions') as FormArray;
  }

  // showTextMessagePreview(): boolean {
  //   return this.selectedTemplate && this.type === 'TextMessage';
  // }

  getMessageContent(): string {
    return this.messageContent ||
           this.messagecontent ||
           this.templateForm.get('messagecontent')?.value ||
           '';
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
