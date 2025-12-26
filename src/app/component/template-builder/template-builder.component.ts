import { Component, Input, OnInit, SimpleChanges } from '@angular/core';
import { Observable, Subscription } from 'rxjs';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { TemplateBuilderTypes } from 'src/app/enums/template-builder-types';
import { TEMPLATE_COMPONENT, TEMPLATE_RESPONSE } from 'src/app/models/templateModel';
import { TemplateService } from 'src/app/service/template-service.service';

@Component({
  selector: 'app-template-builder',
  templateUrl: './template-builder.component.html',
  styleUrls: ['./template-builder.component.scss']
})

export class TemplateBuilderComponent implements OnInit {
  validateForm: FormGroup;
  private nextBtnSubscription!: Subscription;
  @Input() previewBtnClicked!: Observable<void>;
  @Input() templateData!: TEMPLATE_RESPONSE | null;

  AllBuilderType = TemplateBuilderTypes; 
  builderType: TemplateBuilderTypes = TemplateBuilderTypes.MEDIA;

  messageBody: TEMPLATE_COMPONENT[] = [];
  templateEditorData!: TEMPLATE_RESPONSE;
  editTemplateComp: TEMPLATE_COMPONENT[] = [];

  defaultSection = [
    { label: 'Header', value: 'HEADER', isChecked: true, isCheckable: true },
    { label: 'Body', value: 'BODY', isChecked: true, isCheckable: false },
    { label: 'Footer', value: 'FOOTER', isChecked: true, isCheckable: true },
    { label: 'Buttons', value: 'BUTTONS', isChecked: true, isCheckable: true },
  ];

  options = [
    { label: 'Media & Interactive', value: TemplateBuilderTypes.MEDIA },
    { label: 'Standard (text only)', value: TemplateBuilderTypes.STANDARD },
  ];

  categoryOptions = [
    { label: 'Transactional', value: 'UTILITY' },
    { label: 'Marketing', value: "MARKETING" },
    { label: 'One Time Password', value: 'AUTHENTICATION' },
  ];


  constructor(private fb: FormBuilder, private templateService: TemplateService) {
    this.validateForm = this.fb.group({
      name: ['', [Validators.required]],
      category: ['UTILITY', [Validators.required]],
      builderType: [TemplateBuilderTypes.STANDARD, [Validators.required]]
    })
  }

  ngOnInit() {
    this.nextBtnSubscription = this.previewBtnClicked.subscribe(() => this.pushDataToPreview());
  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes['templateData']) {
      const editedData: TEMPLATE_RESPONSE = changes['templateData'].currentValue;
      console.log(editedData)
      if (!editedData) {
        return;
      }

      this.builderType = editedData.components.length > 1 ? TemplateBuilderTypes.MEDIA : TemplateBuilderTypes.STANDARD
      this.validateForm.patchValue({
        name: editedData.name,
        category: editedData.category,
        builderType: this.builderType
      })

      const editorComponents = editedData.components.map(item => item.type);
      this.defaultSection.map(item => {
        item.isChecked = false;
        if (editorComponents.includes(item.value)) {
          item.isChecked = true;
        }
      });

      this.editTemplateComp = editedData.components;
      this.messageBody = editedData.components;
      this.pushDataToPreview();
    }
  }
  get editorTemplateHeader() {
    const header = this.editTemplateComp && this.editTemplateComp.find(item => item.type === 'HEADER')
    return header;
  }

  get editorTemplateBody() {
    const body = this.editTemplateComp && this.editTemplateComp.find(item => item.type === 'BODY')
    return body;
  }

  get editorTemplateFooter() {
    const footer = this.editTemplateComp && this.editTemplateComp.find(item => item.type === 'FOOTER')
    return footer;
  }

  pushDataToPreview() {
    if (this.validateForm.valid) {
      this.templateEditorData = { ...this.validateForm.value }
      this.templateEditorData.components = this.messageBody;
      //Emit Data to EventEmitter (Service)
      console.log(this.templateEditorData)
      this.templateService.templateEditorData.emit(this.templateEditorData);
    } else {
      Object.values(this.validateForm.controls).forEach(control => {
        if (control.invalid) {
          control.markAsDirty();
          control.updateValueAndValidity({ onlySelf: true });
        }
      });
    }
  }

  pushData(key: string, value: TEMPLATE_COMPONENT) {
    let index = this.messageBody.findIndex((component: TEMPLATE_COMPONENT) => component.type === key);
    if (index === -1) {
      this.messageBody.push(value);
    } else {
      this.messageBody[index] = value;
    }
    console.log(this.messageBody)
  }

  checkChange(e: boolean, section: any): void {
    this.messageBody = this.messageBody.filter(item => item.type !== section.value)
    this.defaultSection[this.defaultSection.findIndex(el => el === section)].isChecked = e;
  }

  checkIsChecked(type: string) {
    return this.defaultSection.find(item => item.label === type)?.isChecked && this.builderType === TemplateBuilderTypes.MEDIA
  }

  ngOnDestroy() {
    this.nextBtnSubscription.unsubscribe();
  }
}
