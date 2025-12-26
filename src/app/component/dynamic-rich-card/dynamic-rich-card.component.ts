import { Component, Input, OnInit } from '@angular/core';
import { FormArray, FormGroup } from '@angular/forms';

@Component({
  selector: 'app-dynamic-rich-card',
  templateUrl: './dynamic-rich-card.component.html',
  styleUrls: ['./dynamic-rich-card.component.scss']
})
export class DynamicRichCardComponent  {
 
  @Input() templateForm!: FormGroup;
  @Input() fileUrl!: string;
  @Input() thumbnailUrl!: string;
  @Input() imageHeight = 200;
  @Input() isVideo = false;
  @Input() orientation: string= 'VERTICAL';
  @Input() alignment: string= 'LEFT';
  @Input() templateType = 'rich_card';

  get cardTitle(): string {
    return this.templateForm.get('cardTitle')?.value || '';
  }

  get carddescription(): string {
    return this.templateForm.get('cardDescription')?.value || '';
  }

  get suggestionsFormArray(): FormArray {
    return this.templateForm.get('suggestions') as FormArray;
  }

  showCardPreview(): boolean {
    const type = this.templateForm.get('type')?.value;
    return type !== 'TextMessage' && type !== 'TextMessagewithpdf' && type !== 'carousel';
  }

  getSuggestionAlignment(): string {
    if (this.orientation === 'HORIZONTAL') {
      return this.alignment === 'LEFT' ? 'flex-start' : 'flex-end';
    }
    return 'center';
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