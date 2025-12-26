import { Component, Input, OnInit } from '@angular/core';
import { FormArray, FormGroup } from '@angular/forms';

@Component({
  selector: 'app-rich-card',
  templateUrl: './rich-card.component.html',
  styleUrls: ['./rich-card.component.scss']
})
export class RichCardComponent {

  @Input() templateForm!: FormGroup;
  @Input() selectedTemplate: any;
  @Input() fileUrl: string = '';
  @Input() imageHeight: number = 200;
  @Input() cardTitle: string = '';
  @Input() cardDescription: string = '';
  @Input() orientation: string ='';
  @Input() alignment:string = '';
  @Input() templateType: string = 'rich_card';

  get suggestionsFormArray(): FormArray {
    return this.templateForm.get('suggestions') as FormArray;
  }

  ngOnInit(): void {
    // Optional: log for debugging
    // console.log('Preview Loaded with template:', this.selectedTemplate);
  }

}
