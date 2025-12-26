import { Component, EventEmitter, Input, Output } from '@angular/core';
import { FormGroup } from '@angular/forms';

@Component({
  selector: 'app-template-preview',
  templateUrl: './template-preview.component.html',
  styleUrls: ['./template-preview.component.scss']
})
export class TemplatePreviewComponent {
  @Input() selectedBot: any;
  @Input() selectedBotId12: any;
  @Input() imageUrl!: string;
  @Input() validateForm!: FormGroup;
  carouselRef!: any;

  @Input() templateForm!: FormGroup;
  @Input() previewData: any;
  @Input() selectedTemplate: any;
  @Input() messageContent!: string;
  @Input() carouselList: any[] = [];
  @Input() alignment:string = '';
  @Input() orientation: string = '';
  @Input() messageBody: string = '';
  @Input() uploadedFileName: string = '';
  @Input() uploadedFileSize: string = '';
  @Input() messageOrder: string = 'textBottom';
  @Input() type: string ='rich_card';

  @Output() carouselRefChange = new EventEmitter<any>();

  handleCarouselRef($event: any): void {
    this.carouselRef = $event;
    this.carouselRefChange.emit(this.carouselRef);
  }

 
  
}
