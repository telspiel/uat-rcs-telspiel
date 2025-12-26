import { Component, OnDestroy, OnInit } from '@angular/core';
import { Subject } from 'rxjs';
import { TEMPLATE_COMPONENT, TEMPLATE_RESPONSE } from 'src/app/models/templateModel';
import { TemplateService } from 'src/app/service/template-service.service';
import { ToastService } from 'src/app/shared/toast-service.service';

@Component({
  selector: 'app-templates',
  templateUrl: './templates.component.html',
  styleUrls: ['./templates.component.scss']
})
export class TemplatesComponent implements OnInit, OnDestroy {
  drawerVisible = false;
  updateTemplateDrawerVisiblity = false;

  listTemplates: TEMPLATE_RESPONSE[] = []
  currentStep = 0;
  payload!: TEMPLATE_RESPONSE;
  previewBtnClickedSubject: Subject<void> = new Subject<void>();
  editTemplateData!: TEMPLATE_RESPONSE | null;
  isEditModeEnabled: boolean = false;

  constructor(
    private templateService: TemplateService,
    private notifyService: ToastService
  ) {
    this.templateService.templateEditorData.subscribe(data => {
      this.payload = data;
    })
    this.getAllTemplates();
  }

  ngOnInit(): void {

  }

  addTemplate() {
    console.log("Template Body Data", this.payload)

    // delete this.payload.builderType;

    this.payload.language = "en_US";
    this.payload.allow_category_change = true;

    this.templateService.saveTemplates(this.payload).subscribe(data => {
      this.notifyService.publishNotification('Success', data.message);
      this.getAllTemplates();
      this.close();
    }, err => {
      const error = err.meta.developer_message || err;
      this.notifyService.publishNotification('Failed', error, 'error');
    });

  }

  updateTemplate() {
    console.log("update", this.payload)

    const editId = this.editTemplateData?.id;
    const body: { components: TEMPLATE_COMPONENT[], allow_category_change: boolean } = { components: [], allow_category_change: true };
    body.components = this.payload.components;

    this.templateService.updateTemplates(editId || '', body).subscribe(data => {
      console.log("update : ", data)
      this.notifyService.publishNotification('Success', data?.message);
      this.getAllTemplates();
      this.close();
    });

  }

  getAllTemplates() {
    this.templateService.getAllTemplates().subscribe(data => {
      this.listTemplates = data.content;
      this.listTemplates.sort((a: TEMPLATE_RESPONSE, b: TEMPLATE_RESPONSE) => {
        return new Date(b.modified_at).getTime() - new Date(a.modified_at).getTime();
      });
    });
  }

  launchEditTemplateView(event: TEMPLATE_RESPONSE) {
    this.open();
    this.editTemplateData = event;
    this.isEditModeEnabled = true;
  }

  editTemplate(event: TEMPLATE_RESPONSE) {

  }

  deleteTemplate(event: TEMPLATE_RESPONSE) {
    console.log(event)
    this.templateService.deleteTemplate(event.id).subscribe(data => {
      this.notifyService.publishNotification('Success', data.message);
      this.getAllTemplates();
    })
  }

  open(): void {
    this.drawerVisible = true;
    this.editTemplateData = null;
    this.isEditModeEnabled = false;
  }

  close(): void {
    this.currentStep = 0;
    this.drawerVisible = false;
  }

  openUpdateDrawer(): void {
    this.updateTemplateDrawerVisiblity = true;
  }

  closeUpdateDrawer(): void {
    this.updateTemplateDrawerVisiblity = false;
  }


  preStep(): void {
    this.currentStep = 0;
  }

  nextStep(): void {
    this.currentStep = 1;
    this.previewBtnClickedSubject.next();
  }

  // make sure to destory the editor
  ngOnDestroy(): void {
  }

}
