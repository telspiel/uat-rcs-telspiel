import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { NzUploadChangeParam } from 'ng-zorro-antd/upload';
import { SEND_TEMPLATE_MODEL, TEMPLATES, TEMPLATE_RESPONSE } from 'src/app/models/templateModel';
import { EditorToHtmlPipe } from 'src/app/pipes/editor-to-html.pipe';
import { TemplateMessageService } from 'src/app/service/template-message.service';
import { TemplateService } from 'src/app/service/template-service.service';
import { ToastService } from 'src/app/shared/toast-service.service';
import { DomSanitizer, SafeUrl } from '@angular/platform-browser';
import { HttpHeaders } from '@angular/common/http';
import { ReportService } from 'src/app/service/report.service';
import { BrandService } from 'src/app/service/brand.service';
import { UserCreationService } from 'src/app/service/user-creation.service';
import { debounceTime, distinctUntilChanged } from 'rxjs';

interface Country {
  name: string;
  code: string;
  flag: string;
}

@Component({
  selector: 'app-brand',
  templateUrl: './brand.component.html',
  styleUrls: ['./brand.component.scss']
})
export class BrandComponent {
  
  countries: Country[] = [
    { name: 'India', code: '+91', flag: '🇮🇳' },
    { name: 'United States', code: '+1', flag: '🇺🇸' },
    // Add more countries as needed
  ];
  botLogoUrl: string | null = null;
  selectedCountryCode = '+91';
  Clientlist: any
    ResllerList: any 
    SellerList: any
    Adminlist : any
    Reseller = "";
    isUserSelected: boolean = false;
    Seller = "";
    client = "";
    Admin = "";
  brandDataList: any[] = [];
  botName: string = '';
  loggedInUserName: string = '';
  messageTemplates: any = [];
  radioValue = '';
  imageUrl: SafeUrl | null = null;
  backgroundUrl: SafeUrl | null = null;
  role: string =sessionStorage.getItem('ROLE')||"";
  scheduleMessage: string = 'no';
  senderTo = [];
  getBrandData = [];
  listTemplates: TEMPLATES[] = []; // Initialize an empty array to store the fetched templates.
  selectedTemplateData: TEMPLATE_RESPONSE | undefined;
  dt: any;
  body: any;
  userdt: any;
  newMessagePreviewTemplate: { template?: TEMPLATE_RESPONSE, data?: any } = {};
  previewVisibility = false;
  filterPipe = new EditorToHtmlPipe();
  filteredData: any[] = [];
  brandForm: FormGroup;
  http: any;
  searchControl = new FormControl('');
 

  updatedMsgBody($event: any) {
    console.log($event)
  }

  constructor(private fb: FormBuilder,
    private templateMessageService: TemplateMessageService,
    private toastService: ToastService,
    private templateService: TemplateService,
    private sanitizer: DomSanitizer,
    private reportService: ReportService,
    private brandService: BrandService,
    private userCreationService: UserCreationService,

  ) {
    this.brandForm = this.fb.group({
      //userName:[sessionStorage.getItem('USER_NAME')],
      brandName: [''],
      officialWebsite: [''],
      brandLogo: [''],
      industryType: [''],
      firstName: [''],
      lastName: [''],
      designation: [''],
      mobileNumber: [''],
      email: [''],
      addressLine1: [''],
      addressLine2: [''],
      city: [''],
      state: [''],
      postalCode: [''],
      country: [''],
    });
  }

  ngOnInit(): void {
    this.getOptions();
    this.loggedInUserName = sessionStorage.getItem('USER_NAME') || 'User';

    if (sessionStorage.getItem('ROLE') === 'client') {
      let dt1 = {
        loggedInUserName: sessionStorage.getItem('USER_NAME') 
      };
  
      this.brandService.getAllbrandname(dt1).subscribe((res: any) => {
        console.log("Brand API Response (ngOnInit):", res);
        if (res.data && res.data.dataList) {
          this.brandDataList = res.data.dataList; 
          this.filteredData = [...this.brandDataList]
        }
      });
    }
    this.searchControl.valueChanges
      .pipe(debounceTime(300), distinctUntilChanged()) // Prevents unnecessary API calls
      .subscribe((value:any) => this.applyFilter(value));
  }


  getUserData(selectedUser: string) {
    let dt1 = {
      loggedInUserName: sessionStorage.getItem('ROLE') === 'client'
        ? sessionStorage.getItem('USER_NAME')
        : selectedUser
    };
  
    this.brandService.getAllbrandname(dt1).subscribe((res: any) => {
      console.log("Brand API Response:", res);
      if (res.data && res.data.dataList) {
        this.brandDataList = res.data.dataList;  // Store original data
        this.filteredData = [...this.brandDataList]; // Initialize filteredData
      }
    });
  }
  
  applyFilter(searchTerm: string) {
    if (!searchTerm) {
      this.filteredData = [...this.brandDataList]; // Reset filtered data
      return;
    }
  
    const lowerCaseTerm = searchTerm.toLowerCase();
  
    this.filteredData = this.brandDataList.filter(item =>
      Object.values(item).some((value: any) =>
        value?.toString().toLowerCase().includes(lowerCaseTerm)
      )
    );
  }
  

  

  getOptions() {
    this.userdt =
    {
      loggedInUsername: sessionStorage.getItem('USER_NAME'),
      userId: sessionStorage.getItem('USER_ID')

    }
    this.userCreationService.getAllChildForUser(this.userdt).subscribe(
      (res) => {
        this.SellerList = [res.data.userAllChildMap.SELLER].flatMap((obj: any) => {
          return Object.entries(obj).map(([key, value]) => ({
            label: key,
            value: value
          }))
        }
        )
        this.Adminlist=[res.data.userAllChildMap.ADMIN].flatMap((obj: any) => {
          return Object.entries(obj).map(([key, value]) => ({
            label: key,
            value: value
          }))
        });
        this.Clientlist = [res.data.userAllChildMap.CLIENT].flatMap((obj: any) => {
          return Object.entries(obj).map(([key, value]) => ({
            label: key,
            value: value
          }))
        });
        this.ResllerList = [res.data.userAllChildMap.RESELLER].flatMap((obj: any) => {
          return Object.entries(obj).map(([key, value]) => ({
            label: key,
            value: value
          }))
        });

      }

    )
  }

  onCountrySelect(code: string): void {
    this.selectedCountryCode = code; // Update the country code when a new country is selected
  }

  onTemplateSelect(templateId: string) {
    templateId && this.templateService.getTemplateById(templateId).subscribe(data => {
      this.selectedTemplateData = { ...data };
    })
  }

  // submitDataToSendTemplate() {
  //   console.log("submitDataToSendTemplate")
   
  //   const template = this.templateMessageService.templateMessage.template
  //   let params = this.templateMessageService.templateMessage.data;
  //   console.log(params)

  //   const header = template?.components.find(item => item.type === 'HEADER');
  //   console.log(header)
  //   const compHeader = params.headerURL && {
  //     type: 'header',
  //     parameters: [
  //       {
  //         type: header?.format?.toLowerCase() || "image",
  //         image: {
  //           link: params.headerURL
  //         }
  //       }
  //     ]
  //   }

  //   const body = template?.components.find(item => item.type === 'BODY');
  //   const bodyParams = params.variables.map((item: any) => {
  //     return { "type": "text", "text": item.value }
  //   })
  //   const compBody = {
  //     "text": body?.text,
  //     "type": "body",
  //     "parameters": bodyParams
  //   }

  //   let comp = [];

  //   if (compHeader) {
  //     comp.push(compHeader)
  //   }

  //   if (compBody) {
  //     comp.push(compBody)
  //   }

  //   const senderNumbers = form.to.map((to: string) => {
  //     return `91${to}`
  //   })

  //   console.log(template)

  //   const reqBody: SEND_TEMPLATE_MODEL = {
  //     "name": template?.name || '',
  //     "from": "0123456789",
  //     "to": senderNumbers,
  //     "id": '8qTZWz54yQdq3qyNpcwgWT',
  //     "type": "template",
  //     components: comp,
  //     "language": {
  //       "policy": "deterministic",
  //       "code": template?.language || "en_US"
  //     }
  //   }

  //   console.log(reqBody)
  //   this.templateService.sendTemplates(reqBody).subscribe(data => {
  //     // console.log(data);
  //     this.previewVisibility = false;
  //     this.brandform.reset();
  //     this.newMessagePreviewTemplate = {};
  //     this.selectedTemplateData = undefined;
  //     this.toastService.publishNotification("Success", "Message Sent to the client Succesfully", "success")
  //   }, err => {
  //     const error = err.error.errors[0];
  //     this.toastService.publishNotification(error.title, error.details, "error")
  //   })
  // }


  // handleFileChange(info: NzUploadChangeParam): void {
  //   if (info.file.status === 'done') {
  //     if (info.file.originFileObj) {
  //       this.imageUrl = URL.createObjectURL(info.file.originFileObj);
  //       console.log('Image URL:', this.imageUrl);  
  //     }
  //   } else if (info.file.status === 'error') {
  //     console.error(`${info.file.name} file upload failed`);
  //   }
  // }
  handleSelection(event: any){
  this.Admin=event.admin
  this.client=event.client
  this.Reseller=event.reseller
  this.Seller=event.seller

  let selectedUser = this.Admin || this.Reseller || this.Seller || this.client;

  this.getUserData(selectedUser);
  }

  onFileSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files[0]) {
      const file = input.files[0];
      const formData = new FormData();
      formData.append('file', file, file.name);
  
      const loggedInUserName = sessionStorage.getItem('USER_NAME');
      if (!loggedInUserName) {
        console.error('loggedInUserName is not available in sessionStorage');
        this.toastService.publishNotification('Failed', 'User not logged in', 'error');
        return;
      }
  
      formData.append('type', 'logo');
      formData.append('loggedInUserName', loggedInUserName);
      console.log(file)
      //**Preview Image**
      const objectURL = URL.createObjectURL(file);
      this.imageUrl = this.sanitizer.bypassSecurityTrustUrl(objectURL);
      this.botLogoUrl = objectURL;  // ✅ Store preview URL
      console.log('Bot Logo Preview URL:', objectURL);
  
      // **Call API to Upload**
      this.templateService.uploadbot(formData).subscribe(
        (response: { message: string, botlogo: string }) => {
          this.toastService.publishNotification('Success', response.message);
          this.botLogoUrl = response.botlogo;  // ✅ Update botLogoUrl from API response
        },
        (err: { meta?: { developer_message: string }; message?: string }) => {
          const error = err.meta?.developer_message || err.message || 'An error occurred';
          console.error('Upload Error:', error);
          this.toastService.publishNotification('Failed', error, 'error');
        }
      );
    }
  }


  onSubmit(): void {
    if (this.brandForm.valid) {
      const formData = {
        ...this.brandForm.value,
        loggedInUserName: sessionStorage.getItem('USER_NAME')
      };
  
      console.log('Form Submitted:', formData);
  
      this.templateService.Branddata(formData).subscribe({
        next: (result) => {
          console.log('API Response:', result);
          
          if (result === "Failed") {
            this.toastService.publishNotification("Error", result.message, "error");
          } else {
            this.toastService.publishNotification("Success", result.message);
            this.brandForm.reset();
          }
        },
        error: (error) => {
          console.error('Error while submitting brand data:', error);
          this.toastService.publishNotification("Error", error.message || "An error occurred", "error");
        },
      });
      
      
    } else {
      console.log('Form Invalid');
      alert('Please fill in all required fields.');
    }
  }
  

  

  

  // Handle the back button (optional navigation logic)
  onBack(): void {
    console.log('Navigating back...');
  }

}

