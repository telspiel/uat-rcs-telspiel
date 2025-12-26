import { Component , inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { NzUploadChangeParam } from 'ng-zorro-antd/upload';
import { SEND_TEMPLATE_MODEL, TEMPLATES, TEMPLATE_RESPONSE } from 'src/app/models/templateModel';
import { EditorToHtmlPipe } from 'src/app/pipes/editor-to-html.pipe';
import { TemplateMessageService } from 'src/app/service/template-message.service';
import { TemplateService } from 'src/app/service/template-service.service';
import { ToastService } from 'src/app/shared/toast-service.service';
import { DomSanitizer, SafeUrl } from '@angular/platform-browser';
import { HttpHeaders } from '@angular/common/http';
import { BrandService } from 'src/app/service/brand.service';
import { ActivatedRoute } from '@angular/router';
import { UserCreationService } from 'src/app/service/user-creation.service';


interface Country {
  name: string;
  code: string;
  flag: string;
}

@Component({
  selector: 'app-viewbrand',
  templateUrl: './viewbrand.component.html',
  styleUrls: ['./viewbrand.component.scss']
})



export class ViewbrandComponent {
   userCreation = inject(UserCreationService)


  countries: Country[] = [
       { name: 'India', code: '+91', flag: '🇮🇳' },
       { name: 'United States', code: '+1', flag: '🇺🇸' },
       // Add more countries as needed
     ];
     botLogoUrl: string | null = null;
     selectedCountryCode = '+91';
     botName: string = '';
     radioValue = '';
     imageUrl: SafeUrl | null = null;
     backgroundUrl: SafeUrl | null = null;
     scheduleMessage: string = 'no';
     senderTo = [];
     listTemplates: TEMPLATES[] = []; // Initialize an empty array to store the fetched templates.
     selectedTemplateData: TEMPLATE_RESPONSE | undefined;
     dt: any;
     body: any;
     newMessagePreviewTemplate: { template?: TEMPLATE_RESPONSE, data?: any } = {};
     previewVisibility = false;
     filterPipe = new EditorToHtmlPipe();
     viewbrand: FormGroup;
     http: any;
     messageTemplates: any;
     Brands: any;
     form: any;
     selectbrand = "";
     userdt: any;
     names: any;
     Reseller = "";
     Seller = "";
     client = "";
   
     Clientlist: any
     ResllerList: any 
     SellerList: any
     Adminlist : any
     useraccounttype = "";
     isUserSelected: boolean = false;
   

     loggedInUserName: string = '';
     brandDataList: any[] = [];

     selectedReseller: string | null = null;
     selectedSeller: string | null = null;
     selectedClient: string | null = null;

    
    
   
   
   
     // submitForm(): void {
     //   if (this.viewbrand.valid) {
     //     console.log('submit', this.viewbrand.value);
     
     //     // Set the template data to be previewed
     //     this.newMessagePreviewTemplate = this.templateMessageService.getTemplateMessage();
         
     //     // Display the preview
     //     this.previewVisibility = true;
     
     //     // Logging for verification
     //     console.log("Preview Data:", this.newMessagePreviewTemplate);
     //   } else {
     //     // Handle form validation errors
     //     Object.values(this.viewbrand.controls).forEach(control => {
     //       if (control.invalid) {
     //         control.markAsDirty();
     //         control.updateValueAndValidity({ onlySelf: true });
     //       }
     //     });
     //   }
     // }
     
     
     
   
     // resetForm() {
     //   this.viewbrand.reset({
     //     scheduleMessage:'no'
     //   })
     //   this.selectedTemplateData = undefined;
     // }

     
   
     updatedMsgBody($event: any) {
       console.log($event)
     }
   
     constructor(private fb: FormBuilder,
       private templateMessageService: TemplateMessageService,
       private toastService: ToastService,
       private templateService: TemplateService,
       private sanitizer: DomSanitizer,
       private brands : BrandService,
       private route: ActivatedRoute,
       

      ) 
      
      
     {
       this.viewbrand = this.fb.group({
         //userName:[sessionStorage.getItem('USER_NAME')],
         brandName: [{value:'', disabled:'true'}],
         officialWebsite: [{value:'', disabled:'true'}],
         brandLogo: [{value:'', disabled:'true'}],
         industryType: [{value:'', disabled:'true'}],
         firstName: [{value:'', disabled:'true'}],
         lastName: [{value:'', disabled:'true'}],
         designation: [{value:'', disabled:'true'}],
         mobileNumber: [{value:'', disabled:'true'}],
         email: [{value:'', disabled:'true'}],
         addressLine1: [{value:'', disabled:'true'}],
         addressLine2: [{value:'', disabled:'true'}],
         city: [{value:'', disabled:'true'}],
         botlogo:[{value:'', disabled:'true'}],
         phonePrefix : [{value:'', disabled:'true'}],   
         selectbrand:[{value:'', disabled:'true'}],
         state: [{value:'', disabled:'true'}],
         postalCode: [{value:'', disabled:'true'}],
         country: [{value:'', disabled:'true'}],
       });
    this.userdt =
    {
      loggedInUsername: sessionStorage.getItem('USER_NAME'),
      userId: sessionStorage.getItem('USER_ID')

    }
     }




    
     getBranddetails(brand :any){
      let dte = {
        loggedInUserName:sessionStorage.getItem('USER_NAME'),
        brandName:brand,
      }
      this.brands.branddetails(dte).subscribe((res: any) => {
        console.log(res);
        if (res) {
          this.Brands = res; 
          this.imageUrl = res.brandLogo

          this.viewbrand.patchValue({
            brandName:this.Brands.brandName,
            officialWebsite: this.Brands.officialWebsite,
            brandLogo : this.Brands.brandLogo,
            industryType : this.Brands.industryType,
            firstName :  this.Brands.firstName,
            lastName : this.Brands.lastName,
            designation :  this.Brands.designation ,
            email:this.Brands.email,
            mobileNumber: this.Brands.mobileNumber,
            addressLine1:this.Brands.addressLine1,
            addressLine2: this.Brands.addressLine2,
            city: this.Brands.city,
            state :this.Brands.state,
            country : this.Brands.country,
            postalCode :this.Brands.postalCode,

          })
        } else {
          this.Brands = []; 
          
        }
  
      });

     }

     
   

     ngOnInit(){
      this.getOptions(); 
      this.route.queryParams.subscribe(params => {
        const brandName = params['brandName']; // Get brandName from URL
        if (brandName) {
          this.getBranddetails(brandName);
        }
      });
      let dt = {
        loggedInUserName: sessionStorage.getItem('USER_NAME'),
      }
      

     
      

      
      }
     
    Brandlist(dt:any){
      let dt1 = {
        loggedInUserName: dt,
      }
      this.brands.getAllbrandname(dt1).subscribe(
        (response: any) => {
          if (response.data && response.data.dataList) {
            this.names = response.data.dataList; 
          } else {
            console.error('Invalid API response:', response);
          }
        },
        (error) => {
          console.error('Failed to fetch bot data:', error);
        }
      );
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
     //     this.viewbrand.reset();
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
   
    
       
  getOptions() {
    this.userCreation.getAllChildForUser(this.userdt).subscribe(
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
   
   
    //  onSubmit(): void {
    //    if (this.viewbrand.valid) {
    //      const formData = {
    //        ...this.viewbrand.value,
    //        loggedInUserName: sessionStorage.getItem('USER_NAME')
    //      };
     
    //      console.log('Form Submitted:', formData);
     
    //      this.templateService.Branddata(formData).subscribe({
    //        next: (result) => {
    //          console.log('API Response:', result);
             
    //          if (result === "Failed") {
    //            this.toastService.publishNotification("Error", result.message, "error");
    //          } else {
    //            this.toastService.publishNotification("Success", result.message);
    //            this.viewbrand.reset();
    //          }
    //        },
    //        error: (error) => {
    //          console.error('Error while submitting brand data:', error);
    //          this.toastService.publishNotification("Error", error.message || "An error occurred", "error");
    //        },
    //      });
         
         
    //    } else {
    //      console.log('Form Invalid');
    //      alert('Please fill in all required fields.');
    //    }
    //  }
     
   
     
   
     
   
     // Handle the back button (optional navigation logic)
    //  onBack(): void {
    //    console.log('Navigating back...');
    //  }

    
  fetchBrandData() {
    if (!this.loggedInUserName) return;
  
    let dt1 = {
      "loggedInUserName": this.loggedInUserName
    };
  
    this.brands .getAllbrandname(dt1).subscribe((res: any) => {
      console.log(res);
      if (res.data && res.data.dataList) {
        this.brandDataList = res.data.dataList; // Assign brand data to array
      }
    });
  }

  getUserData(Value:string, type:string) {
    if(type=='reseller')
    {
      this.Seller = ""
      this.client = ""
    }
    else if(type=='Seller'){
      this.Reseller = ""
      this.client = ""
    }
    else if (type=='client'){
      this.Reseller = ""
      this.Seller = ""
    }
    const username = {
      userName: Value
    }
    console.log(Value);
    if (Value) {
        this.isUserSelected = true; // Enable "Select Brand" dropdown when a user is selected
        this.loggedInUserName=Value
        this.Brandlist(Value)
      }
  }

  // getUserData(selectedValue: any, type: string) {
  //   if (selectedValue) {
  //     this.isUserSelected = true; // Enable "Select Brand" dropdown when a user is selected
  //   }
  // }
 

 
 
 }