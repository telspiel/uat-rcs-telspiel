import { ChangeDetectorRef, Component, EventEmitter, Input, Output, SimpleChanges } from '@angular/core';
import { TemplateBuilderTypes } from 'src/app/enums/template-builder-types';
import { TEMPLATE_COMPONENT, TEMPLATE_RESPONSE } from 'src/app/models/templateModel';
import { EditorToHtmlPipe } from 'src/app/pipes/editor-to-html.pipe';

@Component({
  selector: 'app-preview',
  templateUrl: './preview.component.html',
  styleUrls: ['./preview.component.scss']
})

export class PreviewComponent {

  @Input() visibility: boolean = true;
  @Input() previewTemplate: TEMPLATE_RESPONSE | undefined;
  @Input() previewData: any;
  @Output() pushSubmit: EventEmitter<boolean> = new EventEmitter();
  @Output() previewIgnored: EventEmitter<boolean> = new EventEmitter();

  messageHeader: TEMPLATE_COMPONENT | undefined;
  messageBody: string = '';
  footer: string = '';
  footerBtns: TEMPLATE_COMPONENT | undefined;

  filterPipe = new EditorToHtmlPipe();


  @Input() body: any;
  @Input() newMessagePreviewTemplate: { template?: TEMPLATE_RESPONSE, data?: TEMPLATE_COMPONENT[] } = {};
  constructor(private cdr: ChangeDetectorRef) {
  }

  ngOnChanges() {
    console.log(this.previewTemplate)

    if (this.previewTemplate) {
      const body = this.previewTemplate?.components.find(item => item.type === 'BODY')?.text || '';
      this.messageBody = this.filterPipe.updateVarValue(body, this.previewData)
      this.messageHeader = this.previewTemplate.components.find(component => component.type === 'HEADER');
      this.footer = this.previewTemplate.components.find(component => component.type === 'FOOTER')?.text || '';
      // this.templateType = this.previewTemplate.builderType === 1 ? TemplateBuilderTypes.MEDIA : TemplateBuilderTypes.STANDARD;
      this.footerBtns = this.previewTemplate.components.find(component => component.type === 'BUTTONS');
    } else {

    }
  }

  open(): void {
    this.visibility = true;
  }

  close(): void {
    this.visibility = false;
    this.previewIgnored.emit(false)
  }

  submitPreview() {
    this.pushSubmit.emit(true)
  }
  
}
