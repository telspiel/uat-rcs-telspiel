import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { CommonModule } from '@angular/common';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { NZ_I18N } from 'ng-zorro-antd/i18n';
import { en_US } from 'ng-zorro-antd/i18n';
import { HashLocationStrategy, LocationStrategy, registerLocaleData } from '@angular/common';
import en from '@angular/common/locales/en';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HTTP_INTERCEPTORS, HttpClientModule } from '@angular/common/http';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { NzFormModule } from 'ng-zorro-antd/form';
import { NzInputModule } from 'ng-zorro-antd/input';
import { NzLayoutModule } from 'ng-zorro-antd/layout';
import { NzGridModule } from 'ng-zorro-antd/grid';
import { NzIconModule } from 'ng-zorro-antd/icon';
import { NzSliderModule } from 'ng-zorro-antd/slider';
import { NzMenuModule } from 'ng-zorro-antd/menu';
import { NzPageHeaderModule } from 'ng-zorro-antd/page-header';
import { NzTableModule } from 'ng-zorro-antd/table';
import { NzTagModule } from 'ng-zorro-antd/tag';
import { NzPopoverModule } from 'ng-zorro-antd/popover';
import { NzDividerModule } from 'ng-zorro-antd/divider';
import { NzToolTipModule } from 'ng-zorro-antd/tooltip';
import { NzDrawerModule } from 'ng-zorro-antd/drawer';
import { NzSelectModule } from 'ng-zorro-antd/select';
import { NzSegmentedModule } from 'ng-zorro-antd/segmented';
import { NzAvatarModule } from 'ng-zorro-antd/avatar';
import { NzSwitchModule } from 'ng-zorro-antd/switch';
import { NzCardModule } from 'ng-zorro-antd/card';
import { NzImageModule } from 'ng-zorro-antd/image';
import { NzStepsModule } from 'ng-zorro-antd/steps';
import { NzAlertModule } from 'ng-zorro-antd/alert';
import { NzDatePickerModule } from 'ng-zorro-antd/date-picker';
import { NzTimePickerModule } from 'ng-zorro-antd/time-picker';
import { NzCollapseModule } from 'ng-zorro-antd/collapse';
import { NzCheckboxModule } from 'ng-zorro-antd/checkbox';
import { NzNotificationModule } from 'ng-zorro-antd/notification';
import { NzRadioModule } from 'ng-zorro-antd/radio';
import { NzCarouselModule } from 'ng-zorro-antd/carousel';
import { NzSpaceModule } from 'ng-zorro-antd/space';
import { LoginComponent } from './login/login.component';
import { DashboardComponent } from './pages/dashboard/dashboard.component';
import { MainLayoutComponent } from './pages/main-layout/main-layout.component';
import { ManageComponent } from './pages/templates/manage/manage.component';
import { TemplatesComponent } from './pages/templates/templates.component';
import { PickerModule } from '@ctrl/ngx-emoji-mart';
import { NgxEditorModule } from 'ngx-editor';
import { TemplateBodyEditorComponent } from './component/template-body-editor/template-body-editor.component';
import { TemplateHeaderEditorComponent } from './component/template-header-editor/template-header-editor.component';
import { TemplateFooterEditorComponent } from './component/template-footer-editor/template-footer-editor.component';
import { TemplateFooterBtnsComponent } from './component/template-footer-btns/template-footer-btns.component';
import { TemplateQuickRplyBtnComponent } from './component/template-quick-rply-btn/template-quick-rply-btn.component';
import { TemplateCtaBtnComponent } from './component/template-cta-btn/template-cta-btn.component';
import { ToArrayPipe } from './pipes/to-array.pipe';
import { SimpleTableComponent } from './component/simple-table/simple-table.component';
import { TemplateBuilderComponent } from './component/template-builder/template-builder.component';
import { TemplatePreviewComponent } from './component/template-preview/template-preview.component';
import { EditorToHtmlPipe } from './pipes/editor-to-html.pipe';
import { TemplateMsgComponent } from './pages/broadcast/template-msg/template-msg.component';
import { TemplatePreviewCustomComponent } from './component/template-preview-custom/template-preview-custom.component';
import { SchedulingComponent } from './component/scheduling/scheduling.component';
import { PreviewComponent } from './pages/broadcast/template-msg/preview/preview.component';
import { NzPopconfirmModule } from 'ng-zorro-antd/popconfirm';
import { NzTypographyModule } from 'ng-zorro-antd/typography';
import { NzStatisticModule } from 'ng-zorro-antd/statistic';
import { NzUploadFile, NzUploadModule } from 'ng-zorro-antd/upload';
import { NzListModule } from 'ng-zorro-antd/list';
import { NzModalModule } from 'ng-zorro-antd/modal';
import { NzBreadCrumbModule } from 'ng-zorro-antd/breadcrumb';
import { NzPaginationModule } from 'ng-zorro-antd/pagination';
import { NzTabsModule } from 'ng-zorro-antd/tabs';
import { SpinnerComponent } from './spinner/spinner.component';
import { HttpInterceptorInterceptor } from './shared/http-interceptor.interceptor';
import { EditorDrawerComponent } from './pages/templates/editor-drawer/editor-drawer.component';
import { ExtractTemplateBodyPipe } from './pipes/extract-template-body.pipe';
import { MessageHistoryTableComponent } from './component/message-history-table/message-history-table.component';
import { BulkMsgComponent } from './pages/broadcast/bulk-msg/bulk-msg.component';
import { NgChartsModule } from 'ng2-charts';
import { DateTimePickerComponent } from './component/shared/date-time-picker/date-time-picker.component';
import { DetailedReportComponent } from './pages/reports/detailed-report/detailed-report.component';
import { TemplateComponent } from './pages/template/template.component';
import { BrandComponent } from './pages/brand/brand.component';
import { CreatebotComponent } from './pages/createbot/createbot.component';
import { ConfigbotComponent } from './pages/configbot/configbot.component';
import { TestdeviceComponent } from './pages/testdevice/testdevice.component';
import { UserCreationComponent } from './pages/user-creation/user-creation.component';
import { AddUserComponent } from './pages/user-creation/add-user/add-user.component';
import { ViewComponent } from './pages/user-creation/view/view.component';
import { EditComponent } from './pages/user-creation/edit/edit.component';
import { SenderIdReportComponent } from './pages/reports/sender-id-report/sender-id-report.component';
import { ClientReportComponent } from './pages/reports/client-report/client-report.component';
import { SummaryReportComponent } from './pages/reports/summary-report/summary-report.component';
import { HourlyReportComponent } from './pages/reports/hourly-report/hourly-report.component';
import { LatencyReportComponent } from './pages/reports/latency-report/latency-report.component';
import { NDNCReportComponent } from './pages/reports/ndnc-report/ndnc-report.component';
import { QuickComponent } from './pages/campaign/quick/quick.component';
import { UploadComponent } from './pages/campaign/upload/upload.component';
import { DynamicComponent } from './pages/campaign/dynamic/dynamic.component';
import { GroupComponent } from './pages/campaign/group-campaign/group.component';
import { ScheduledComponent } from './pages/campaign/scheduled/scheduled.component';
import { DownloadAdminReportComponent } from './pages/reports/download-admin-report/download-admin-report.component';
import { DownloadReportComponent } from './pages/reports/download-report/download-report.component';
import { ErrorReportComponent } from './pages/reports/error-report/error-report.component';
import { CustomerSummaryReportComponent } from './pages/reports/customer-summary-report/customer-summary-report.component';
import { AddViewSenderIdComponent } from './pages/DLT/add-view-sender-id/add-view-sender-id.component';
import { ContentComponent } from './pages/DLT/content-template-id/content.component';
import { DltaddComponent } from './pages/DLT/content-template-id/dltadd/dltadd.component';
import { DltuploadComponent } from './pages/DLT/content-template-id/dltupload/dltupload.component';
import { DltviewComponent } from './pages/DLT/content-template-id/dltview/dltview.component';
// import { AddTemplateComponent } from './pages/template/add-template/add-template.component';
// import { ViewTemplateComponent } from './pages/template/view-template/view-template.component';
import { NzDropDownModule } from 'ng-zorro-antd/dropdown';
import { NzSpinModule } from 'ng-zorro-antd/spin';
import { CardComponent } from './pages/card/card.component';
import { AddComponent } from './pages/template/add/add.component';
import { ViewTemplateComponent } from './pages/template/view-template/view-template.component';
import { UpdateTemplateComponent } from './pages/template/update-template/update-template.component';
import { ViewBotComponent } from './pages/view-bot/view-bot.component';
import { AddbrandComponent } from './pages/brand/addbrand/addbrand.component';
import { ViewbrandComponent } from './pages/brand/viewbrand/viewbrand.component';
import { UpdatebrandComponent } from './pages/brand/updatebrand/updatebrand.component';
import { ViewTemplateDitailsComponent } from './pages/template/view-template-ditails/view-template-ditails.component';
import { VerificationLaunchComponent } from './pages/verification-launch/verification-launch.component';
import { ApiDocsComponent } from './pages/api-docs/api-docs.component';
import {CampaignReportComponent} from './pages/reports/campaign-report/campaign-report.component';
import { UploadlogoComponent } from './pages/uploadlogo/uploadlogo.component';
import { NzDescriptionsModule } from 'ng-zorro-antd/descriptions';
import { ImageCropperModule } from 'ngx-image-cropper';
import { TestDeviceComponent } from './pages/configbot/test-device/test-device.component';
import { CapiblitytesterComponent } from './pages/capiblitytester/capiblitytester.component';
import { NzProgressModule } from 'ng-zorro-antd/progress';
import { NzTreeModule } from 'ng-zorro-antd/tree';
import { UpdatebotComponent } from './pages/updatebot/updatebot.component';
import { CampaignreportComponent } from './pages/campaignreport/campaignreport.component';
import { CreditmanagmentComponent } from './pages/creditmanagment/creditmanagment.component';
import { RoutingComponent } from './pages/routing/routing.component';
import { UserRoutingComponent } from './pages/routing/user-routing/user-routing.component';
import { RoutingsComponent } from './pages/routing/routings/routings.component';
import { ViewroutingComponent } from './pages/routing/viewrouting/viewrouting.component';
import { BillingPlainComponent } from './pages/billing-plain/billing-plain.component';
import { AddbillingComponent } from './pages/billing-plain/addbilling/addbilling.component';
import { WalletComponent } from './pages/wallet/wallet.component';
import { TemplateApprovalComponent } from './pages/template/template-approval/template-approval.component';
import { AddWalletComponent } from './pages/wallet/add-wallet/add-wallet.component';
import { BotDropdownComponent } from './component/bot-dropdown/bot-dropdown.component';
import { BrandDropdownComponent } from './component/brand-dropdown/brand-dropdown.component';
import { CampainDropdownComponent } from './component/campain-dropdown/campain-dropdown.component';
import { TemplateDropdownComponent } from './component/template-dropdown/template-dropdown.component';
import { ShortLinkManagementComponent } from './pages/short-link-management/short-link-management.component';
import { AddLinksComponent } from './pages/short-link-management/add-links/add-links.component';
import { DomainManagerComponent } from './pages/domain-manager/domain-manager.component';
import { RichCardComponent } from './component/rich-card/rich-card.component';
import { MessageTextComponent } from './component/message-text/message-text.component';
import { CourselComponent } from './component/coursel/coursel.component';
import { MessageTextWithPdfComponent } from './component/message-text-with-pdf/message-text-with-pdf.component';
import { DynamicRichCardComponent } from './component/dynamic-rich-card/dynamic-rich-card.component';
import { BotPreviweComponent } from './component/bot-previwe/bot-previwe.component';
import { PageHeaderComponent } from './component/page-header/page-header.component';
import{NgxUiLoaderHttpModule, NgxUiLoaderModule} from 'ngx-ui-loader';
//import { ImageCropperComponent } from './custom-image-cropper/image-cropper/image-cropper.component';
// import { AngularPinturaModule } from '@pqina/angular-pintura';
import { UploadModalComponent } from './component/upload-modal/upload-modal.component';
import { UploadcampaignComponent } from './pages/campaign/uploadcampaign/uploadcampaign.component';
//import { LaunchBotComponent } from './pages/launch-bot/launch-bot.component';
//import { ImageCropperComponent } from 'ngx-image-cropper';
import { NzSkeletonModule } from 'ng-zorro-antd/skeleton';
import { TpsManagerComponent } from './pages/tps-manager/tps-manager.component';
import { UserSelectorComponent } from './component/user-selector/user-selector.component';
import { ProfileComponent } from './component/profile/profile.component';
import { PhonebookComponent } from './pages/phonebook/phonebook.component';
import { AddPhonebookComponent } from './pages/phonebook/add-phonebook/add-phonebook.component';
import { ViewphonebookComponent } from './pages/phonebook/viewphonebook/viewphonebook.component';
import { FilterDropdownComponent } from './component/filter-dropdown/filter-dropdown.component';
import { BlackListComponent } from './pages/black-list/black-list.component';
import { AddBlackListComponent } from './pages/black-list/add-black-list/add-black-list.component';
import { AccountManagerComponent } from './pages/account-manager/account-manager.component';
import { AddAccountComponent } from './pages/account-manager/add-account/add-account.component';
import { EditAccountComponent } from './pages/account-manager/edit-account/edit-account.component';
import { ViewAccountComponent } from './pages/account-manager/view-account/view-account.component';
import { GenerateApiComponent } from './pages/generate-api/generate-api.component';

// import { ApptpsComponent } from './pages/tps-manager/apptps/apptps.component';
// import { UpdatetpsComponent } from './pages/tps-manager/updatetps/updatetps.component';
// import { SegmentsComponent } from './pages/segments/segments.component';
// import { AddSegmentComponent } from './pages/segments/add-segment/add-segment.component';


registerLocaleData(en);

@NgModule({
  declarations: [
    UploadModalComponent,
    AppComponent,
    LoginComponent,
    DashboardComponent,
    MainLayoutComponent,
    ManageComponent,
    TemplatesComponent,
    TemplateBodyEditorComponent,
    TemplateHeaderEditorComponent,
    TemplateFooterEditorComponent,
    TemplateFooterBtnsComponent,
    TemplateQuickRplyBtnComponent,
    TemplateCtaBtnComponent,
    ToArrayPipe,
    SimpleTableComponent,
    TemplateBuilderComponent,
    TemplatePreviewComponent,
    EditorToHtmlPipe,
    TemplateMsgComponent,
    TemplatePreviewCustomComponent,
    SchedulingComponent,
    PreviewComponent,
    SpinnerComponent,
    EditorDrawerComponent,
    ExtractTemplateBodyPipe,
    EditorToHtmlPipe,
    MessageHistoryTableComponent,
    BulkMsgComponent,
    ExtractTemplateBodyPipe,
    DateTimePickerComponent,
    DetailedReportComponent,
    TemplateComponent,
    BrandComponent,
    CreatebotComponent,
    CampaignReportComponent,
    ConfigbotComponent,
    TestdeviceComponent,
    GenerateApiComponent,
    
    UserCreationComponent,
    AddUserComponent,
    ViewComponent,
    EditComponent,
    SenderIdReportComponent,
    ClientReportComponent,
    SummaryReportComponent,
    HourlyReportComponent,
    LatencyReportComponent,
    NDNCReportComponent,
    QuickComponent,
    UploadComponent,
    DynamicComponent,
    GroupComponent,
    ScheduledComponent,
    DownloadAdminReportComponent,
    DownloadReportComponent,
    ErrorReportComponent, 
    CustomerSummaryReportComponent,
    AddViewSenderIdComponent,
    ContentComponent,
    DltuploadComponent,
    DltaddComponent,
    DltviewComponent,
    CardComponent,
    AddComponent,
    ViewTemplateComponent,
    UpdateTemplateComponent,
    ViewBotComponent,
    AddbrandComponent,
    ViewbrandComponent,
    UpdatebrandComponent,
    ViewTemplateDitailsComponent,
    VerificationLaunchComponent,
    ApiDocsComponent,
    CampaignReportComponent,
    UploadlogoComponent,
    TestDeviceComponent,
    CapiblitytesterComponent,
    UpdatebotComponent,
    CampaignreportComponent,
    CreditmanagmentComponent,
    RoutingComponent,
    UserRoutingComponent,
    RoutingsComponent,
    ViewroutingComponent,
    BillingPlainComponent,
    AddbillingComponent,
    WalletComponent,
    TemplateApprovalComponent,
    AddWalletComponent,
    BotDropdownComponent,
    BrandDropdownComponent,
    CampainDropdownComponent,
    TemplateDropdownComponent,
    ShortLinkManagementComponent,
    AddLinksComponent,
    DomainManagerComponent,
    RichCardComponent,
    MessageTextComponent,
    CourselComponent,
    MessageTextWithPdfComponent,
    DynamicRichCardComponent,
    BotPreviweComponent,
    PageHeaderComponent,
    UploadcampaignComponent,
    TpsManagerComponent,
    UserSelectorComponent,

    ProfileComponent,
    PhonebookComponent,
    AddPhonebookComponent,
    ViewphonebookComponent,
    FilterDropdownComponent,
    BlackListComponent,
    AddBlackListComponent,
    AccountManagerComponent,
    AddAccountComponent,
    EditAccountComponent,
    ViewAccountComponent,

    // ApptpsComponent,
    // UpdatetpsComponent,
    // SegmentsComponent,
    // AddSegmentComponent,
    

  ],
  imports: [
    // Cropper, 
    CommonModule,
    NzSkeletonModule,
    BrowserModule,
    AppRoutingModule,
    FormsModule,
    NzUploadModule,
    FormsModule,
    NzBreadCrumbModule,
    HttpClientModule,
    BrowserAnimationsModule,
    ReactiveFormsModule,
    PickerModule,
    NzModalModule,
    NzSpaceModule,
    NzDescriptionsModule,

    NgxEditorModule.forRoot({
      locals: {
        bold: 'Bold',
        italic: 'Italic',
        code: 'Code'
      }
    }),
    NzButtonModule,
    NzFormModule,
    NzSpinModule,
    NzInputModule,
    NzLayoutModule,
    NzButtonModule,
    NzGridModule,
    NzIconModule,
    NzSliderModule,
    NzTabsModule,
    NzMenuModule,
    NzPaginationModule,
    NzPageHeaderModule,
    NzTableModule,
    NzTagModule,
    NzSpaceModule,
    NzDividerModule,
    NzToolTipModule,
    NzDrawerModule,
    NzSelectModule,
    NzProgressModule,
    NzSegmentedModule,
    NzAvatarModule,
    NzSwitchModule,
    NzCardModule,
    NzImageModule,
    NzStepsModule,
    NzAlertModule,
    NzCarouselModule,
    NzDatePickerModule,
    NzTimePickerModule,
    NzCollapseModule,
    NzCheckboxModule,
    NzPopconfirmModule,
    NzTypographyModule,
    NzNotificationModule,
    NzStatisticModule,
    NzUploadModule,
    NgChartsModule,
    NzTabsModule,
    NzTreeModule,
    NzListModule,
    NzRadioModule,
    NzDropDownModule,
    NzPopoverModule,
    NzIconModule,
    NzUploadModule,
    ImageCropperModule,
    NzModalModule, 
    NgxUiLoaderModule,
  ],

  providers: [
    {
      provide: HTTP_INTERCEPTORS,
      useClass: HttpInterceptorInterceptor,
      multi: true,
    },
    { provide: LocationStrategy, useClass: HashLocationStrategy },
    { provide: NZ_I18N, useValue: en_US },
    ExtractTemplateBodyPipe
  ],
  exports: [EditorToHtmlPipe, ExtractTemplateBodyPipe],
  bootstrap: [AppComponent]
})
export class AppModule { }
