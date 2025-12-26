import { Component, OnInit, ViewChild, ChangeDetectorRef } from "@angular/core";
import { DomainserviceService } from "src/app/service/domainservice.service";
import { PhonebookService } from 'src/app/service/phonebook.service';
import { NzTabChangeEvent } from 'ng-zorro-antd/tabs';
import {
  AbstractControl,
  FormArray,
  FormBuilder,
  FormControl,
  FormGroup,
  ValidationErrors,
  Validators,
} from "@angular/forms";
import { SafeUrl } from "@angular/platform-browser";
import { error, get } from "jquery";
import { differenceInCalendarDays } from "date-fns";
import { NzUploadChangeParam, NzUploadModule } from "ng-zorro-antd/upload";
import { NzDrawerModule } from "ng-zorro-antd/drawer";
import { CampaignService } from "src/app/service/campaign.service";
import { ReportService } from "src/app/service/report.service";
import { TemplateService } from "src/app/service/template-service.service";
import { ToastService } from "src/app/shared/toast-service.service";
import { HttpClient, HttpHeaders } from "@angular/common/http";
import { NzUploadFile } from "ng-zorro-antd/upload";
import { format } from "date-fns";
import { from, Observable } from "rxjs";
import { NzCarouselComponent } from "ng-zorro-antd/carousel";
import { NzIconService } from "ng-zorro-antd/icon";
import { BASE_URL } from "src/app/config/app-config";
import { Router } from "@angular/router";
import * as XLSX from "xlsx";
import { NgxUiLoaderService } from "ngx-ui-loader";

interface ParsedFileInfo {
  originalFileName: string;
  parsedFiles: {
    fileName: string;
    headers: string[];
  }[];
  accessUrl: string;
}
@Component({
  selector: "app-dynamic",
  templateUrl: "./dynamic.component.html",
  styleUrls: ["./dynamic.component.scss"],
})
export class DynamicComponent implements OnInit {
  @ViewChild("carouselRef", { static: false }) carousel!: NzCarouselComponent;
  apiUrl = `${BASE_URL}/rcs-reseller-service/dynamicSMSService/uploadDynamicMessageFile`;
  token = sessionStorage.getItem("TOKEN") || "";
  userName = sessionStorage.getItem("USER_NAME") || "";
  alignment = "";
  groups: { groupId: string; groupName: string }[] = [];
  fileUrl = "";
  mobileCount: number = 0;
  today = new Date();
  day = this.today.getDate();
  month = this.today.getMonth() + 1;
  year = this.today.getFullYear();
  botss: any;
  selectedBot: any = null;
  isModalVisible = false;
mobileNumArray:any
phoneList: string[] = [
  '9175X0X0X089',
  '9188X0X0X078',
  '9185X0X0X069'
];


  botId: string = "";
  messageTemplate: any;
  selectedBotId12: boolean = false;
  selecttemplate: boolean = false;
  selectedbotid: any;
  disablesubmit: boolean = false;
  // groups: any[] = [];
 customvariable: string[] = []; // Define this in your component
  messagetype = "transactional";
  fileList: NzUploadFile[] = [];
  isUploading: boolean = false;
    selectedGroupForAddContact: string = '';
  uploading = false;
  mobileNumber: string = '';
  disableuploadbutton: boolean = true;
  selectedTemplate: any = null;
  groupName: any = null;
  selectedTabtype: string = 'Quick-Campaign';
  shortUrlSelected = "N";
  visible = false;
  shortuploadss = "no";
  selectedTab: string = "Run Now";
  quickObj: any;
  bulkCampaignObj: any;
  radio = "A";
  hourList: string[] = [];
  uploadedBulkfileName: any;
  selectedColor: string = "#000000";
  columnHeaders: any;
  quickUpload: any;
  scheduleMessage = "no";
  splitFile = "no";
  numberprivew: any;
  isSubmitting = false;
  capabilities: any[] = [];
  mssageprivew: any;
  previewUrl: string | null = null;
  imageUrl: string = "";
  backgroundUrl: SafeUrl | null = null;
  uploadedFileSize: string | null = null;
  uploadedFileUrl: string | null = null;
  orientation = "vertical";
  carouselList: {
    cardTitle: string | null | undefined;
    cardDescription: string | null | undefined;
    mediaUrl: string | null;
    suggestions: any[];
  }[] = [
    { cardTitle: "", cardDescription: "", mediaUrl: "", suggestions: [] },
    { cardTitle: "", cardDescription: "", mediaUrl: "", suggestions: [] },
  ];
  imageHeight = 120;
  isDisabled = false;

  transformedData: any;
  chatBotNames: any;
  phoneControl = new FormControl("");

  templateForm = this.fb.group({
    botid: [""],
    type: ["", Validators.required],
    name: ["", Validators.required],
    fallbackText: ["", Validators.required],
    fallbackTextwhatsapp: ["", Validators.required],
    height: [""],
    width: [""],
    alignment: ["", Validators.required],
    cardTitle: ["", [Validators.required, Validators.maxLength(200)]],
    messagecontent: ["", [Validators.required, Validators.maxLength(2500)]],
    cardOrientation: [""],
    cardDescription: ["", [Validators.required, Validators.maxLength(2000)]],
    standAloneFileName: [""],
    thumbnailFileName: [""],
    urlopen: ["", [Validators.required, Validators.maxLength(120)]],
    phonenumberdial: [""],
    fallback: ["no", Validators.required],
    whatsapp:["no", Validators.required],
    shortUrl: ["no", Validators.required],
    meadiaUrl: [""],
    suggestions: this.fb.array([]),
    documentFileName: [""],
    messageOrder: ["textBottom"],
    mobileNumbers: this.fb.control('', [Validators.maxLength(100)]),
    selectvariablecolumn:["N"]
  });
  checkcapabilityform = this.fb.group({
    Mobile_Number: [""],
  });
  
  previewData: {
    phoneNo: string |  null;
    cardtittel: string | null;
    cardDec: string | null;
    messageContent: string | null;
    suggestionstext: any[];
    carouselList: {
      cardTitle: string | null | undefined;
      cardDescription: string | null | undefined;
      suggestions: any[];
      mediaUrl: string | null;
    }[];
  }[] = [];
  error:boolean = true;
  operator: any;
  messageContent: any;
  selectedFile: File | null = null;
  quickCampaign: FormGroup;
  cardTitle: any;
  carddescription: any;
  Suggestiontext: any;
  suggestions: any;
  messagecontent: any;
  valueChangesSubscription: any;
  type = "";
  isUploded = true;
  // uploading =false
  splitPartForm: FormGroup;
  selectedCardIndex: any;
  checked: boolean = false;
  fileType: any;
  isFallbackEnabled = false;
  isFallbackEnabledwhatsapp = false;
  validateForm: FormGroup;
  uploadCampaignForm: any;
  sessionStorage: any;
  uploadedFileName: any;
  bulkupload: any = [];
  uploadedFileData: any;
  minutesList: string[] = [];
  key: any;
  listOfData: any;
  filenamelist: any;
  reportList: any;
  cardDescription: any;
  columnPhoneNo: any;
  templateType: any;
  disabledDate: ((d: Date) => boolean) | undefined;
  timeDefaultValue: Date | undefined;
  isvisible = false;
  disable = true;
  zipfilelist: any;
  headers:any;
  disabled:any
whatsappApiEndpoint: any;
smsApiEndpoint: any;
  isUploadFile: boolean = false;
  isPreUploadedFileSelected: boolean = false;



  constructor(
    private domainService: DomainserviceService,
    private phonebookService: PhonebookService,
    private fb: FormBuilder,
    private ngxLoader: NgxUiLoaderService,
    private cdr: ChangeDetectorRef,
    private router: Router,
    private route: Router,
    private http: HttpClient,
    private capmser: CampaignService,
    private toastService: ToastService,
    private temp: TemplateService,
    private reportService: ReportService,
    private iconService: NzIconService
  ) {
    // this.myForm = this.fb.group({
    //   timeSlots: this.fb.array([])
    // });
    this.iconService.addIconLiteral(
      "custom:vrified",
      `<svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill="#000000"><path d="m438-338 226-226-57-57-169 169-84-84-57 57 141 141Zm42 258q-139-35-229.5-159.5T160-516v-244l320-120 320 120v244q0 152-90.5 276.5T480-80Z"/></svg>`
    );

    this.splitPartForm = this.fb.group({
      splitPart: this.fb.array([]),
    });

    

const reservedFields = ['PhoneNo', 'message_id', 'conversation_id'];
const allFields = (this.customvariable || []).map(v => v.trim());
// Ensure typing before map/trim
const validCustomVariables = Array.from(
  new Set(this.customvariable.map(v => v.trim()))
).filter(field => !reservedFields.includes(field));

// Build form array
const bodyFieldGroups = validCustomVariables.map(variable =>
  this.createBodyField(variable, 'Map Column Value', '')
);

    this.addSplitPart(true);

    this.validateForm = this.fb.group({
      botName: [{ value: "", disabled: "true" }],
      brandName: [{ value: "", disabled: "true" }],
     mobileNumbers:[{ value: "", disabled: "true" }],
      //to: ['', [Validators.required]],
      color: [{ value: "", disabled: "true" }],
      primaryphone: [{ value: "", disabled: "true" }],
      labelphone: [{ value: "", disabled: "true" }],
      primarywebsite: [{ value: "", disabled: "true" }],
      labelwebsite: [{ value: "", disabled: "true" }],
      primaryemail: [{ value: "", disabled: "true" }],
      emailLabel: [{ value: "", disabled: "true" }],
      region: [{ value: "", disabled: "true" }],
      messageType: [{ value: "", disabled: "true" }],
      billingCategory: [{ value: "", disabled: "true" }],
      bannerimage: [{ value: "", disabled: "true" }],
      language: [{ value: "", disabled: "true" }],
      botlogo: [{ value: "", disabled: "true" }],
      Url: [{ value: "", disabled: "true" }],
      privacypolicyurl: [{ value: "", disabled: "true" }],
      chatbotwebhook: [{ value: "", disabled: "true" }],
      botSummary: [{ value: "", disabled: "true" }],
      scheduleMessage: [{ value: "", disabled: "true" }],
    });
    const tempCapmaignName = (sessionStorage.getItem("USER_NAME") || "") + new Date().toLocaleString("en-GB", { 
      year: "numeric", 
      month: "2-digit", 
      day: "2-digit", 
      hour: "2-digit", 
      minute: "2-digit", 
      second: "2-digit", 
      hour12: false 
    }).replace(",", "").replace(/\//g, "-").replace(" ", "_");

    this.quickCampaign = this.fb.group({
      campaignName: [tempCapmaignName, Validators.required],
      newmobilenumbers: [""],
      shortupload: [this.shortuploadss],
      mobileNumbers: [
  '',
  [this.mobileNumberValidator]
],
      messageType: [this.messagetype, [Validators.required]],
      fileType: [""],
      uploadDynamicMessageFile: [""],
      serviceType: [""],
      fallback: ["N", Validators.required], 
      whatsapp:["N", Validators.required],
      shortUrl: ["N", Validators.required],
      fallbackText: [""],
      fallbackTextwhatsapp:[""],
      forMobilenumbers: [""],
      senderId: [""],
      botIds: ["", Validators.required],
      columnLongUrl: [""],
      TimeZone: ["Asia/Kolkata"],
      templateName: [""],
      messageEncoding: ["plainText"],
      messagePart: ["singlePart"],
      messageText: [""],
      shortUrlSelected: [this.shortUrlSelected],
      shortURLName: [""],
      // entityID: [""],
      scheduleMessage: [this.scheduleMessage],
      splitFile: [this.splitFile],
      operatorTemplateId: [""],
      datepicker: [""],
      smsApiEndpoint: [ '',
        [
          Validators.pattern(
           /^(http|https):\/\/.+$/
          ),
        ],
      ],
     whatsappApiEndpoint: [
        '',
        [
         
          Validators.pattern(
           /^(http|https):\/\/.+$/
          ),
        ],
      ],
      selectedTemplate: ["", Validators.required],
      groupName: [""],
      columnPhoneNo: [""],
      campaignScheduledDateTime: [null], // Date Picker Value
      campaignHour: [""], // Hours Dropdown
      campaignMinute: [""], // Minutes Dropdown
      campaignSecond: ["00"], // Default to "00"
      // campaignMeridian: ["AM"], 
      campaignExpiryDateTime: [null], // Expiry Date Picker
      expiryHour: [""], // Expiry Hours Dropdown
      expiryMinute: [""], // Expiry Minutes Dropdown
      expirySecond: ["00"], // Default to "00"
      // expiryMeridian: ["AM"], 
      domain: [""],
      callbackUrl: [""],
      isConversationalCampaign: ["N"],
      chatbotName: [""],
      fileName: [null],
      zipFileName:[null],
      selectvariablecolumn: ["N"],
      bodyFields: this.fb.array([]),
});



this.quickCampaign.get("selectvariablecolumn")?.valueChanges.subscribe((value) => {
  if (value === "Y") {
    this.loadCustomVariablesIntoForm();
  } else {
    this.quickCampaign.setControl("bodyFields", this.fb.array([])); // reset
  }
});



    this.quickCampaign.get("fallback")?.valueChanges.subscribe((value) => {
      this.isFallbackEnabled = value === "Y";
    });


     this.quickCampaign.get("whatsapp")?.valueChanges.subscribe((value) => {
      this.isFallbackEnabledwhatsapp = value === "Y";
    });
  }

get bodyFields(): FormArray {
  return this.quickCampaign.get('bodyFields') as FormArray;
}

createBodyField(variable: string, valueType: string, value: string): FormGroup {
  return this.fb.group({
    variable: [{ value: variable, disabled: true }], // readonly input
    valueType: [null],
    value: [value],
  });
}



// columnList: string[] = ['Account ID', 'name', 'url_test'];



getNzExtraText(): string {
  const value = this.quickCampaign.get('selectvariablecolumn')?.value;
  if (value === 'Y') {
    return "Column's value should be selected from the below";
  } else if (value === 'N') {
    return "Column's value should be same as uploaded Excel file";
  }
  return '';
}

// Helper method to check if template is selected
isTemplateSelected(): boolean {
  return this.customvariable && this.customvariable.length > 0;
}

mobileNumberValidator(control: AbstractControl): ValidationErrors | null {
  const raw = control.value || '';
  const numbers = raw
    .split(/[\n, ]+/)
    .map((num: string) => num.trim()
      .replace(/^\+?91/, '') // Remove leading '+91' or '91'
      .replace(/^0/, '')  
      .replace(/^\+/, ''))   // Remove leading '+' if present (for other country codes)
    .filter((num: string) => num !== '');

  const validRegex = /^(?!1234567890)\d{10}$/;
  const validNumbers = numbers.filter((num: string) => validRegex.test(num));

  if (validNumbers.length > 100) {
    return { tooMany: true };
  }

  if (validNumbers.length !== numbers.length) {
    return { invalidFormat: true };
  }
  return null;
}

// onMobileInputChange(): void {
//   const raw = this.quickCampaign.get('mobileNumbers')?.value || '';
//   const numbers = raw
//     .split(/[\n, ]+/)
//     .map((num: string) => num.trim().replace(/^\+/, ''))
//     .filter((num: string) => num !== '');

//   const validRegex = /^(?!1234567890)\d{10,14}$/;
//   const validNumbers = numbers.filter((num: string) => validRegex.test(num));
//   this.mobileCount = validNumbers.length;
// }

onMobileInputChange(): void {
  const control = this.quickCampaign.get('mobileNumbers');
  const raw = control?.value || '';

  const numbers = raw
    .split(/[\n, ]+/)
    .map((num: string) => num.trim().replace(/^\+/, ''))
    .filter((num: string) => num !== '');

  const validRegex = /^(?!1234567890)\d{10,14}$/;

  const validNumbers = numbers.filter((num: string) => validRegex.test(num));
  const invalidNumbers = numbers.filter((num: string) => !validRegex.test(num));

  this.mobileCount = validNumbers.length;

  /** collect existing errors or new object */
  const errors: any = control?.errors || {};

  /** 1️⃣ Too many numbers */
  if (validNumbers.length > 10000) {
    errors['tooMany'] = true;
  } else {
    delete errors['tooMany'];
  }

  /** 2️⃣ Invalid format validation */
  if (invalidNumbers.length > 0) {
    errors['invalidFormat'] = true;
  } else {
    delete errors['invalidFormat'];
  }

  /** Set final errors */
  control?.setErrors(Object.keys(errors).length === 0 ? null : errors);
}

// =============================================================================================


  getFormattedCampaignDateTime(): string {
    const formValues = this.quickCampaign.value;

    if (!formValues.campaignScheduledDateTime) return ""; // Handle null case

    const date = new Date(formValues.campaignScheduledDateTime);
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, "0"); // Ensure 2-digit month
    const day = String(date.getDate()).padStart(2, "0"); // Ensure 2-digit day

    // Get Time Inputs
    let hour = formValues.campaignHour || "12"; // Default hour if not selected
    const minute = formValues.campaignMinute || "00"; // Default minute
    const second = formValues.campaignSecond || "00"; // Default second
    // const meridian = formValues.campaignMeridian || "AM"; 

    // Construct Final String
    return `${year}-${month}-${day} ${hour}:${minute}:${second}`;
    // ${meridian}
  }
  onColumnSelect() {
    this.columnPhoneNo = this.quickCampaign.get("columnPhoneNo")?.value;
    //console.log(this.quickCampaign.get("columnPhoneNo")?.value);
    //console.log(this.columnPhoneNo);
  }

  get suggestionsFormArray(): FormArray {
    return this.templateForm.get("suggestions") as FormArray;
  }

getFile(): void {
    const selectedFile = this.quickCampaign.get('fileName')?.value;
    if (!selectedFile) {
      this.isPreUploadedFileSelected = false;
    } else {
      this.isPreUploadedFileSelected = true;
      this.isUploadFile = false;
    }
    if (selectedFile) {
      this.fileList = [];
      this.uploadedFileData = undefined;
      this.isUploded = false;
    }
    this.zipfilelist = [];
    this.disablesubmit = false;
    if (selectedFile) {
      const file = this.filenamelist.find(
        (f: any) => f.originalFileName === selectedFile
      );
      this.disablesubmit = true;
      this.isPreUploadedFileSelected = true;
      this.isUploadFile = false;
      if (selectedFile.includes('.zip')) {
        this.zipfilelist = file?.parsedFiles || [];
        const zipFile = this.zipfilelist.find(
          (f: any) => f.fileName === this.quickCampaign.get('zipFileName')?.value
        );
        this.key = zipFile?.headers;
      } else {
        this.getFileHeaders();
        this.quickCampaign.get('zipFileName')?.setValue(null);
      }
    }
    this.cdr.detectChanges();
  }

  getFileHeaders(): void {
       this.disablesubmit = true;
    const file = this.filenamelist.find(
      (f: any) => f.originalFileName === this.quickCampaign.get('fileName')?.value
      
    );
    console.log('getFileHeaders - Found file:', file);
    this.key = file?.parsedFiles?.map((parsedFile: any) => parsedFile.headers).flat() || [];
    console.log('Non-zip file headers:', this.key);
  }
  parseData(dt: any): ParsedFileInfo[] {
    const data = dt;
    return data.map((item: any) => {
      const parsedFiles = item.serverFileName.map((entry: string) => {
        const namePart = entry.split("[")[0].trim();
        const match = entry.match(/\[(.*?)\]/);
        const headers = match ? match[1].split(",").map((s) => s.trim()) : [];
        return {
          fileName: namePart,
          headers,
        };
      });

      return {
        originalFileName: item.fileName,
        parsedFiles,
        accessUrl: item.accessUrls,
      };
    });
  }
  readExcelFromAccessUrl(url: string) {
    this.http.get(url, { responseType: "blob" }).subscribe((blob) => {
      // Convert Blob to File (optional: provide original name and type)
      const file = new File([blob], this.quickCampaign.get("fileName")?.value, {
        type: blob.type,
      });
      //console.log(file);
      // Call your existing function
      this.readExcelFile(file);
    });
  }
  addSuggestion(): void {
    ////console.log(this.suggestionsFormArray.length)
    if (this.suggestionsFormArray.length <= 3) {
      this.suggestionsFormArray.push(
        this.fb.group({
          type: [{ value: "reply", disabled: true }, Validators.required],
          text: [
            { value: "", disabled: true },
            [Validators.required, Validators.maxLength(25)],
          ],
          postback: [
            { value: "", disabled: true },
            [Validators.required, Validators.maxLength(120)],
          ],
          url: [{ value: "", disabled: true }, [Validators.maxLength(120)]],
          phoneNumber: [{ value: "", disabled: true }],
          latitude: [{ value: "", disabled: true }],
          longitude: [{ value: "", disabled: true }],
          label: [{ value: "", disabled: true }],
          query: [{ value: "", disabled: true }],
          title: [{ value: "", disabled: true }],
          description: [{ value: "", disabled: true }],
          date: [{ value: "", disabled: true }],
          startTime: [{ value: "", disabled: true }],
          endTime: [{ value: "", disabled: true }],
          timeZone: [{ value: "", disabled: true }],
        })
      );
      // Show an error message or disable the button
    } else {
      return;
    }
  }
  onTabChange(selected: string): void {
    this.selectedTab = selected;
  }
onTabChangeIndex(index: number): void {
  const titles = ['Quick-Campaign', 'Bulk-Campaign'];
  this.selectedTabtype = titles[index];
  console.log(this.selectedTabtype);

  // Reset only the main tab-specific fields
  if (this.selectedTabtype === 'Quick-Campaign') {
    this.quickCampaign.patchValue({
      mobileNumbers: '',
      groupName: '',
    });
  }
  if (this.selectedTabtype === 'Bulk-Campaign') {
    this.quickCampaign.patchValue({
      fileName: '',
      zipFileName: '',
      columnPhoneNo: '',
    });
  }

  this.fileList = [];
  this.uploadedFileData = undefined;
  this.columnPhoneNo = undefined;
  this.previewData = [];
  this.isvisible = false;
  this.cdr.detectChanges();
}




  onSuggestionClick(postback: string) {
    ////console.log('Suggestion Clicked:', postback);
    // You can handle the postback action here (e.g., send it to an API)
  }
  nextCard() {
    this.carousel.next();
    this.selectedCardIndex = this.selectedCardIndex + 1;
  }

  prevCard() {
    this.carousel.pre();
    this.selectedCardIndex = this.selectedCardIndex - 1;
  }

  getFormattedExpiryDateTime(): string {
    const formValues = this.quickCampaign.value;

    if (!formValues.campaignExpiryDateTime) return ""; // Handle null case

    const date = new Date(formValues.campaignExpiryDateTime);
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, "0"); // Ensure 2-digit month
    const day = String(date.getDate()).padStart(2, "0"); // Ensure 2-digit day

    // Get Time Inputs
    let hour = formValues.expiryHour || "12"; // Default hour if not selected
    const minute = formValues.expiryMinute || "00"; // Default minute
    const second = formValues.expirySecond || "00"; // Default second
    // const meridian = formValues.expiryMeridian || "AM"; 

    // Construct Final String
    return `${year}-${month}-${day} ${hour}:${minute}:${second}`;
  }

  get splitPartArray(): FormArray {
    return this.splitPartForm.get("splitPart") as FormArray;
  }

  createSplitPart(): FormGroup {
    return this.fb.group({
      id: [this.splitPartArray.length, Validators.required], // Assigns dynamic ID
      from: ["", Validators.required],
      to: ["", Validators.required],
      hh: ["", Validators.required],
      mm: ["", Validators.required],
    });
  }

  addSplitPart(isDefault = false) {
    if (isDefault && this.splitPartArray.length === 0) {
      this.splitPartArray.push(this.createSplitPart()); // Add first entry
    } else {
      this.splitPartArray.push(this.createSplitPart()); // Add new entry
    }
  }

  removeSplitPart(index: number) {
    this.splitPartArray.removeAt(index);
    this.updateIds(); // ✅ Ensure IDs are updated after removal
  }

  loadCustomVariablesIntoForm(): void {
  // Check if customvariable is empty (no template selected)
  if (!this.isTemplateSelected()) {
    console.warn('No template selected. Please select a template first to load custom variables.');
    // Show a toast notification to the user
    this.toastService?.publishNotification('warning', 'Please select a template which have custom variables', 'warning');
    return;
  }

  const reservedFields = ['PhoneNo', 'message_id', 'conversation_id'];
  const uniqueFields = Array.from(
    new Set((this.customvariable || []).map(v => v.trim()))
  );
  const validCustomVariables = uniqueFields.filter(field => !reservedFields.includes(field));

  if (validCustomVariables.length === 0) {
    console.warn('No valid custom variables found after filtering reserved fields.');
    this.toastService?.publishNotification('warning', 'No custom variables available for this template', 'warning');
    return;
  }

  const bodyFieldGroups = validCustomVariables.map(variable =>
    this.createBodyField(variable, 'Map Column Value', '')
  );

  // Replace the form array
  this.quickCampaign.setControl('bodyFields', this.fb.array(bodyFieldGroups));
}

  // ✅ Update IDs dynamically after deletion
  updateIds() {
    this.splitPartArray.controls.forEach((control, index) => {
      control.get("id")?.setValue(index + 1);
    });
  }
  ngOnInit() {

 this.quickCampaign.get('fallback')?.valueChanges.subscribe(value => {
  if (value === 'Y') {
    this.quickCampaign.get('fallbackText')?.setValidators([Validators.required]);
    this.quickCampaign.get('smsApiEndpoint')?.setValidators([Validators.required]);
    this.isFallbackEnabled = true;
  } else {
    this.quickCampaign.get('fallbackText')?.clearValidators();
    this.quickCampaign.get('smsApiEndpoint')?.clearValidators();
    this.isFallbackEnabled = false;
  }
  this.quickCampaign.get('fallbackText')?.updateValueAndValidity();
  this.quickCampaign.get('smsApiEndpoint')?.updateValueAndValidity();
});

 this.quickCampaign.get('whatsapp')?.valueChanges.subscribe(value => {
  if (value === 'Y') {
    this.quickCampaign.get('fallbackTextwhatsapp')?.setValidators([Validators.required]);
    this.quickCampaign.get('whatsappApiEndpoint')?.setValidators([Validators.required]);
    this.isFallbackEnabledwhatsapp = true;
  } else {
    this.quickCampaign.get('fallbackTextwhatsapp')?.clearValidators();
    this.quickCampaign.get('whatsappApiEndpoint')?.clearValidators();
    this.isFallbackEnabledwhatsapp = false;
  }
  this.quickCampaign.get('fallbackTextwhatsapp')?.updateValueAndValidity();
  this.quickCampaign.get('whatsappApiEndpoint')?.updateValueAndValidity();
});


    this.isUploadFile = false;
    this.isPreUploadedFileSelected = false;
    let dt = {
      loggedInUserName: sessionStorage.getItem("USER_NAME"),
    };
    this.temp.getallbotdetail(dt).subscribe(
      (response: any) => {
        this.messageTemplate = [];
        if (response.data && response.data.bots) {
          this.botss = response.data.bots;
        } else {
          //console.error("Invalid API response:", response);
        }
      },
      (error) => {
        //console.error("Failed to fetch bot data:", error);
      }
    );
    // this.initializeForm();
    this.quickCampaign.get('groupId')?.valueChanges.subscribe(value => {
      console.log('Selected groupId:', value);
    });





this.loadGroups();
    this.hourList = Array.from({ length: 12 }, (_, i) =>
      (i + 1).toString().padStart(2, "0")
    );
    this.minutesList = Array.from({ length: 60 }, (_, i) =>
      i.toString().padStart(2, "0")
    );


    let data = {
      userName: sessionStorage.getItem("USER_NAME"),
    };

    this.domainService.viewDomain(data).subscribe({
      next: (result) => {
        //console.log("Full API Response:", result); // Log entire response
        this.listOfData = result.dataList;
        if (result.result === "Failed") {
          //console.error("API Error:", result.message);
        } else {
          //console.log("Extracted DataList:", result.dataList); // Log extracted dataList

          this.reportList = result.dataList;
        }
      },
      error: (error) => {
        //console.error("API Request Failed:", error);
      },
    });

    this.capmser.getChatBotNameList().subscribe({
      next: (res) => {
        // this.chatBotNames = res;
        this.chatBotNames = res.chatBotNames || [];

        //console.log(this.chatBotNames);
      },
      error: (err) => {
        //console.error(err);
      },
    });

    this.capmser.getAllFiles().subscribe({
      next: (res) => {
        this.filenamelist = this.parseData(res);
        //console.log(this.filenamelist);
      },
    });

    
    
    
  }


  // --------------------------------------------------------------------------------------------------------------------------------------
  onBotSelect(id: any) {


    this.selectedBotId12 = true;
    this.selectedBot =
      this.botss.find((bot: { botId: any }) => bot.botId === id) || null;
    this.botId = id;
    let dte = {
      loggedInUserName: sessionStorage.getItem("USER_NAME"),
      botId: id,
    };
    this.temp.editbotdetail(dte).subscribe({
      next: (response: any) => {
        if (response.result === "Success" && response.data?.botData) {
          const botData = response.data.botData;
          const creationData = botData.creationData.data;
          this.selectedColor = creationData.agentColor || "#000000";
          this.imageUrl = creationData.botLogoUrl || "";
          this.backgroundUrl = creationData.bannerLogoUrl || "";
          const botSummary = creationData.botDescription?.[0]?.botSummary || "";

          const formData = {
            botName: botData.botName,
            messageType: botData.botType,
            brandName: creationData.brandDetails?.brandName || "",
            color: this.selectedColor,
            primaryphone: creationData.bot?.phoneList?.[0]?.value || "",
            labelphone: creationData.bot?.phoneList?.[0]?.label || "",
            primarywebsite: creationData.bot?.websiteList?.[0]?.value || "",
            labelwebsite: creationData.bot?.websiteList?.[0]?.label || "",
            primaryemail: creationData.bot?.emailList?.[0]?.value || "",
            emailLabel: creationData.bot?.emailList?.[0]?.label || "",
            region: botData.creationData.region || "",
            // chatbotwebhook: creationData.rcsBot?.webhookUrl || '',
            privacypolicyurl: creationData.bot?.privacyUrl || "",
            Url: creationData.bot?.termsAndConditionsUrl || "",
            botSummary: botSummary,
            language: creationData.rcsBot?.languageSupported || "",
            // Store additional UI-related properties
            imageUrl: this.imageUrl,
            backgroundUrl: this.backgroundUrl,
          };

          // Store complete data in sessionStorage
          sessionStorage.setItem("botFormData", JSON.stringify(formData));

          // Patch the form with complete data
          this.validateForm.patchValue(formData);

          // Apply icon color after form is updated
          //setTimeout(() => this.applyIconColor(), 0);

          ////console.log('Form patched successfully:', this.validateForm.value);
        } else {
          //console.error("Invalid API response:", response);
        }
      },
      error: (error) => {
        //console.error("Failed to fetch bot details:", error);
      },
    });
    this.temp.getAllactiveTemplates(dte).subscribe({
      next: (res) => {
        this.messageTemplate = res.data.templateList;
      },
      error: (err) => (this.messageTemplate = []),
    });
  }

  getStatus(controlName: string): "error" | "success" | null {
    const control = this.quickCampaign.get(controlName);
    if (control?.touched && control?.invalid ) {
      return "error";
    }
    if (control?.valid) {
      return "success";
    }
    return null;
  }

  selecttemp(template: any) {
    this.selectedTemplate = template; 
    const selectedtemplate = template.templateTitle;
    if (selectedtemplate) {
      let data = {
        loggedInUserName: sessionStorage.getItem("USER_NAME"),
        templateName: selectedtemplate,
      };
      this.temp.templateDetail(data).subscribe(
        (res) => {
          if (res) {
            //console.log(res);
            this.templateType = res.type;
            const type = res.type;
            this.customvariable = res.customParams;
            console.log("custom params value"+this.customvariable)
            if (this.quickCampaign.get('selectvariablecolumn')?.value === 'Y') {
              // this.loadCustomVariablesIntoForm();
              // this.quickCampaign.reset();
           this.quickCampaign.get('mobileNumbers')?.reset();
           this.quickCampaign.get('selectvariablecolumn')?.setValue('N');
           this.quickCampaign.get('fallback')?.setValue('N');
          this.quickCampaign.get('whatsapp')?.setValue('N');
           this.quickCampaign.get('fallbackText')?.reset();
          this.quickCampaign.get('smsApiEndpoint')?.reset();
          this.quickCampaign.get('fallbackTextwhatsapp')?.reset();
          this.quickCampaign.get('whatsappApiEndpoint')?.reset();


              // window.location.reload();
            }
            
            // Initialize form with values
            if (type === "rich_card") {
              this.previewUrl = res.standAlone.mediaUrl;
              this.fileUrl = res.standAlone.mediaUrl;
              this.alignment = res.alignment;
              this.templateType = res.type;
              this.orientation = res.orientation;
              this.templateForm.patchValue({
                type: res.type,
                name: res.name,
                height: res.height,
                alignment: res.alignment,
                width: res.width,
                cardTitle: res.standAlone.cardTitle,
                messagecontent: res.textMessageContent,
                cardOrientation: res.orientation,
                cardDescription: res.standAlone.cardDescription,
                standAloneFileName: res.standAlone.mediaUrl,
                thumbnailFileName: res.standAlone.thumbnailFileName,
                meadiaUrl: res.standAlone.mediaUrl,
              });
              if (res.standAlone.suggestions) {
                const suggestionsArray = this.templateForm.get(
                  "suggestions"
                ) as FormArray;
                suggestionsArray.clear();
                res.standAlone.suggestions.forEach((suggestion: any) => {
                  suggestionsArray.push(
                    this.fb.group({
                      type: [
                        { value: suggestion.suggestionType, disabled: true },
                      ],
                      text: [{ value: suggestion.displayText, disabled: true }],
                      postback: [
                        { value: suggestion.postback, disabled: true },
                      ],
                      url: [{ value: suggestion.url, disabled: true }],
                      phoneNumber: [
                        { value: suggestion.phoneNumber, disabled: true },
                      ],
                      latitude: [
                        { value: suggestion.latitude, disabled: true },
                      ],
                      longitude: [
                        { value: suggestion.longitude, disabled: true },
                      ],
                      label: [{ value: suggestion.label, disabled: true }],
                      query: [{ value: suggestion.query, disabled: true }],
                      title: [{ value: suggestion.title, disabled: true }],
                      description: [
                        { value: suggestion.description, disabled: true },
                      ],
                      date: [{ value: suggestion.date, disabled: true }],
                    })
                  );
                });
              }
            }
            if (type === "carousel") {
              this.templateForm.patchValue({
                type: res.type,
                name: res.name,
                height: res.height,
                alignment: res.alignment,
                width: res.width,
              });

              this.suggestionsFormArray.clear();
              res.carouselList.forEach((item: any, index: number) => {
                this.carouselList[index].cardTitle = item.cardTitle;
                this.carouselList[index].cardDescription = item.cardDescription;
                this.carouselList[index].mediaUrl = item.mediaUrl;
                this.carouselList[index].suggestions = item.suggestions.map(
                  (suggestion: any) => ({
                    suggestionType: suggestion.suggestionType || "",
                    displayText: suggestion.displayText || "",
                    postback: suggestion.postback || "",
                    url: suggestion.url || "",
                    phoneNumber: suggestion.phoneNumber || "",
                    latitude: suggestion.latitude || null,
                    longitude: suggestion.longitude || null,
                    label: suggestion.label || "",
                    query: suggestion.query || "",
                    title: suggestion.title || "",
                    description: suggestion.description || "",
                    date: suggestion.date || "",
                  })
                );
              });
            }
            if (type === "text_message") {
              this.templateForm.patchValue({
                type: "TextMessage",
                name: res.name,
                messagecontent: res.textMessageContent,
              });
              if (res.suggestion) {
                const suggestionsArray = this.templateForm.get(
                  "suggestions"
                ) as FormArray;
                suggestionsArray.clear();
                res.suggestion.forEach((suggestion: any) => {
                  suggestionsArray.push(
                    this.fb.group({
                      type: [
                        { value: suggestion.suggestionType, disabled: true },
                      ],
                      text: [{ value: suggestion.displayText, disabled: true }],
                      postback: [
                        { value: suggestion.postback, disabled: true },
                      ],
                      url: [{ value: suggestion.url, disabled: true }],
                      phoneNumber: [
                        { value: suggestion.phoneNumber, disabled: true },
                      ],
                      latitude: [
                        { value: suggestion.latitude, disabled: true },
                      ],
                      longitude: [
                        { value: suggestion.longitude, disabled: true },
                      ],
                      label: [{ value: suggestion.label, disabled: true }],
                      query: [{ value: suggestion.query, disabled: true }],
                      title: [{ value: suggestion.title, disabled: true }],
                      description: [
                        { value: suggestion.description, disabled: true },
                      ],
                      date: [{ value: suggestion.date, disabled: true }],
                    })
                  );
                });
              }
            }
            if (type === "text_message_with_pdf") {
              this.templateForm.patchValue({
                type: "text_message_with_pdf",
                name: res.name,
                messagecontent: res.textMessageContent,
                documentFileName: res.documentFileName,
                messageOrder:
                  res.messageOrder === "text_message_at_top"
                    ? "textTop"
                    : "textBottom",
              });
            }
            // ////console.log('Form patched successfully:', this.templateForm.value);
          } 
          
          else {
            //console.error("Invalid API response:", res);
          }
        },
      );
    } else {
       
    }
  }

  // get isFallbackEnabled() {
  //   return this.quickCampaign.get('fallback')?.value === 'yes';
  // }

  // onFileSelected(event: any) {
  //   this.selectedFile = event.target.files[0];
  // }

  updateValue(i: number) {
    const selectedCard = this.carouselList[i];

    // Update the selected card index
    this.selectedCardIndex = i;

    // Unsubscribe from the previous valueChanges subscription (if exists)
    if (this.valueChangesSubscription) {
      this.valueChangesSubscription.unsubscribe();
    }

    // Clear and populate the suggestionsFormArray dynamically
    this.suggestionsFormArray.clear();
    selectedCard.suggestions.forEach((suggestion) => {
      this.suggestionsFormArray.push(
        this.fb.group({
          type: [{ value: suggestion.suggestionType, disabled: true }],
          text: [{ value: suggestion.displayText, disabled: true }],
          postback: [{ value: suggestion.postback, disabled: true }],
          url: [{ value: suggestion.url, disabled: true }],
          phoneNumber: [{ value: suggestion.phoneNumber, disabled: true }],
          latitude: [{ value: suggestion.latitude, disabled: true }],
          longitude: [{ value: suggestion.longitude, disabled: true }],
          label: [{ value: suggestion.label, disabled: true }],
          query: [{ value: suggestion.query, disabled: true }],
          title: [{ value: suggestion.title, disabled: true }],
          description: [{ value: suggestion.description, disabled: true }],
          date: [{ value: suggestion.date, disabled: true }],
          startTime: [{ value: suggestion.startTime, disabled: true }],
          endTime: [{ value: suggestion.endTime, disabled: true }],
          timeZone: [{ value: suggestion.timeZone, disabled: true }],
        })
      );
    });

    // Patch the form with selected card data
    this.templateForm.patchValue({
      cardTitle: selectedCard.cardTitle,
      cardDescription: selectedCard.cardDescription,
    });

    // Subscribe to form changes dynamically and update the corresponding card
    this.valueChangesSubscription = this.templateForm.valueChanges.subscribe(
      (values) => {
        if (this.selectedCardIndex !== null) {
          // const updatedSuggestions = this.suggestionsFormArray.getRawValue();
          // ////console.log(updatedSuggestions)
          // Update the selected card in the carousel list
          this.carouselList[this.selectedCardIndex] = {
            ...this.carouselList[this.selectedCardIndex],
            cardTitle: values.cardTitle,
            cardDescription: values.cardDescription,
            suggestions: this.transformSuggestions(
              this.suggestionsFormArray.getRawValue()
            ),
          };
        }
      }
    );
  }

  transformSuggestions(suggestions: any[]): any[] {
    return suggestions.map((suggestion) => {
      switch (suggestion.type) {
        case "url_action":
          return {
            suggestionType: "url_action",
            url: suggestion.url,
            displayText: suggestion.text,
            postback: suggestion.postback,
          };
        case "dialer_action":
          return {
            suggestionType: "dialer_action",
            phoneNumber: suggestion.phoneNumber,
            displayText: suggestion.text,
            postback: suggestion.postback,
          };

        case "view_location_latlong":
          return {
            suggestionType: "view_location_latlong",
            Latitude: suggestion.latitude,
            Longitude: suggestion.longitude,
            postback: suggestion.postback,
            displayText: suggestion.text,
            label: suggestion.Label,
          };

        case "reply":
          return {
            suggestionType: "reply",
            displayText: suggestion.text,
            postback: suggestion.postback,
            //Query: suggestion.Query
          };
        case "view_location_query":
          return {
            suggestionType: "view_location_query",
            displayText: suggestion.text,
            postback: suggestion.postback,
            query: suggestion.query,
          };

        case "share_location":
          return {
            suggestionType: "share_location",
            displayText: suggestion.text,
            postback: suggestion.postback,
          };
        case "calendar_event":
          let date = suggestion.date;
          ////console.log(date)
          return {
            suggestionType: "calendar_event",
            displayText: suggestion.text,
            postback: suggestion.postback,
            startTime: this.formatDate(suggestion.startTime),
            endTime: this.formatDate(suggestion.endTime),
            title: suggestion.title,
            description: suggestion.description,
            timeZone: suggestion.timeZone,
          };
        // Add other cases for different suggestion types
        default:
          return {
            suggestionType: suggestion.type,
            displayText: suggestion.text,
            postback: suggestion.postback,
          };
      }
    });

    // messageBody
  }
  formatDate(isoDate: string): string {
    let date = new Date(isoDate);

    let year = date.getFullYear();
    let month = String(date.getMonth() + 1).padStart(2, "0");
    let day = String(date.getDate()).padStart(2, "0");
    let hours = String(date.getHours()).padStart(2, "0");
    let minutes = String(date.getMinutes()).padStart(2, "0");
    let seconds = String(date.getSeconds()).padStart(2, "0");

    return `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`;
  }
  beforeUpload = (file: NzUploadFile): boolean => {
    const allowedExtensions = ["txt", "xlsx", "csv", "xls"];
    const extension = file.name?.split(".").pop()?.toLowerCase();
    if (!extension || !allowedExtensions.includes(extension)) {
      // this.message.error('Allowed file types: .txt, .xlsx, .csv, .xls');
      this.toastService.publishNotification(
        "error",
        "'Allowed file types: .xlsx, .csv, .xls'"
      );
      return false;
    }
    return true;
  };

  handleChange(event: NzUploadChangeParam): void {
    const { file } = event;
    this.isUploded = true;
    if (file.status === "uploading") {
    } else if (file.status === "done") {
      if (file.response.result === "Success") {
        this.disableuploadbutton = false;
        this.toastService.publishNotification(
          "success",
          "File uploaded successfully",
          "success"
        );
        this.uploadedBulkfileName = file.response.data.uploadedDynamicfileName;
        this.isUploded = true;
        this.disabled = true;
        this.quickCampaign.get('fileName')?.setValue(file.name); // Set value to disable upload button
        this.isUploadFile = true;
        this.isPreUploadedFileSelected = false; // Ensure submit button is hidden after upload
      }
      if (file.response.result === "Failure") {
        this.toastService.publishNotification(
          "error",
          file.response.message,
          "error"
        );
        return;
      }
      // Only keep the latest file
      this.fileList = [file];
      if (file.originFileObj) {
        this.readExcelFile(file.originFileObj);
      }
    } else if (file.status === "error") {
      this.toastService.publishNotification("File Upload", "Failed");
    }
  }
  onFileRemove = (file: NzUploadFile): boolean => {
    if (this.quickCampaign && this.quickCampaign.get('fileName') && this.quickCampaign.get('zipFileName')) {
      this.quickCampaign.get('fileName')!.enable();
      this.quickCampaign.get('zipFileName')!.enable();
      this.quickCampaign.get('fileName')!.reset();
      this.quickCampaign.get('zipFileName')!.reset(); // Optional
    }
    this.quickCampaign.get('fileName')?.setValue(null);
    this.quickCampaign.get('zipFileName')?.setValue(null);
    this.fileList = [];
    this.disabled = false;
    this.isUploadFile = false;
    this.isPreUploadedFileSelected = false;
    return true;
  };  readExcelFile(file: File): void {
    const reader: FileReader = new FileReader();

    reader.onload = (e: any) => {
      const binaryData = e.target.result;
      const workbook: XLSX.WorkBook = XLSX.read(binaryData, { type: "binary" });

      // Read first sheet
      const sheetName: string = workbook.SheetNames[0];
      const sheetData: XLSX.WorkSheet = workbook.Sheets[sheetName];

      // Convert to JSON
      const excelData = XLSX.utils.sheet_to_json(sheetData);
      this.uploadedFileData = excelData.slice(0, 2);
      this.key = Object.keys(excelData[0] as object);
      ////console.log(this.uploadedFileData);
    };

    reader.readAsBinaryString(file);
  }

  sortUrlConverter(
    phoneNo: string,
    domain: string,
    longUrl: string
  ): Promise<void> {
    return new Promise((resolve, reject) => {
      const dt = {
        loggedInUserName: sessionStorage.getItem("USER_NAME"),
        previewData: [
          {
            mobile: phoneNo.toString(),
            domain,
            longUrlField: longUrl,
          },
        ],
      };

      this.capmser.sortUrlConverter(dt).subscribe({
        next: (res) => {
          const uniqueKey = this.quickCampaign.get("columnPhoneNo")?.value;
          const longUrlKey = this.quickCampaign.get("columnLongUrl")?.value;

          if (
            uniqueKey &&
            longUrlKey &&
            (res as any).previewData?.[0]?.shortenedUrl
          ) {
            this.uploadedFileData = this.uploadedFileData.map((item: any) => {
              if (item[uniqueKey] === phoneNo && item[longUrlKey]) {
                return {
                  ...item,
                  [longUrlKey]:
                    (res as any).previewData?.[0]?.shortenedUrl || "",
                };
              }
              return item;
            });
          }

          resolve(); // ✅ Resolve only after async operation completes
        },
        error: reject, // 🔴 Handle errors
      });
    });
  }

  updateMessageContent(): void {
    try {
      console.log('updateMessageContent() started', { uploadedFileData: this.uploadedFileData });
      if (!this.uploadedFileData || this.uploadedFileData.length === 0) {
        console.warn('No uploaded file data');
        this.generatePreviewData();
        return;
      }

      const domain = this.quickCampaign.get("domain")?.value;
      const longUrlField = this.quickCampaign.get("columnLongUrl")?.value;
      console.log('Domain:', domain, 'LongUrlField:', longUrlField);

      this.previewData = [];
      if (longUrlField && domain) {
        const promises = this.uploadedFileData.map((row: any) => {
          const value = row[longUrlField];
          const phoneNo = row[this.columnPhoneNo];
          console.log('Processing row for URL:', { phoneNo, value });
          return this.sortUrlConverter(phoneNo, domain, value);
        });

        Promise.all(promises).then((results) => {
          console.log('All URLs converted:', results);
          this.generatePreviewData();
        }).catch(error => {
          console.error('Error converting URLs:', error);
          this.toastService?.publishNotification('error', 'Failed to convert URLs', 'error');
          this.generatePreviewData(); // Fallback
        });
      } else {
        console.log('No domain or longUrlField, generating preview directly');
        this.generatePreviewData();
      }
    } catch (error) {
      console.error('Error in updateMessageContent():', error);
      this.toastService?.publishNotification('error', 'Failed to update message content', 'error');
      this.generatePreviewData(); // Fallback
    }
  }

    uploadFile(event: any): void {
    const file = event.target.files[0];
    if (file) {
      const formData = new FormData();
      formData.append('file', file);
      this.http.post('http://localhost:3002/upload', formData).subscribe(
        (response: any) => {
          this.uploadedFileData = response.data || []; // Adjust based on response
          this.isUploded = true;
          console.log('File uploaded, data:', this.uploadedFileData);
        },
        error => console.error('Upload failed:', error)
      );
    }
  }

// Helper to get all static values as a map
private getStaticValuesMap(): { [key: string]: string } {
  const bodyFields = this.quickCampaign.get('bodyFields') as FormArray;
  if (!bodyFields) return {};
  const staticMap: { [key: string]: string } = {};
  bodyFields.controls.forEach((group) => {
    if (group.get('valueType')?.value === 'Static') {
      const variable = group.get('variable')?.value;
      const value = group.get('value')?.value;
      if (variable && value) {
        staticMap[variable] = value;
      }
    }
  });
  return staticMap;
}

private generatePreviewData(mode?: 'quick'): void {
  try {
    console.log('generatePreviewData() started');
    this.previewData = [];

    // Get all static values as a map
    const staticValuesMap = this.getStaticValuesMap();

    if (mode === 'quick') {
      // --- Quick-Campaign preview logic ---
      let dataToProcess: any[] = [];
      const mobileNumbersValue = this.quickCampaign.get('mobileNumbers')?.value?.trim();
      const groupId = this.quickCampaign.get('groupName')?.value?.trim();
      if (mobileNumbersValue) {
        const mobileNumbers = mobileNumbersValue
          .split(/[\n, ]+/)
          .map((num: string) => num.trim())
          .filter((num: any) => num);
        dataToProcess = mobileNumbers.slice(0, 2).map((num: any) => ({ phoneNo: num }));
      } else if (groupId && this.groupNumbers && this.groupNumbers.length > 0) {
        dataToProcess = this.groupNumbers.slice(0, 2).map((item: any) => ({
          phoneNo: item.contactNumber,
          contactName: item.contactName
        }));
      }
      if (dataToProcess.length === 0) {
        console.warn('No valid data to process for preview');
        this.disable = false;
        this.cdr.detectChanges();
        return;
      }

      dataToProcess.forEach((row: any) => {
        try {
          const phoneNo = row.phoneNo;
          if (!phoneNo) {
            console.warn('Skipping row with missing phoneNo:', row);
            return;
          }
          const updatedRow = { ...row };
          let cardTitle = this.templateForm.get('cardTitle')?.value || '';
          let cardDescription = this.templateForm.get('cardDescription')?.value || '';
          let messageContent = this.templateForm.get('messagecontent')?.value || '';

          // Replace placeholders with static values if available, otherwise fall back to row data
          const placeholderRegex = /\[(.*?)\]/g;
          cardTitle = cardTitle.replace(placeholderRegex, (match: string, p1: string) => {
            if (staticValuesMap[p1]) return staticValuesMap[p1];
            if (updatedRow[p1]) return updatedRow[p1];
            return match;
          });
          cardDescription = cardDescription.replace(placeholderRegex, (match: string, p1: string) => {
            if (staticValuesMap[p1]) return staticValuesMap[p1];
            if (updatedRow[p1]) return updatedRow[p1];
            return match;
          });
          messageContent = messageContent.replace(placeholderRegex, (match: string, p1: string) => {
            if (staticValuesMap[p1]) return staticValuesMap[p1];
            if (updatedRow[p1]) return updatedRow[p1];
            return match;
          });

          const suggestionTexts = this.buildSuggestions(updatedRow, staticValuesMap);
          if (this.templateType === 'rich_card' || this.templateType === 'text_message' || this.templateType === 'text_message_with_pdf') {
            this.previewData.push({
              phoneNo,
              cardtittel: this.templateType === 'rich_card' ? cardTitle : null,
              cardDec: this.templateType === 'rich_card' ? cardDescription : null,
              messageContent: this.templateType === 'text_message' || this.templateType === 'text_message_with_pdf' ? messageContent : '',
              suggestionstext: suggestionTexts,
              carouselList: [],
            });
          }
          if (this.templateType === 'carousel') {
            const updatedCarouselList = this.carouselList.map((item) => {
              let newCardTitle = item.cardTitle;
              let newCardDesc = item.cardDescription;
              let newMediaUrl = item.mediaUrl;
              if (newCardTitle) newCardTitle = newCardTitle.replace(placeholderRegex, (match: string, p1: string) => staticValuesMap[p1] || updatedRow[p1] || match);
              if (newCardDesc) newCardDesc = newCardDesc.replace(placeholderRegex, (match: string, p1: string) => staticValuesMap[p1] || updatedRow[p1] || match);
              if (newMediaUrl) newMediaUrl = newMediaUrl.replace(placeholderRegex, (match: string, p1: string) => staticValuesMap[p1] || updatedRow[p1] || match);
              const updatedSuggestions = item.suggestions?.map((s) => {
                let displayText = s.displayText;
                if (displayText) displayText = displayText.replace(placeholderRegex, (match: string, p1: string) => staticValuesMap[p1] || updatedRow[p1] || match);
                return { ...s, displayText };
              }) || [];
              return {
                cardTitle: newCardTitle,
                cardDescription: newCardDesc,
                mediaUrl: newMediaUrl,
                suggestions: updatedSuggestions,
              };
            });
            this.previewData.push({
              phoneNo,
              cardtittel: null,
              cardDec: null,
              messageContent: null,
              suggestionstext: [],
              carouselList: updatedCarouselList,
            });
          }
        } catch (error) {
          console.error('Error processing row:', row, error);
        }
      });
      console.log('generatePreviewData() finished', this.previewData);
      this.disable = false;
      this.cdr.detectChanges();
      return;
    }

    // --- File upload preview logic ---
    if (!this.uploadedFileData || !Array.isArray(this.uploadedFileData)) {
      console.warn('uploadedFileData is invalid:', this.uploadedFileData);
      this.disable = false;
      return;
    }
    this.uploadedFileData.forEach((row: any) => {
      try {
        const phoneNo = row[this.columnPhoneNo];
        if (!phoneNo) {
          console.warn('Skipping row with missing phoneNo:', row);
          return;
        }
        const updatedRow = { ...row };
        let cardTitle = this.templateForm.get('cardTitle')?.value || '';
        let cardDescription = this.templateForm.get('cardDescription')?.value || '';
        let messageContent = this.templateForm.get('messagecontent')?.value || '';

        const placeholderRegex = /\[(.*?)\]/g;
        cardTitle = cardTitle.replace(placeholderRegex, (match: string, p1: string) => {
          if (staticValuesMap[p1]) return staticValuesMap[p1];
          if (row[p1]) return row[p1];
          return match;
        });
        cardDescription = cardDescription.replace(placeholderRegex, (match: string, p1: string) => {
          if (staticValuesMap[p1]) return staticValuesMap[p1];
          if (row[p1]) return row[p1];
          return match;
        });
        messageContent = messageContent.replace(placeholderRegex, (match: string, p1: string) => {
          if (staticValuesMap[p1]) return staticValuesMap[p1];
          if (row[p1]) return row[p1];
          return match;
        });

        const suggestionTexts = this.buildSuggestions(row, staticValuesMap);
        if (this.templateType === 'rich_card' || this.templateType === 'text_message' || this.templateType === 'text_message_with_pdf') {
          this.previewData.push({
            phoneNo,
            cardtittel: this.templateType === 'rich_card' ? cardTitle : null,
            cardDec: this.templateType === 'rich_card' ? cardDescription : null,
            messageContent: this.templateType === 'text_message' || this.templateType === 'text_message_with_pdf' ? messageContent : '',
            suggestionstext: suggestionTexts,
            carouselList: [],
          });
        }
        if (this.templateType === 'carousel') {
          const updatedCarouselList = this.carouselList.map((item) => {
            let newCardTitle = item.cardTitle;
            let newCardDesc = item.cardDescription;
            let newMediaUrl = item.mediaUrl;
            if (newCardTitle) newCardTitle = newCardTitle.replace(placeholderRegex, (match: string, p1: string) => staticValuesMap[p1] || updatedRow[p1] || match);
            if (newCardDesc) newCardDesc = newCardDesc.replace(placeholderRegex, (match: string, p1: string) => staticValuesMap[p1] || updatedRow[p1] || match);
            if (newMediaUrl) newMediaUrl = newMediaUrl.replace(placeholderRegex, (match: string, p1: string) => staticValuesMap[p1] || updatedRow[p1] || match);
            const updatedSuggestions = item.suggestions?.map((s) => {
              let displayText = s.displayText;
              if (displayText) displayText = displayText.replace(placeholderRegex, (match: string, p1: string) => staticValuesMap[p1] || updatedRow[p1] || match);
              return { ...s, displayText };
            }) || [];
            return {
              cardTitle: newCardTitle,
              cardDescription: newCardDesc,
              mediaUrl: newMediaUrl,
              suggestions: updatedSuggestions,
            };
          });
          this.previewData.push({
            phoneNo,
            cardtittel: null,
            cardDec: null,
            messageContent: null,
            suggestionstext: [],
            carouselList: updatedCarouselList,
          });
        }
      } catch (error) {
       console.error('Error processing row:', row, 'Educator error');
      }
    });
    console.log('generatePreviewData() finished', this.previewData);
    this.disable = false;
    this.cdr.detectChanges();
  } catch (error) {
    console.error('Error in generatePreviewData():', error);
    this.toastService?.publishNotification('error', 'Failed to generate preview data', 'error');
    this.disable = false;
  }
}

// Update buildSuggestions to accept staticValuesMap
private buildSuggestions(row: any, staticValuesMap?: { [key: string]: string }): string[] {
  const suggestionsArray = this.templateForm.get("suggestions") as FormArray;
  const result: string[] = [];

  suggestionsArray?.controls.forEach((control) => {
    let textVal = control.get("text")?.value;
    if (!textVal) return;

    const placeholderRegex = /\[(.*?)\]/g;
    textVal = textVal.replace(placeholderRegex, (match: string, p1: string) => {
      if (staticValuesMap && staticValuesMap[p1]) return staticValuesMap[p1];
      if (row[p1]) return row[p1];
      return match;
    });

    if (!result.includes(textVal)) result.push(textVal);
  });

  return result.length ? result : this.getDefaultSuggestions();
}

open(): void {
   if (this.quickCampaign.invalid) {
      this.quickCampaign.markAllAsTouched();
      this.toastService.publishNotification(
        'error',
        'Please fill out all required fields correctly.','error'
        
      );
      return;
    }
  if (this.isPreUploadedFileSelected) {
    return;
  }
  if (this.isUploadFile && (!this.uploadedFileData || this.uploadedFileData.length === 0)) {
    this.toastService.publishNotification('warning', 'Please Upload File', 'warning');
    return;
  }
  // Restore this validation:
  const columnPhoneNo = this.quickCampaign.get('columnPhoneNo')?.value;
  if (this.isUploadFile && (!columnPhoneNo || columnPhoneNo === '')) {
    this.toastService.publishNotification('warning', 'Please Select Phone Number Column', 'warning');
    return;
  }
  if (this.isUploadFile && this.uploadedFileData && this.uploadedFileData.length > 0) {
    this.generatePreviewData();
    this.isvisible = true;
    this.cdr.detectChanges();
    return;
  }
  const mobileNumbersControl = this.quickCampaign.get('mobileNumbers');
  if (mobileNumbersControl?.touched && mobileNumbersControl?.errors?.['invalidFormat']) {
    this.toastService.publishNotification(
      'error',
      'Please enter only valid numeric mobile numbers. Avoid alphabets or special characters.',
      'Invalid Mobile Numbers'
    );
    return; // Prevent further execution
  }
  try {
    console.log('open() called', { quickCampaign: this.quickCampaign, isUploded: this.isUploded });
    if (!this.quickCampaign) {
      console.error('quickCampaign is undefined or null');
      this.toastService?.publishNotification('error', 'Form is not initialized', 'error');
      return;
    }
    // --- Quick-Campaign validation and preview logic ---
    if (this.selectedTabtype === 'Quick-Campaign') {
      const mobileNumbersValue = this.quickCampaign.get('mobileNumbers')?.value?.trim();
      const groupId = this.quickCampaign.get('groupName')?.value?.trim();
      // If both are empty, show warning and return
      if (!mobileNumbersValue && !groupId) {
        this.toastService?.publishNotification('warning', 'Please enter mobile number(s) or select a group', 'warning');
        return;
      }
      // If group is selected, fetch numbers and then preview
      if (groupId && (!this.groupNumbers || this.groupNumbers.length === 0)) {
        this.fetchNumbersInGroup(groupId, () => {
          this.generatePreviewData('quick');
          this.isvisible = true;
          this.cdr.detectChanges();
        });
        return; // Wait for async fetch
      }
      // If mobileNumbers is filled or groupNumbers already loaded
      this.generatePreviewData('quick');
      this.isvisible = true;
      this.cdr.detectChanges();
      return;
    }
    // --- End Quick-Campaign logic ---
    // --- File upload preview logic (restore previous logic) ---
    if (!this.isUploded) {
      console.log('File not uploaded');
      this.toastService?.publishNotification('warning', 'Please Upload File', 'warning');
      return;
    }
    const columnPhoneNo = this.quickCampaign.get('columnPhoneNo')?.value;
    console.log('columnPhoneNo value:', columnPhoneNo);
    if (columnPhoneNo === '' || columnPhoneNo == null) {
      console.log('Phone number column not selected');
      this.toastService?.publishNotification('warning', 'Please Select Phone Number Column', 'warning');
      return;
    }
    this.columnPhoneNo = columnPhoneNo; 
    console.log('All validations passed, setting isvisible to true');
    this.isvisible = true;
    this.cdr.detectChanges();
    console.log('Calling generatePreviewData()');
    this.generatePreviewData();
    console.log('generatePreviewData() completed');
  } catch (error) {
    console.error('Error in open() function:', error);
    this.toastService?.publishNotification('error', 'An unexpected error occurred', 'error');
  }
}




  close(): void {
    this.isvisible = false;
  }

  private getDefaultSuggestions(): string[] {
    return this.suggestionsFormArray.getRawValue().map((s) => s.text || "");
  }

  checkCampainName() {
    
    const campaignName = this.quickCampaign.get("campaignName")?.value;
    
    this.capmser.chekCampaignName(campaignName).subscribe({
      next: (res) => {
      //console.log(res)
      this.error=res.available;
      // this.quickCampaign.get("campaignName")?.setErrors({ incorrect: true });
      // this.quickCampaign.get("campaignName")?.markAsTouched();
      if(res.available === false){
        this.quickCampaign.get("campaignName")?.setErrors({ incorrect: true });
        this.quickCampaign.get("campaignName")?.markAsTouched();
        this.quickCampaign.get("campaignName")?.markAsDirty();

      }
      
      
      }
    });
  }
  handleUpload(info: NzUploadChangeParam): void {
    // // Avoid multiple calls during processing
    // if (this.isUploading) return;
    // const currentFile = info.fileList[0]?.originFileObj;
    // if (!currentFile || info.file.status !== 'uploading') return;
    // this.isUploading = true; // Set flag to block concurrent calls
    // const formData = new FormData();
    // formData.append('file', currentFile);
    // formData.append('userName', sessionStorage.getItem('USER_NAME') || '');
    // formData.append('campaignName', this.quickCampaign.value.campaignName || '');
    // formData.append('msgType', 'Dynamic');
    // formData.append('fileType', 'Dynamic');
    // this.capmser.uploadDynamicMessageFile(formData).subscribe({
    //   next: (data: any) => {
    //     if (data?.data?.uploadedDynamicfileName) {
    //       this.uploadedBulkfileName = data.data.uploadedDynamicfileName;
    //       this.toastService.publishNotification("File Upload", "Successfully");
    //       this.fileList = []; // Clear file list after success
    //     }
    //     this.isUploading = false; // Reset flag
    //   },
    //   error: (error: any) => {
    //     //console.error('API Error:', error);
    //     this.toastService.publishNotification("File Upload", "Failed");
    //     this.isUploading = false; // Reset flag
    //   }
    // });
  }

  onSubmit() {
   


    if (this.quickCampaign.invalid) {
      this.quickCampaign.markAllAsTouched();
      this.toastService.publishNotification(
        'error',
        'Please fill out all required fields correctly.','error'
        
      );
      return;
    }



       this.isDisabled = true;

    const formValues = this.quickCampaign.value;
    const getCampaignScheduledDateTime = () => {
      return this.selectedTab === "Run Now"
        ? format(new Date(), "yyyy-MM-dd HH:mm:ss")
        : this.getFormattedCampaignDateTime();
    };
    const groupName = formValues.groupName || "";
      const payload: any = {
        campaignName: formValues.campaignName,
     uploadedBulkfileName: this.uploadedBulkfileName
  ? this.uploadedBulkfileName
  : (formValues.fileName
      ? [formValues.fileName.includes(".zip") ? formValues.zipFileName : formValues.fileName]
      : null),
        templateName: formValues?.selectedTemplate?.templateTitle || "",
        groupName: groupName,
        templateId: formValues?.selectedTemplate?.templateId,
        botId: formValues?.botIds,
        botName: this.selectedBot.botName,
mobileNumbers: formValues.mobileNumbers
  ? formValues.mobileNumbers
      .split(/[\n, ]+/)
      .map((num: string) =>
        num
          .trim()
          .replace(/^\+?91/, '') // remove +91 or 91
          .replace(/^0/, '')     // remove leading 0
          .replace(/^\+/, '')    // remove any other +
      )
      .filter((num: string) => num !== '' && /^\d+$/.test(num))
  : this.mobileNumArray?this.mobileNumArray: [],

        // isSmsFallback: formValues.fallback,
        // isWhatsappFallback: formValues.whatsapp,
        // fallbackSms: formValues.fallbackText,
        // fallbackWhatsapp: formValues.fallbackTextwhatsapp,
        selectvariablecolumn: formValues.selectvariablecolumn,
        // smsApiEndpoint: formValues.smsApiEndpoint,
        // whatsappApiEndpoint: formValues.whatsappApiEndpoint,
        timeZone: formValues?.datepicker || format(new Date(), "yyyy-MM-dd"),
        isCampaignScheduled: this.selectedTab === "Run Now" ? "No" : "Yes",
        campaignScheduledDateTime: getCampaignScheduledDateTime(),
        campaignExpiryDateTime: this.getFormattedExpiryDateTime(),
        username: sessionStorage.getItem("USER_NAME"),
        hasCampaignExpiry: this.checked ? "Yes" : "No",
        campaignDate: getCampaignScheduledDateTime(),
        mobileNumberParamName: formValues.columnPhoneNo,
        convertShortUrl: formValues.shortUrl,
        longUrlColumn: formValues.columnLongUrl,
        userDomain: formValues.domain,
        callbackUrl: formValues.callbackUrl,
        isConversationalCampaign: formValues.isConversationalCampaign,
        chatbotName: formValues.chatbotName,
       selectvariablecolumnMap: []
      };

if (formValues.selectvariablecolumn === 'Y') {
  const selectvariablecolumnMap = this.bodyFields.controls.map(group => ({
    variable: group.get('variable')?.value,
    valueType: group.get('valueType')?.value,
    value: group.get('value')?.value
  }));
  payload.selectvariablecolumnMap = selectvariablecolumnMap; 
}
      if (this.quickCampaign.valid) {
        this.ngxLoader.start(); 
        this.capmser.getCampaign(payload).subscribe({
        next: (res) => {
          this.ngxLoader.stop(); 
          
          this.toastService.publishNotification(
            "success",
            res.message,
            "success"
          );
          this.quickCampaign.reset();
          this.router.navigate(["/quick-campaign"]);
          this.isDisabled = false;
        },
        error: (err) => {
          this.ngxLoader.stop(); // ✅ Stop loader
          this.toastService.publishNotification(
            "error",
            err.error.message || err.error || "An error occurred",
            "error"
            );
          this.isDisabled = false;
        },
      });
      } 
    
  }


  textData(event: any) {
    this.numberprivew = event.target.value;
  }
  messageData(events: any) {
    this.mssageprivew = events.target.value;
  }

  formatMessageBody(text: string, limit: number = 26): string[] {
    if (!text) return [];

    // Split text into chunks of 'limit' characters, without breaking words
    const result: string[] = [];
    let index = 0;

    // Continue until all characters are processed
    while (index < text.length) {
      // Slice the string from the current index to the next 'limit' number of characters
      result.push(text.slice(index, index + limit));
      index += limit;
    }

    return result;
  }
  checkcapability() {
    let dt = {
      loggedInUserName: sessionStorage.getItem("USER_NAME"),
      number: this.checkcapabilityform.value.Mobile_Number,
      botId: "1x0kiKmR0Sd1WJuU",
    };
    this.capmser.checkcapability(dt).subscribe({
      next: (res) => {
        this.toastService.publishNotification(
          "success",
          res.message,
          "success"
        );
        this.quickCampaign.reset();

        // Initialize capabilities array
        this.capabilities = [];

        // Check if response contains data
        if (res.data && res.data.response) {
          try {
            // Fix the incorrectly formatted JSON string
            let fixedJsonString = res.data.response
              .replace(/"{/g, "{")
              .replace(/}"/g, "}")
              .replace(/\\"/g, '"');

            // Parse JSON correctly
            let parsedResponse = JSON.parse(fixedJsonString);

            // Extract features array
            this.capabilities = parsedResponse.features || [];
          } catch (e) {
            //console.error("Error parsing response:", e);
          }
        }
      },
      error: (err) =>
        this.toastService.publishNotification(
          "error",
          err.error.error,
          "error"
        ),
    });
  }

showModal(): void {
  console.log('Phone List:', this.phoneList); // Debug output
  this.isModalVisible = true;
}


  handleCancel(): void {
    this.isModalVisible = false;
  }

downloadExcel(): void {
  const link = document.createElement('a');
 link.href = './assets/file.xlsx';  // ✅ Correct path
  // 
  link.download = 'SampleFilee.XLSX'; // ✅ Set the download name
  link.target = '_blank'; // Optional: in case of security restrictions
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}

loadGroups(): void {
    const loggedInUserName = sessionStorage.getItem('USER_NAME');
    if (loggedInUserName) {
      this.phonebookService.getAllGroupsList({ loggedInUserName }).subscribe(
        (response) => {
          this.groups = response.data.groupList.map((group: any) => ({
            groupId: group.groupId,
            groupName: group.groupName
          }));
          console.log('Loaded groups:', this.groups);
        },
        (error) => {
          console.error('Failed to load group list:', error);
          this.toastService?.publishNotification('error', 'Failed to load groups', 'error');
        }
      );
    } else {
      console.error('No logged-in username found in sessionStorage');
      this.toastService?.publishNotification('error', 'User not logged in', 'error');
    }
  }

  onGroupChange(groupId: string) {
    console.log('Selected groupId:', groupId);
    if (groupId) {
      this.fetchNumbersInGroup(groupId);
    }
  }

fetchNumbersInGroup(groupId: string, callback?: () => void) {
    const loggedInUserName = sessionStorage.getItem('USER_NAME');
    if (!groupId || !loggedInUserName) {
      console.error('Missing groupId or loggedInUserName');
      return;
    }

    const dt = {
      groupId: groupId,
      loggedInUsername: loggedInUserName,
      operation: "getAllNumbersInTheGroup"
    };

    this.phonebookService.getAllNumbersInGroup(dt).subscribe(
      (response) => {
        console.log('Numbers in group:', response);
        this.groupNumbers = response.data.phonebookList;
        this.mobileNumArray=response.data.phonebookList.map((item: any) => item.contactNumber);
        if (callback) {
          callback();
        }
      },
      (error) => {
        console.error('Failed to fetch numbers in group:', error);
        this.toastService?.publishNotification('error', 'Failed to fetch numbers', 'error');
      }
    );
  }
  private groupNumbers: any[] = [];


  // disabledDate = (current: Date): boolean => differenceInCalendarDays(current, this.today) <= 0;
  //   get timeSlots(): FormArray {
  //     return this.myForm.get('timeSlots') as FormArray;
  //   }

  // Disable all dates before today (using differenceInCalendarDays for accuracy)
  disabledCampaignDate = (current: Date): boolean => {
    const now = new Date();
    return differenceInCalendarDays(current, now) < 0;
  };

  // Only allow times after the current moment for today, and none for past dates
  getAvailableTimeUnits(type: 'hour' | 'minute' | 'second', selectedDate: Date | null, isExpiry: boolean = false): number[] {
    const now = new Date();
    // Always use numeric arrays for filtering
    const hourList = Array.from({ length: 24 }, (_, i) => i);
    const minuteList = Array.from({ length: 60 }, (_, i) => i);
    let selected = selectedDate ? new Date(selectedDate) : null;
    if (!selected) return type === 'hour' ? hourList : minuteList;
    const dayDiff = differenceInCalendarDays(selected, now);
    if (dayDiff < 0) return []; // Past date: no times allowed
    if (dayDiff > 0) return type === 'hour' ? hourList : minuteList; // Future date: all times allowed
    // Today:
    if (type === 'hour') {
      // Allow current hour and all future hours
      return hourList.filter(h => h >= now.getHours());
    }
    if (type === 'minute') {
      const selectedHourRaw = isExpiry ? this.quickCampaign.get('expiryHour')?.value : this.quickCampaign.get('campaignHour')?.value;
      const selectedHour = selectedHourRaw !== undefined && selectedHourRaw !== null && selectedHourRaw !== '' ? Number(selectedHourRaw) : undefined;
      if (selectedHour === undefined || isNaN(selectedHour)) {
        return minuteList; // No hour selected, show all
      }
      if (selectedHour > now.getHours()) {
        return minuteList;
      } else if (selectedHour === now.getHours()) {
        return minuteList.filter(m => m >= now.getMinutes());
      }
      return [];
    }
    if (type === 'second') {
      const selectedHourRaw = isExpiry ? this.quickCampaign.get('expiryHour')?.value : this.quickCampaign.get('campaignHour')?.value;
      const selectedMinuteRaw = isExpiry ? this.quickCampaign.get('expiryMinute')?.value : this.quickCampaign.get('campaignMinute')?.value;
      const selectedHour = selectedHourRaw !== undefined && selectedHourRaw !== null && selectedHourRaw !== '' ? Number(selectedHourRaw) : undefined;
      const selectedMinute = selectedMinuteRaw !== undefined && selectedMinuteRaw !== null && selectedMinuteRaw !== '' ? Number(selectedMinuteRaw) : undefined;
      if (selectedHour === undefined || isNaN(selectedHour) || selectedMinute === undefined || isNaN(selectedMinute)) {
        return minuteList; // No hour/minute selected, show all
      }
      if (selectedHour > now.getHours() || (selectedHour === now.getHours() && selectedMinute > now.getMinutes())) {
        return minuteList;
      } else if (selectedHour === now.getHours() && selectedMinute === now.getMinutes()) {
        return minuteList.filter(s => s >= now.getSeconds());
      }
      return [];
    }
    return [];
  }

  // Helper to disable AM/PM for today if not valid
  isAmDisabled(selectedDate: Date | null): boolean {
    const now = new Date();
    if (!selectedDate) return false;
    const dayDiff = differenceInCalendarDays(new Date(selectedDate), now);
    if (dayDiff !== 0) return false; // Only restrict for today
    // If current hour >= 12, AM should be disabled
    return now.getHours() >= 12;
  }
  isPmDisabled(selectedDate: Date | null): boolean {
    const now = new Date();
    if (!selectedDate) return false;
    const dayDiff = differenceInCalendarDays(new Date(selectedDate), now);
    if (dayDiff !== 0) return false; // Only restrict for today
    // If current hour < 12, PM should be disabled
    return now.getHours() < 12;
  }
}
