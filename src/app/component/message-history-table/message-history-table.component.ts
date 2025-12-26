import { Component, Input, ChangeDetectorRef } from '@angular/core';
import { MessageHistory } from 'src/app/models/dashboard-count';
import { TEMPLATE_RESPONSE, TEMPLATE_COMPONENT } from 'src/app/models/templateModel';
import { TemplateService } from 'src/app/service/template-service.service';
import { TemplateMessageService } from 'src/app/service/template-message.service';

@Component({
  selector: 'app-message-history-table',
  templateUrl: './message-history-table.component.html',
  styleUrls: ['./message-history-table.component.scss']
})
export class MessageHistoryTableComponent {

  constructor(
    private templateService: TemplateService,
    private templateMessageService: TemplateMessageService,
    private cdr: ChangeDetectorRef
  ) { }

  @Input() listOfData: MessageHistory[] = [];
  
  // The template and preview data structure
  newMessagePreviewTemplate: { template?: TEMPLATE_RESPONSE, data?: TEMPLATE_COMPONENT[] } = {};
  
  visibility = false;
  previewData: TEMPLATE_COMPONENT[] = [];

  // Filter status options
  filterStatus = [
    { text: 'delivered', value: 'delivered' },
    { text: 'sent', value: 'sent' },
    { text: 'approved', value: 'approved' },
    { text: 'read', value: 'read' },
    { text: 'failed', value: 'failed' },
    { text: 'rejected', value: 'rejected' },
    { text: 'pending_deletion', value: 'pending_deletion' }
  ];

  // Handle expand/collapse logic for rows
  expandSet = new Set<string>();
  onExpandChange(id: string, checked: boolean): void {
    if (checked) {
      this.expandSet.add(id);
    } else {
      this.expandSet.delete(id);
    }
  }

  // Preview message logic
  previewMessage(data: MessageHistory) {
    const templateMessage = this.templateMessageService.getTemplateMessage();
    
    this.newMessagePreviewTemplate = {
      template: templateMessage.template,  // This should be of type TEMPLATE_RESPONSE
      data: templateMessage.data  // The associated data
    };
  
    this.visibility = true;
    this.cdr.detectChanges();
    
    console.log(this.newMessagePreviewTemplate);
  }
  
  
  
}
