import { EventEmitter, Injectable } from '@angular/core';
import { TEMPLATE_RESPONSE } from '../models/templateModel';
import { HttpClient } from '@angular/common/http';
import { HttpHeaders } from '@angular/common/http';
import { BASE_URL } from '../config/app-config';

import { HTTP_Response } from '../models/responseModel';

const TEMPLATEMESSAGE = "/rcs-reseller-service/templateService/getByTemplateName";


@Injectable({
  providedIn: 'root'
})
export class TemplateMessageService {
  private selectedTemplated: any = null;

  templateData: EventEmitter<TEMPLATE_RESPONSE> = new EventEmitter<TEMPLATE_RESPONSE>();

  templateMessage: { template?: TEMPLATE_RESPONSE, data?: any } = {};
  

  constructor() { }

  getTemplateDetails() {
    return this.selectedTemplated;
  }

 
 
  setTemplate(template: any) {
    // this.templateMessage.template = template;
    sessionStorage.removeItem('template')
    sessionStorage.setItem('template',template)
    let temp = sessionStorage.getItem('template');
    this.selectedTemplated = temp ? JSON.parse(temp) : null;

  }

  setTemplateData(data: any) {
    this.templateMessage.data = data;
  }
  getTemplateMessage() {
    return this.templateMessage;
  }

  publishmessage(){
    // this.sendTemplates.
  }

}
