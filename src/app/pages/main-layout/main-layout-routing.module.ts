import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { DashboardComponent } from 'src/app/pages/dashboard/dashboard.component';
import { TemplateMsgComponent } from '../broadcast/template-msg/template-msg.component';
import { ManageComponent } from '../templates/manage/manage.component';
import { TemplatesComponent } from '../templates/templates.component';
import { MainLayoutComponent } from './main-layout.component';
import { BulkMsgComponent } from '../broadcast/bulk-msg/bulk-msg.component';
import { DetailedReportComponent } from '../reports/detailed-report/detailed-report.component';
import { TemplateComponent } from '../template/template.component';
import { BrandComponent } from '../brand/brand.component';
import { CreatebotComponent } from '../createbot/createbot.component';
import { ConfigbotComponent } from '../configbot/configbot.component';
import { TestdeviceComponent } from '../testdevice/testdevice.component';
//import { SegmentsComponent } from '../segments/segments.component';
//import { AddSegmentComponent } from '../segments/add-segment/add-segment.component';

const routes: Routes = [
  {
    path: '',
    component: MainLayoutComponent,
    children: [
      { path: '', redirectTo: 'dashboard', pathMatch: 'full' },
      { path: 'app', component: DashboardComponent },
      { path: 'templates', component: TemplatesComponent },
      { path: 'manage-templates', component: ManageComponent },
      { path: 'template-msg', component: TemplateMsgComponent },
      { path: 'template', component: TemplateComponent },
      { path: 'detailed-report', component: DetailedReportComponent },
      { path: 'Brand', component: BrandComponent },
      { path: 'createbot', component: CreatebotComponent },
      { path: 'configbot', component: ConfigbotComponent },
      { path: 'testdevice', component: TestdeviceComponent },
      // {path: 'segments', component: SegmentsComponent},
      // {path: 'addsegment', component: AddSegmentComponent},
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class MainLayoutRoutingModule { }
