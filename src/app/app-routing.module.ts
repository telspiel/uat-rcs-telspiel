import { Component, NgModule } from "@angular/core";
import { RouterModule, Routes } from "@angular/router";
import { LoginComponent } from "./login/login.component";
import { AuthGuard } from "./shared/auth.guard";
import { DashboardComponent } from "./pages/dashboard/dashboard.component";
import { TemplateComponent } from "./pages/template/template.component";
import { TemplatesComponent } from "./pages/templates/templates.component";
import { ManageComponent } from "./pages/templates/manage/manage.component";
import { TemplateMsgComponent } from "./pages/broadcast/template-msg/template-msg.component";
import { DetailedReportComponent } from "./pages/reports/detailed-report/detailed-report.component";
import { BrandComponent } from "./pages/brand/brand.component";
import { CreatebotComponent } from "./pages/createbot/createbot.component";
import { ConfigbotComponent } from "./pages/configbot/configbot.component";
import { TestdeviceComponent } from "./pages/testdevice/testdevice.component";
import { MainLayoutComponent } from "./pages/main-layout/main-layout.component";
import { UserCreationComponent } from "./pages/user-creation/user-creation.component";
import { AddUserComponent } from "./pages/user-creation/add-user/add-user.component";
import { ViewComponent } from "./pages/user-creation/view/view.component";
import { EditComponent } from "./pages/user-creation/edit/edit.component";
import { SenderIdReportComponent } from "./pages/reports/sender-id-report/sender-id-report.component";
import { ClientReportComponent } from "./pages/reports/client-report/client-report.component";
import { SummaryReportComponent } from "./pages/reports/summary-report/summary-report.component";
import { HourlyReportComponent } from "./pages/reports/hourly-report/hourly-report.component";
import { LatencyReportComponent } from "./pages/reports/latency-report/latency-report.component";
import { NDNCReportComponent } from "./pages/reports/ndnc-report/ndnc-report.component";
import { QuickComponent } from "./pages/campaign/quick/quick.component";
import { UploadComponent } from "./pages/campaign/upload/upload.component";
import { DynamicComponent } from "./pages/campaign/dynamic/dynamic.component";
import { GroupComponent } from "./pages/campaign/group-campaign/group.component";
import { ScheduledComponent } from "./pages/campaign/scheduled/scheduled.component";
import { DownloadReportComponent } from "./pages/reports/download-report/download-report.component";
import { DownloadAdminReportComponent } from "./pages/reports/download-admin-report/download-admin-report.component";
import { ErrorReportComponent } from "./pages/reports/error-report/error-report.component";
import { CustomerSummaryReportComponent } from "./pages/reports/customer-summary-report/customer-summary-report.component";
import { AddViewSenderIdComponent } from "./pages/DLT/add-view-sender-id/add-view-sender-id.component";
import { ContentComponent } from "./pages/DLT/content-template-id/content.component";
import { DltaddComponent } from "./pages/DLT/content-template-id/dltadd/dltadd.component";
import { DltviewComponent } from "./pages/DLT/content-template-id/dltview/dltview.component";
import { DltuploadComponent } from "./pages/DLT/content-template-id/dltupload/dltupload.component";
import { CardComponent } from "./pages/card/card.component";
import { AddComponent } from "./pages/template/add/add.component";
import { ViewTemplateComponent } from "./pages/template/view-template/view-template.component";
import { UpdateTemplateComponent } from "./pages/template/update-template/update-template.component";
import { ViewBotComponent } from "./pages/view-bot/view-bot.component";
import { AddbrandComponent } from "./pages/brand/addbrand/addbrand.component";
import { ViewbrandComponent } from "./pages/brand/viewbrand/viewbrand.component";
import { UpdatebrandComponent } from "./pages/brand/updatebrand/updatebrand.component";
import { ViewTemplateDitailsComponent } from "./pages/template/view-template-ditails/view-template-ditails.component";
import { VerificationLaunchComponent } from "./pages/verification-launch/verification-launch.component";
import { ApiDocsComponent } from "./pages/api-docs/api-docs.component";
import { CampaignReportComponent } from "./pages/reports/campaign-report/campaign-report.component";
import { UploadlogoComponent } from "./pages/uploadlogo/uploadlogo.component";
import { CapiblitytesterComponent } from "./pages/capiblitytester/capiblitytester.component";
import { UpdatebotComponent } from "./pages/updatebot/updatebot.component";
import { CreditmanagmentComponent } from "./pages/creditmanagment/creditmanagment.component";
import { RoutingComponent } from "./pages/routing/routing.component";
import { UserRoutingComponent } from "./pages/routing/user-routing/user-routing.component";
import { RoutingsComponent } from "./pages/routing/routings/routings.component";
import { ViewroutingComponent } from "./pages/routing/viewrouting/viewrouting.component";
import { BillingPlainComponent } from "./pages/billing-plain/billing-plain.component";
import { AddbillingComponent } from "./pages/billing-plain/addbilling/addbilling.component";
import { WalletComponent } from "./pages/wallet/wallet.component";
import { TemplateApprovalComponent } from "./pages/template/template-approval/template-approval.component";
import { AddWalletComponent } from "./pages/wallet/add-wallet/add-wallet.component";
import { ShortLinkManagementComponent } from "./pages/short-link-management/short-link-management.component";
import { AddLinksComponent } from "./pages/short-link-management/add-links/add-links.component";
import { DomainManagerComponent } from "./pages/domain-manager/domain-manager.component";
import { UploadModalComponent } from "./component/upload-modal/upload-modal.component";
import { UploadcampaignComponent } from "./pages/campaign/uploadcampaign/uploadcampaign.component";
import { TpsManagerComponent } from "./pages/tps-manager/tps-manager.component";
import { ProfileComponent } from "./component/profile/profile.component";
import { PhonebookComponent } from "./pages/phonebook/phonebook.component";
import { AddPhonebookComponent } from "./pages/phonebook/add-phonebook/add-phonebook.component";
import { ViewphonebookComponent } from "./pages/phonebook/viewphonebook/viewphonebook.component";

import { BlackListComponent } from "./pages/black-list/black-list.component";

import{AddBlackListComponent} from "./pages/black-list/add-black-list/add-black-list.component";
// import { SegmentsComponent } from './pages/segments/segments.component';
// import { AddSegmentComponent } from './pages/segments/add-segment/add-segment.component';
//import { LaunchBotComponent } from './pages/launch-bot/launch-bot.component';
// import { AddTemplateComponent } from './pages/template/add-template/add-template.component';
// import { ViewTemplateComponent } from './pages/template/view-template/view-template.component';

import { AccountManagerComponent } from "./pages/account-manager/account-manager.component";

import { AddAccountComponent } from "./pages/account-manager/add-account/add-account.component";


import { EditAccountComponent } from "./pages/account-manager/edit-account/edit-account.component";

import { ViewAccountComponent } from "./pages/account-manager/view-account/view-account.component";
import { GenerateApiComponent } from "./pages/generate-api/generate-api.component";


const routes: Routes = [
  {
    path: "",
    component: MainLayoutComponent,
    children: [
      {path:"", redirectTo: "dashboard", pathMatch: "full"},
      {path: "profile", component: ProfileComponent},
      { 
  path: "phonebook", 
  component: PhonebookComponent,
  children: [
    
  ]
},
{ path: "generate-api", component:GenerateApiComponent, data:{link:"generate-api"} },
       { path: "addphonebook", component: AddPhonebookComponent},
       { path: "viewphonebook", component: ViewphonebookComponent },
      {
        path: "dashboard",
        component: DashboardComponent,
        data: { link: "dashboard" },
      },
      {
        path: "templates",
        component: TemplatesComponent,
        data: { link: "template" },
      },
      {
        path: "manage-templates",
        component: ManageComponent,
        data: { link: "manage-templates" },
      },
      {
        path: "campreport/:campaignName",
        component: CampaignReportComponent,
        data: { link: "campaign" },
      },
      // { path: 'template-msg', component: TemplateComponent },

      {
        path: "api-docs",
        component: ApiDocsComponent,
        data: { link: "api-docs" },
      },
      {
        path: "botcreation",
        component: TemplateMsgComponent,
        data: { link: "bot" },
      },
      { path: "viewbot", component: ViewBotComponent, data: { link: "bot" } },
      {
        path: "uploadlogo",
        component: UploadlogoComponent,
        data: { link: "uploadlogo" },
      },
      {
        path: "viewtemplate",
        component: ViewTemplateDitailsComponent,
        data: { link: "template" },
      },
      {
        path: "add",
        component: AddComponent,
        data: { link: "template" },
      },
      {
        path: "capablityTest",
        component: CapiblitytesterComponent,
        data: { link: "capablityTest" },
      },
      {
        path: "update",
        component: UpdateTemplateComponent,
        data: { link: "template" },
      },
      {
        path: "view",
        component: ViewTemplateComponent,
        data: { link: "template" },
      },
      {
        path: "template",
        component: TemplateComponent,
        children: [
          {
            path: "add",
            component: AddComponent,
          },
          {
            path: "view",
            component: ViewTemplateComponent,
          },
          {
            path: "update",
            component: UpdateTemplateComponent,
          },
        ],
        data: { link: "template" },
      },

      {
        path: "userrouting",
        component: UserRoutingComponent,
        children: [
          { path: " ", component: RoutingsComponent },
          { path: "viewrouting", component: ViewroutingComponent },
        ],
      },

      {
        path: "billingPlain",
        component: BillingPlainComponent,
        data: { link: "billing" },
      },
      {
        path: "addbilling",
        component: AddbillingComponent,
        data: { link: "billing" },
      },

      {
        path: "blacklist",
        component: BlackListComponent,
        data: { link: "black-list" },
      },
      {
        path: "addblacklist",
        component: AddBlackListComponent,
        data: { link: "black-list" },
      },

      { path: "wallet", component: WalletComponent, data: { link: "wallet" } },
      {
        path: "updateWallet",
        component: AddWalletComponent,
        data: { link: "wallet" },
      },
      {
        path: "template-approval",
        component: TemplateApprovalComponent,
        data: { link: "template-approval" },
      },
      {
        path: "detailed-report",
        component: DetailedReportComponent,
        data: { link: "detailed-report" },
      },
      {
        path: "senderId-Report",
        component: SenderIdReportComponent,
        data: {
          breadcrumb: "Sender Id",
        },
      },
      {
        path: "client-report",
        component: ClientReportComponent,
        data: {
          breadcrumb: "Client",
        },
      },
      {
        path: "summary-report",
        component: SummaryReportComponent,
        data: {
          breadcrumb: "Summary",
        },
      },
      {
        path: "hourly-report",
        component: HourlyReportComponent,
        data: {
          breadcrumb: "Hourly",
        },
      },
      {
        path: "latency-report",
        component: LatencyReportComponent,
        data: {
          breadcrumb: "Latency",
        },
      },
      {
        path: "ndnc-report",
        component: NDNCReportComponent,
        data: {
          breadcrumb: "NDNC",
        },
      },
      {
        path: "download-report",
        component: DownloadReportComponent,
        data: {
          breadcrumb: "Download",
        },
      },
      {
        path: "download-admin-report",
        component: DownloadAdminReportComponent,
        data: {
          breadcrumb: "Download Admin",
        },
      },
      {
        path: "error-report",
        component: ErrorReportComponent,
        data: {
          breadcrumb: "Error",
        },
      },
      {
        path: "customer-report",
        component: CustomerSummaryReportComponent,
        data: {
          breadcrumb: "Customer",
        },
      },
      {
        path: "quick-campaign",
        component: QuickComponent,
        data: {
          link: "campaign",
          breadcrumb: "Quick",
        },
      },
      {
        path: "upload-campaign",
        component: UploadcampaignComponent,
        data: {
          link: "uploadFile",
          breadcrumb: "uploadcampaign",
        },
      },
      {
        path: "upload-campaign",
        component: UploadComponent,
        data: {
          breadcrumb: "Upload",
        },
      },
      {
        path: "dynamic-campaign",
        component: DynamicComponent,
        data: {
          breadcrumb: "Dynamic",
        },
      },
      {
        path: "group-campaign",
        component: GroupComponent,
        data: {
          breadcrumb: "Group",
        },
      },
      {
        path: "scheduled-campaign",
        component: ScheduledComponent,
        data: {
          breadcrumb: "Scheduled",
        },
      },
      {
        path: "dlt-addviewsenderid",
        component: AddViewSenderIdComponent,
        data: {
          breadcrumb: "Add/view SenderId",
        },
      },
      {
        path: "dlt-content-templateid",
        component: ContentComponent,
        children: [
          { path: " ", component: DltaddComponent },
          { path: "dltview", component: DltviewComponent },
          { path: "dltupload", component: DltuploadComponent },
        ],
      },
      { path: "Brand", component: BrandComponent, data: { link: "brand" } },

      {
        path: "addbrand",
        component: AddbrandComponent,
        data: { link: "brand" },
      },
      {
        path: "viewbrand",
        component: ViewbrandComponent,
        data: { link: "brand" },
      },
      {
        path: "updatebrand",
        component: UpdatebrandComponent,
        data: { link: "brand" },
      },

      // { path: 'Brand', component: BrandComponent },
      {
        path: "creditmange",
        component: CreditmanagmentComponent,
        data: { link: "creditmange" },
      },
      {
        path: "createbot",
        component: CreatebotComponent,
        data: { link: "bot" },
      },
      {
        path: "updatebot",
        component: UpdatebotComponent,
        data: { link: "bot" },
      },
      {
        path: "configbot/:id",
        component: ConfigbotComponent,
        data: { link: "bot" },
      },
      { path: "testdevice", component: TestdeviceComponent },
      {
        path: "short-link-management",
        component: ShortLinkManagementComponent,
      },
      {
        path: "domainManagerComponent",
        component: DomainManagerComponent,
        data: { link: "domain" },
      },
      { path: "addlink", component: AddLinksComponent },

      {path:"account-manager", 
      component: AccountManagerComponent, 
      children:[
        {path:'', redirectTo: "addAccount", pathMatch:"full"},
      {path:"addAccount", component:AddAccountComponent, 
        data:{link:"account-manager"} },
      {path:"edit-account", component:EditAccountComponent, 
      data:{link:"account-manager"} },
      {path:"view-account",component:ViewAccountComponent ,    data:{link:"account-manager"} }


        ]
      },

      

      // {
      //   path: 'drawflow',
      //   component: DrawflowComponent,
      //   children: [
      //     { path: '', redirectTo: 'drawflowadd', pathMatch: 'full' },
      //     { path: 'drawflowadd', component: DrawflowaddComponent, data: { breadcrumb: 'add' } },
      //     { path: 'drawflowview', component: DrawflowviewComponent, data: { breadcrumb: 'view' } },
      //     { path: 'drawflowupdate', component: DrawflowupdateComponent, data: { breadcrumb: 'update' } },
      //   ]
      // },
      { path: "upload", component: UploadModalComponent },
      { path: "tps", component: TpsManagerComponent },
      //{path:'launch-bot', component: LaunchBotComponent},
      {
        path: "verfication/:id",
        component: VerificationLaunchComponent,
        data: { link: "bot" },
      },
      // {path: 'segment', component: SegmentsComponent,
      // },
      // {path:"addsegment", component:AddSegmentComponent},
      {
        path: "userCreation",
        component: UserCreationComponent,
        children: [
          {
            path: " ",
            component: AddUserComponent,
            data: {
              link: "userCreation",
              breadcrumb: "Add",
            },
          },
          {
            path: "view",
            component: ViewComponent,
            data: {
              link: "userCreation",
              breadcrumb: "View",
            },
          },

          {
            path: "update",
            component: EditComponent,
            data: {
              link: "userCreation",
              breadcrumb: "Update",
            },
          },
        ],
        // loadChildren: ()=>import('src/app/pages/user-creation/user-creation.router').then(m=>m.UserAddRoutes)
      },
    ],
    canActivate: [AuthGuard],
  },

  { path: "", redirectTo: "/login", pathMatch: "full" },
  {
    path: "login",
    component: LoginComponent,
  },
  { path: "card", component: CardComponent },

  // {
  //   path: ' ',
  //   loadChildren: () =>
  //     import('src/app/pages/main-layout/main-layout.module').then(
  //       m => m.MainLayoutModule),canActivate:[AuthGuard]
  // }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
