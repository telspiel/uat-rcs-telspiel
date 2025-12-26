import { Component, EventEmitter, Input, Output, SimpleChanges } from '@angular/core';
import { TEMPLATE_COMPONENT } from 'src/app/models/templateModel';

@Component({
  selector: 'app-template-footer-editor',
  templateUrl: './template-footer-editor.component.html',
  styleUrls: ['./template-footer-editor.component.scss']
})
export class TemplateFooterEditorComponent {

  @Input() editorData!: TEMPLATE_COMPONENT | undefined;

  @Output() templateFooter = new EventEmitter();

  messageBody: string = '';

  ngOnChanges(changes: SimpleChanges) {
    if (changes['editorData']) {
      const editedData: TEMPLATE_COMPONENT = changes['editorData'].currentValue;
      if (!editedData) {
        return;
      }
      this.messageBody = editedData.text;
    }
  }

  onKeyUp(event:any) {
    this.templateFooter.emit({ type: 'FOOTER', text: this.messageBody })
  }
}
