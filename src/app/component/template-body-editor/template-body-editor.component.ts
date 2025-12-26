import { Component, EventEmitter, Input, OnInit, Output, SimpleChanges } from '@angular/core';
import { HtmlEditorService } from 'src/app/service/html-editor.service';
import { EditorStyles } from 'src/app/enums/editor-styles';
import { TEMPLATE_COMPONENT } from 'src/app/models/templateModel';

@Component({
  selector: 'app-template-body-editor',
  templateUrl: './template-body-editor.component.html',
  styleUrls: ['./template-body-editor.component.scss']
})
export class TemplateBodyEditorComponent implements OnInit {

  // messageBody: string = 'testsetfgfgd dsg d To insert a 🙂 😄emoji, either:';

  // messageBody: string = "*test* _body _ ~italixk~ ```code``` 😆 {{2}}";

  @Input() editorData!: TEMPLATE_COMPONENT | undefined;

  messageBody: string = "";
  @Output() templateBody = new EventEmitter();

  showEmojiPopup: boolean = false;

  constructor(private htmlEditorService: HtmlEditorService) { }
  ngOnInit(): void {
    console.log("ngOnInit")
  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes['editorData']) {
      const editedData: TEMPLATE_COMPONENT = changes['editorData'].currentValue;
      if (!editedData) {
        return;
      }
      this.messageBody = editedData.text;
    }
  }


  onTextHighlight(ev: any) {
    this.htmlEditorService.textHighlightEvent(ev);
  }

  cursorTracker(oField: any) {
    this.htmlEditorService.getCaretPos(oField);
    this.templateBody.emit({ type: 'BODY', text: this.messageBody })
  }


  insertBold(): void {
    this.messageBody = this.htmlEditorService.insertStyles(this.messageBody, EditorStyles.Bold);
  }

  addEmoji(event: any): void {
    this.messageBody = this.htmlEditorService.insertStyles(this.messageBody, EditorStyles.Emoji, event.emoji.native);
  }

  insertItalic(): void {
    this.messageBody = this.htmlEditorService.insertStyles(this.messageBody, EditorStyles.Italic);
  }

  insertST(): void {
    this.messageBody = this.htmlEditorService.insertStyles(this.messageBody, EditorStyles.StrikThrough);
  }

  insertCode(): void {
    this.messageBody = this.htmlEditorService.insertStyles(this.messageBody, EditorStyles.Code);
  }
}
