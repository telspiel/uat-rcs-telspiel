import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { SEND_TEMPLATE_MODEL, TEMPLATES, TEMPLATE_MODEL_RESPONSE, TEMPLATE_RESPONSE, TemplateModel } from 'src/app/models/templateModel';
import { EditorToHtmlPipe } from 'src/app/pipes/editor-to-html.pipe';
import { TemplateMessageService } from 'src/app/service/template-message.service';
import { TemplateService } from 'src/app/service/template-service.service';
import { ToastService } from 'src/app/shared/toast-service.service';
import { NzUploadFile } from 'ng-zorro-antd/upload';

@Component({
  selector: 'app-bulk-msg',
  templateUrl: './bulk-msg.component.html',
  styleUrls: ['./bulk-msg.component.scss']
})
export class BulkMsgComponent {

  fileList: NzUploadFile[] = []
  listTemplates: TEMPLATES[] = []; // Initialize an empty array to store the fetched templates.
  selectedTemplateData: TEMPLATE_RESPONSE | undefined;

  templateDropdownSelected: string = '';

  body: any;
  newMessagePreviewTemplate: { template?: TEMPLATE_RESPONSE, data?: any } = {};
  visible = false;

  scheduleMessage: string = 'no';
  filterPipe = new EditorToHtmlPipe();

  @ViewChild('fileInput') el!: ElementRef;


  constructor(private fb: FormBuilder,
    private templateMessageService: TemplateMessageService,
    private toastService: ToastService,
    private templateService: TemplateService) {
  }

  ngOnInit(): void {
    this.templateService.getAllTemplateNames().subscribe(data => {
      this.listTemplates = data;
    })
  }

  open(): void {
    this.visible = true;
  }

  submitForm(): void {
    console.log("submitForm : ", this.visible)
    this.open();
    this.newMessagePreviewTemplate = this.templateMessageService.templateMessage;
  }

  onTemplateSelect(templateId: any) {
    console.log(templateId)
    templateId && this.templateService.getTemplateById(templateId).subscribe(data => {
      this.selectedTemplateData = { ...data };
      console.log(data)
    })
  }

  beforeUpload = (file: NzUploadFile): boolean => {
    this.fileList = this.fileList.concat(file);
    return false;
  };

  onUpload(event: any) {

    console.log(event)

    console.log(this.el);
    // Access the uploaded file through the ElementRef
    const uploadedFile = this.el.nativeElement.files[0];
    console.log(uploadedFile)

    this.fileList.push(uploadedFile)
  }

  submitDataToSendTemplate() {
    const template = this.templateMessageService.templateMessage.template
    let params = this.templateMessageService.templateMessage.data;
    console.log(params)

    const header = template?.components.find(item => item.type === 'HEADER');
    console.log(header)
    const compHeader = params.headerURL && {
      type: 'header',
      parameters: [
        {
          type: header?.format?.toLowerCase() || "image",
          image: {
            link: params.headerURL
          }
        }
      ]
    }

    const body = template?.components.find(item => item.type === 'BODY');
    const bodyParams = params.variables.map((item: any) => {
      return { "type": "text", "text": item.value }
    })
    const compBody = {
      "text": body?.text,
      "type": "body",
      "parameters": bodyParams
    }

    let comp = [];

    if (compHeader) {
      comp.push(compHeader)
    }

    if (compBody) {
      comp.push(compBody)
    }

    console.log(template)

    const reqBody: SEND_TEMPLATE_MODEL = {
      "name": template?.name || '',
      "id": '8qTZWz54yQdq3qyNpcwgWT',
      "type": "template",
      components: comp,
      "language": {
        "policy": "deterministic",
        "code": template?.language || "en_US"
      }
    }

    console.log(this.fileList)
    var fd = new FormData();
    console.log(this.fileList[0])
    fd.append('file', this.fileList[0] as any, this.fileList[0].filename);

    const jsonBlob = new Blob([JSON.stringify(reqBody)], { type: 'application/json' });

    fd.append('json', jsonBlob);
    // fd.append("reportProgress", true as any);


    this.templateService.sendBulkMessages(fd).subscribe(data => {
      // console.log(data);
      this.visible = false;
      this.newMessagePreviewTemplate = {};
      this.selectedTemplateData = undefined;
      this.toastService.publishNotification("Success", "Message Sent to the client Succesfully", "success")

    }, err => {
      console.log(err)
      const error = err.error.errors[0];
      this.toastService.publishNotification(error.title, error.details, "error")
    })
  }
}
