import { Component, EventEmitter, Input, Output } from '@angular/core';
import { FormArray, FormBuilder, FormGroup } from '@angular/forms';
import { TEMPLATE_COMPONENT, TEMPLATE_RESPONSE } from 'src/app/models/templateModel';
import { EditorToHtmlPipe } from 'src/app/pipes/editor-to-html.pipe';
import { TemplateMessageService } from 'src/app/service/template-message.service';

@Component({
  selector: 'app-template-preview-custom',
  templateUrl: './template-preview-custom.component.html',
  styleUrls: ['./template-preview-custom.component.scss']
})
export class TemplatePreviewCustomComponent {

  @Input() previewInput: TEMPLATE_RESPONSE | undefined;
  @Output() body = new EventEmitter();

  messageHeader: TEMPLATE_COMPONENT | undefined;
  messageBody: any = '';
  footer: any;
  footerBtns: TEMPLATE_COMPONENT | undefined;

  filterPipe = new EditorToHtmlPipe();
  totalVarCount: any = [];
  variableInputForm: FormGroup;
  formDynamicValues: any;


  constructor(private fb: FormBuilder,
    private templateMessageService: TemplateMessageService) {
    this.variableInputForm = this.fb.group({
      headerURL: [''],
      variables: this.fb.array([]),
    });
    this.onChanges();
  }

  ngOnChanges() {

    console.log(this.previewInput)
    console.log("ngOnChanges : ",this.previewInput)

    if (this.previewInput) {
      this.setPreviewComponentData(this.previewInput)

      // Reset
      this.variableInputForm.patchValue({
        variables: [],
      });
      // this.removeAllValiable()

    }else{

      this.previewInput = undefined;
      this.messageBody = ''
      this.messageHeader = undefined;
      this.footer = '';
      this.footerBtns = undefined;

      this.removeAllValiable();
    }
  }

  // Listen to variable value update
  onChanges(): void {
    this.variableInputForm.valueChanges.subscribe(val => {
      this.formDynamicValues = val;
      // console.log(val)
      this.templateMessageService.setTemplateData(val);
    })
  }

  setPreviewComponentData(previewInput: TEMPLATE_RESPONSE) {
    if (previewInput) {
      this.messageBody = previewInput.components.find(component => component.type === 'BODY')?.text;
      this.messageHeader = previewInput.components.find(component => component.type === 'HEADER');
      this.footer = previewInput.components.find(component => component.type === 'FOOTER')?.text;
      this.footerBtns = previewInput.components.find(component => component.type === 'BUTTONS');

      this.removeAllValiable();

      console.log(this.variableInputForm.value)

      const self = this;
      this.totalVarCount = this.filterPipe.transform(this.messageBody, 'varOccurences');
      this.totalVarCount.forEach(function (value: string) {
        self.addVariable(value);
      });

      // Push data to service
      this.templateMessageService.setTemplate(previewInput);
    }
  }


  // Below this form array concepts
  get variables(): FormArray {
    return this.variableInputForm.get("variables") as FormArray
  }

  newVariable(objValue: string): FormGroup {
    return this.fb.group({
      object: objValue,
      value: '',
    })
  }

  addVariable(objValue: string) {
    this.variables.push(this.newVariable(objValue));
  }

  removeAllValiable() {
    this.variables.clear()
  }

}
