import { Component, Input, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'app-user-selector',
  templateUrl: './user-selector.component.html'
})
export class UserSelectorComponent {
  @Input() label: string = '';
  @Input() roleType: string = '';
  @Input() options: Array<{ label: string; value: any }> = [];
  @Input() selectedValue: any;
  @Output() selectedValueChange = new EventEmitter<any>();

  onSelectionChange(value: any) {
    this.selectedValueChange.emit({ value, role: this.roleType });
  }
}
