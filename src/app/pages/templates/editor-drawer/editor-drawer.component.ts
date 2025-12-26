import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-editor-drawer',
  templateUrl: './editor-drawer.component.html',
  styleUrls: ['./editor-drawer.component.scss']
})
export class EditorDrawerComponent {

  currentStep: number = 0;

  constructor() { }
}
