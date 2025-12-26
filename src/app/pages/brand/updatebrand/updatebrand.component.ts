import { Component, inject } from '@angular/core';
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
import { formatDate } from '@angular/common';
import { ActivatedRoute } from '@angular/router';
import { UserCreationService } from 'src/app/service/user-creation.service';
import { ImageCroppedEvent } from 'ngx-image-cropper';

interface Country {
  name: string;
  code: string;
  flag: string;
}


@Component({
  selector: 'app-updatebrand',
  templateUrl: './updatebrand.component.html',
  styleUrls: ['./updatebrand.component.scss']
})
export class UpdatebrandComponent {
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
     isVisible = false;
    imageChangedEvent: any = '';
    isConfirmLoading = false;
    storFile  = "";
   
    
    updatebrand: FormGroup;
    http: any;
    Brands: any;
    selectbrand: any;
    names: any;
    loggedInUserName: string = '';
    formData: FormData | undefined;
    filename: any;
    Reseller = "";
    Seller = "";
    client = "";
    croppedImage: any = '';
    isUserSelected: boolean = false;
    file: File | null = null;
    Clientlist: any
    ResllerList: any 
    SellerList: any
    Adminlist : any
    usertype="";
    userdt: any;
    
  uploadedFileUrl: any;
  store: any;
  filetype: any;


  showModal(): void {
    this.isVisible = true;
  }


  handleCancel(): void {
    this.isVisible = false;
  }

  handleOk(): void {
    this.isConfirmLoading = true;
  this.imageUrl = this.croppedImage;
  this.formData = new FormData();
  
  if (this.file) {
      this.formData.append('file', this.file, this.filename);
    } else {
      console.error("No file selected.");
      this.toastService.publishNotification("Error", "Please select a file.", "error");
      this.isConfirmLoading = false;
      return;
    }
  
    // 🔹 Add `userName` to FormData
    const userName = sessionStorage.getItem('USER_NAME') || '';
    this.formData.append('userName', userName);
    setTimeout(() => {
          this.isVisible = false;
          this.isConfirmLoading = false;
        }, 1000);
    
    
    this.templateService.uploadLogo(this.formData).subscribe({
      next: (result) => {
        console.log("File Upload Response:", result);

        if(result.status = "SUCCESS"){
          this.uploadedFileUrl = result.uploadedFilePath;
          this.storFile = result.fileName;
          console.log(this.uploadedFileUrl);
          console.log(this.filename)
        }
  
        if (result.status === "Failed") {
          this.toastService.publishNotification("Error", result.message, "error");
        } else {
          this.toastService.publishNotification("Success", "File uploaded successfully.");
        }
  
        this.isVisible = false;
        this.isConfirmLoading = false;
      },
      error: (error) => {
        console.error("Error while uploading file:", error);
        this.toastService.publishNotification("Error", error.message || "An error occurred", "error");
        this.isConfirmLoading = false;
      }
    });
  }

    
  
      
    


    
    fileChangeEvent(event: any): void {
      this.imageChangedEvent = event;
      this.filename=event.target.files[0].name
      console.log(this.filetype);
  }

    imageCropped(event: ImageCroppedEvent) {
      
      //this.imageBlob= this.sanitizer.bypassSecurityTrustUrl(event)
    
      if (event.objectUrl) {
        this.croppedImage = this.sanitizer.bypassSecurityTrustUrl(event.objectUrl);
        
      }
      if (event.blob) {
        this.file = new File([event.blob], 'croppedImage', { type: event.blob.type, lastModified: Date.now() });
        console.log (this.file)
        
      }
      this.formData = new FormData(); // Initialize formData properly
      //this.formData.append('file', file, file.name);
        console.log(event);
    }
    
   
   
   
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
     ) {
       this.updatebrand = this.fb.group({
         //userName:[sessionStorage.getItem('USER_NAME')],
         brandName: [''],
         officialWebsite: [''],
         brandLogo  : [''],
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
      
       this.userdt =
       {
         loggedInUsername: sessionStorage.getItem('USER_NAME'),
         userId: sessionStorage.getItem('USER_ID')
   
       }
     }
   
    
   
    


      // let dte = {
      //   "loggedInUserName":sessionStorage.getItem('USER_NAME'),
      // }
      // this.brands.branddetails(dte).subscribe((res: any) => {
      //   console.log(res);
      //   if (res.data && res.data.brandlist) {
      //     this.Brands = res.data.brandlist; 
      //   } else {
      //     this.Brands = []; 
      //   }
      // });

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


          this.updatebrand.patchValue({
            brandName:this.Brands.brandName,
            // brandLogo : this.uploadedFileUrl,
            brandLogo : this.Brands.brandLogo,
            
            officialWebsite: this.Brands.officialWebsite,
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
   
   
  
    onSubmit(): void {
      if (this.updatebrand.valid) {
       
    
        // Convert FormData to JSON object
        const brandData: any = {
          loggedInUserName: sessionStorage.getItem('USER_NAME') || '',
          // brandLogo: this.uploadedFileUrl, 

          brandLogo:  this.uploadedFileUrl ||  this.imageUrl,

        };
    
        for (const key in this.updatebrand.value) {
          if (key !== 'brandLogo') { 
            brandData[key] = this.updatebrand.value[key];
          }
        }
    
        console.log('JSON Payload:', brandData);
    
        // Send JSON data
        this.brands.editBrand(brandData).subscribe({
          next: (result) => {
            console.log('API Response:', result);
    
            if (result.status === "Failed") {
              this.toastService.publishNotification("Error", result.message, "error");
            } else {
              this.toastService.publishNotification("Success",'Brand Update Sucessfully');
              this.updatebrand.reset();
              this.imageUrl = null; // Clear preview
              this.filename = ''; // Reset file name
              this.formData = undefined; // Reset formData
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
    
     
   
     
   
     
   
     
   
    //  Handle the back button (optional navigation logic)
    
     onBack(): void {
       console.log('Navigating back...');
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
     
   
     
 }