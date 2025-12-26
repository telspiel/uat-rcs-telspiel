import { Injectable } from '@angular/core';
import { EditorStyles } from '../enums/editor-styles';

@Injectable({
  providedIn: 'root'
})
export class HtmlEditorService {

  selectionStart: number = 0;
  selectionEnd: number = 0;
  selectedString: string = '';
  caretPos: number = 0;

  constructor() { }

  insert(str: string, index: number, insertingValues: string) {
    return str.substr(0, index) + insertingValues + str.substr(index);
  }

  insertStyles(messageStr: string, style: EditorStyles, emoji?: any): string {
    console.log(messageStr, style)
    let editorInputString = messageStr;

    if (style === EditorStyles.Emoji) {
      return this.insert(editorInputString, this.caretPos, emoji);
    }

    if (!this.selectedString) { // If user highlighted 
      let test = this.insert(editorInputString, this.caretPos, style + style);
      editorInputString = test;
      this.selectedString = '';
      return editorInputString;
    }

    // Blank insert
    let test = this.insert(editorInputString, this.selectionStart, style);
    test = this.insert(test, this.selectionEnd + 1, style);
    editorInputString = test;

    this.resetSelection();
    return editorInputString;
  }

  textHighlightEvent(ev: any) {
    this.selectionStart = ev.target.selectionStart;
    this.selectionEnd = ev.target.selectionEnd;
    this.selectedString = ev.target.value.substr(this.selectionStart, this.selectionEnd - this.selectionStart);
  }

  getCaretPos(oField: any) {
    if (oField.selectionStart || oField.selectionStart == '0') {
      this.caretPos = oField.selectionStart;
    }
    this.resetSelection();
  }

  resetSelection() {
    this.selectionStart = 0;
    this.selectionEnd = 0;
    this.selectedString = '';
  }

}
