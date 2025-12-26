import { Component , OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { NzUploadChangeParam } from 'ng-zorro-antd/upload';
import { SEND_TEMPLATE_MODEL, TEMPLATES, TEMPLATE_RESPONSE } from 'src/app/models/templateModel';
import { EditorToHtmlPipe } from 'src/app/pipes/editor-to-html.pipe';
import { TemplateMessageService } from 'src/app/service/template-message.service';
import { TemplateService } from 'src/app/service/template-service.service';
import { ToastService } from 'src/app/shared/toast-service.service';
import { DomSanitizer, SafeUrl } from '@angular/platform-browser';
import { HttpHeaders } from '@angular/common/http';
import { UserCreationService } from 'src/app/service/user-creation.service';
import { ImageCroppedEvent } from 'ngx-image-cropper';
import { BrandService } from 'src/app/service/brand.service';
import { Router } from '@angular/router';
import { NgxUiLoaderService } from 'ngx-ui-loader';


interface Country {
  name: string;
  code: string;
  flag: string;
}

@Component({
  selector: 'app-addbrand',
  templateUrl: './addbrand.component.html',
  styleUrls: ['./addbrand.component.scss']
})
export class AddbrandComponent {

  

    countries: Country[] = [
      { name: 'India', code: '+91', flag: '🇮🇳' },
      { name: 'United States', code: '+1', flag: '🇺🇸' },
      // Add more countries as needed
    ];
    isDisabled=false;
    botLogoUrl: string | null = null;
    prefix='+91'
    selectedCountryCode = '+91';
    botName: string = '';
    radioValue = '';
    brandDataList: any[] = [];
    croppedImage: any = '';
    isVisible = false;
    imageChangedEvent: any = '';
    imageUrl: SafeUrl | null = null;
    backgroundUrl: SafeUrl | null = null;
    isConfirmLoading = false;
    scheduleMessage: string = 'no';
    senderTo = [];
    listTemplates: TEMPLATES[] = []; // Initialize an empty array to store the fetched templates.
    selectedTemplateData: TEMPLATE_RESPONSE | undefined;
    dt: any;
    body: any;
    newMessagePreviewTemplate: { template?: TEMPLATE_RESPONSE, data?: any } = {};
    previewVisibility = false;
    filterPipe = new EditorToHtmlPipe();
    fileName: string = '';
    brandForm: FormGroup;
    http: any;
    usertype=null;
  formData: FormData | undefined;
  role: string =sessionStorage.getItem('ROLE')||"";
  Clientlist: any
    ResllerList: any 
    SellerList: any
    Adminlist : any
    storFile  = "";
    Reseller = "";
    Seller = "";
    client = "";
    Admin = "";
     loggedInUserName: string = '';
    userdt: any;
    isCropperModalVisible = false; 
    file: File | null = null;
    selectedReseller: string | null = null;
    selectedSeller: string | null = null;
    selectedClient: string | null = null;
    selectedadmin: string | null = null;
    filename=""

    fileChangeEvent(event: any): void {
      this.imageChangedEvent = event;
      this.filename=event.target.files[0].name
      console.log(event);
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
  imageLoaded() {
      // show cropper
  }
  cropperReady() {
      // cropper ready
  }
  loadImageFailed() {
      // show message
  }
  
    showModal(): void {
      this.isVisible = true;
    }

  
    // handleOk(): void {
    //   this.isConfirmLoading = true;
    //   setTimeout(() => {
    //     this.isVisible = false;
    //     this.isConfirmLoading = false;
    //   }, 1000);
    //   this.imageUrl=this.croppedImage
    //   this.formData = new FormData();
    //   this.formData.append('file', this.file!, this.file!.name);
    // }

    uploadedFileUrl: string = '';
    
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
            console.log(this.fileName)
            this.brandForm.patchValue({
              
            })
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
    


    handleCancel(): void {
      this.isVisible = false;
    }
    // imageChangedEvent: any = ''; 
    // croppedImage: any = ''; 
  
  
    // submitForm(): void {
    //   if (this.brandform.valid) {
    //     console.log('submit', this.brandform.value);
    
    //     // Set the template data to be previewed
    //     this.newMessagePreviewTemplate = this.templateMessageService.getTemplateMessage();
        
    //     // Display the preview
    //     this.previewVisibility = true;
    
    //     // Logging for verification
    //     console.log("Preview Data:", this.newMessagePreviewTemplate);
    //   } else {
    //     // Handle form validation errors
    //     Object.values(this.brandform.controls).forEach(control => {
    //       if (control.invalid) {
    //         control.markAsDirty();
    //         control.updateValueAndValidity({ onlySelf: true });
    //       }
    //     });
    //   }
    // }
    
    
    
  
    // resetForm() {
    //   this.brandform.reset({
    //     scheduleMessage:'no'
    //   })
    //   this.selectedTemplateData = undefined;


    // }

     // getUserData(selectedUser: string, userType: string) {
    //   if (selectedUser) {
    //     this.usertype = userType; 
    //   }
    // }

    
  
    getUserData(Value:string, type:string) {

      if(type=='reseller')
      {
        this.Admin=""
        this.Seller = ""
        this.client = ""
      }
      else if(type=='seller'){
        this.Reseller = ""
        this.client = ""
        this.Admin=""
      }
      else if (type=='client'){
        this.Reseller = ""
        this.Seller = ""
        this.Admin=""
      }
      else if (type=='admin'){
        this.Reseller = ""
        this.Seller = ""
        this.client = ""
      }
    }

    updatedMsgBody($event: any) {
      console.log($event)
    }
  
    constructor(private fb: FormBuilder,
      private templateMessageService: TemplateMessageService,
      private ngxLoader: NgxUiLoaderService,
      private toastService: ToastService,
      private router: Router,
      private templateService: TemplateService,
      private sanitizer: DomSanitizer,
      private userCreationService: UserCreationService,
       private brandService: BrandService
    ) {
      const pattern = new RegExp(
          '^(https?:\\/\\/)?' + // protocol
          '((([a-z\\d]([a-z\\d-]*[a-z\\d])*)\\.?)+[a-z]{2,}|' + // domain name
          '((\\d{1,3}\\.){3}\\d{1,3}))' + // OR IP (v4) address
          '(\\:\\d+)?' + // port
          '(\\/[-a-z\\d%@_.~+&:]*)*' + // path
          '(\\?[;&a-z\\d%@_.,~+&:=-]*)?' + // query string
          '(\\#[-a-z\\d_]*)?$', 'i' // fragment locator
            );
      this.brandForm = this.fb.group({
        //userName:[sessionStorage.getItem('USER_NAME')],
        brandName: ['',Validators.required],
        officialWebsite: ['', [Validators.pattern(pattern), Validators.required]],
        brandLogo : [this.uploadedFileUrl],
        fileName : [this.storFile ],
        industryType: ['', Validators.required],
        firstName: ['', Validators.required],
        lastName: ['',  Validators.required],
        designation: ['', Validators.required],
        mobileNumber: [this.prefix+'',[Validators.pattern(/^[\d+]+$/), Validators.required]],
        email: ['', [Validators.email, Validators.required]],
        addressLine1: ['', Validators.required],
        addressLine2: [''],
        city: ['', Validators.required],
        state: ['', Validators.required],
        postalCode: ['', [Validators.pattern(/^[0-9]+$/), Validators.required]],
        country: ['', Validators.required],
        //resellerName:[this.selectedReseller],
        // sellerName: this.selectedSeller,
        // clientName: this.selectedClient,
        // adminName: this.selectedadmin,
      });
      
    }
    
  
    ngOnInit(): void {
      this.getOptions();
      this.templateService.getAllTemplateNames().subscribe(data => {
        this.listTemplates = data;
      })
  
    }
    getFeedback(name:string){
      if(this.brandForm.get(name)?.invalid && (this.brandForm.get(name)?.dirty || this.brandForm.get(name)?.touched))
      {return true}
      return false
    }
    onResellerChange(selectedReseller: string) {
      this.selectedReseller = selectedReseller;
      this.selectedSeller = null;  // Reset Seller
      this.selectedClient = null;  // Reset Client
      this.fetchBrandData();
    }
    
    onSellerChange(selectedSeller: string) {
      this.selectedSeller = selectedSeller;
      this.selectedClient = null; 
      this.selectedReseller = null;
      this.fetchBrandData();
    }
    
    onClientChange(selectedClient: string) {
      this.selectedClient = selectedClient;
      this.selectedReseller = null;
      this.selectedSeller = null;

      this.fetchBrandData();
    }

    fetchBrandData() {
      if (!this.loggedInUserName) return;
    
      let dt1 = {
        "loggedInUserName": this.loggedInUserName
      };
    
      this.brandService.getAllbrandname(dt1).subscribe((res: any) => {
        console.log(res);
        if (res.data && res.data.dataList) {
          this.brandDataList = res.data.dataList; // Assign brand data to array
        }
      });
    }


   
    
    onUserSelect(userType: string, value: string) {
      if (userType === 'admin') {
        this.selectedadmin = value;
        this.selectedReseller = null;
        this.selectedSeller = null;
        this.selectedClient = null;
      }
      else if (userType === 'reseller') {
        this.selectedReseller = value;
        this.selectedSeller = null;
        this.selectedClient = null;
        this.selectedadmin = null;
      } else if (userType === 'seller') {
        this.selectedSeller = value;
        this.selectedReseller = null;
        this.selectedClient = null;
        this.selectedadmin = null;
      } else if (userType === 'client') {
        this.selectedClient = value;
        this.selectedReseller = null;
        this.selectedSeller = null;
        this.selectedadmin = null;
      }
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
  
    // imageCropped(event: ImageCroppedEvent) {
    //   if (event.objectUrl) {
    //     this.croppedImage = this.sanitizer.bypassSecurityTrustUrl(event.objectUrl);
    //   }
       
    //     console.log(event);
    // }
  
    onFileSelected(event: any): void {
      const file = event.target.files[0];
      if (file) {
        this.fileName = file.name; // Store file name
        const reader = new FileReader();
        reader.onload = (e: any) => {
          this.imageUrl = e.target.result;
        };
        reader.readAsDataURL(file);
        console.log(file)

        this.formData = new FormData(); // Initialize formData properly
        this.formData.append('file', file, file.name); // Append file to formData
      }
    }

    // onFileSelected(event: any): void {
    //   if (event.target.files && event.target.files.length) {
    //     this.imageChangedEvent = event; // Store event for image cropper
    //     this.isCropperModalVisible = true; // Open modal
    //   }
    // }
  
   
    // onSubmit(): void {
    //   if (this.brandForm.valid) {
    //     if (!this.formData) {
    //       console.error("No file selected.");
    //       this.toastService.publishNotification("Error", "Please upload a logo.", "error");
    //       return;
    //     }
    
    //     const formData = new FormData();
    //     formData.append('brandLogo', this.formData?.get('file') as Blob, this.fileName); 
    //     formData.append('loggedInUserName', sessionStorage.getItem('USER_NAME') || '');
       
    //     formData.append('resellerName', this.selectedReseller!)
    //     formData.append('sellerName', this.selectedSeller!)
    //     formData.append('clientName', this.selectedClient!)
    //     formData.append('adminName' , this.selectedadmin!)
      

    //     for (const key in this.brandForm.value) {
    //       if (key !== 'brandLogo') { 
    //         formData.append(key, this.brandForm.value[key]);
    //       }
    //     }
    
    //     console.log('Form Submitted:', formData);
        
    //     const jsonData = {
    //       ...this.brandForm.value, 
    //       brandLogo: this.uploadedFileUrl, 
    //       loggedInUserName: sessionStorage.getItem('USER_NAME') || '',
    //       resellerName: this.selectedReseller!,
    //       sellerName: this.selectedSeller!,
    //       clientName: this.selectedClient!,
    //       adminName: this.selectedadmin!
    //     };
    //     console.log("JSON Data Sent:", jsonData);
         
        
    //     this.templateService.Branddata(jsonData).subscribe({
    //       next: (result) => {
    //         console.log('API Response:', result);
    
    //         if (result.status === "Failed") {
    //           this.toastService.publishNotification("Error", result.message, "error");
    //         } else {
    //           this.toastService.publishNotification("Success", result.message);
    //           this.brandForm.reset();
    //           this.imageUrl = null; 
    //           this.fileName = ''; 
    //           this.formData = undefined; 
    //         }
    //       },
    //       error: (error) => {
    //         console.error('Error while submitting brand data:', error);
    //         this.toastService.publishNotification("Error", error.message || "An error occurred", "error");
    //       },
    //     });
    //   } else {
    //     console.log('Form Invalid');
    //     alert('Please fill in all required fields.');
    //   }
    // }
    handleSelection(event: any): void {
  console.log('User selection:', event);
  this.selectedClient=event.client
  this.selectedReseller=event.reseller
  this.selectedSeller=event.seller // Based on updated values
}
  
    onSubmit(): void {
      this.isDisabled = true; // Disable the submit button
    if (this.brandForm.invalid) {
      // Only show the generic error if there are multiple errors
      const errorCount = Object.values(this.brandForm.controls).filter(control => control.invalid).length;
      
      // Mark all controls as touched to show validation errors
      Object.entries(this.brandForm.controls).forEach(([key, control]) => {
        control.markAsDirty();
        control.updateValueAndValidity();
        if (control.errors) {
          
            Object.keys(control.errors).forEach(errorKey => {
            let errorMsg = '';
            if (errorKey === 'required') {
              errorMsg = `${key} is required.`;
              return;
            } else if (errorKey === 'email') {
              errorMsg = `${key} must be a valid email address.`;
            } else if (errorKey === 'pattern') {
              errorMsg = `${key} format is invalid.`;
            } else {
              errorMsg = `${key} is invalid.`;
            }
            this.toastService.publishNotification("Error", errorMsg, "error");
          });
        }
      });
      this.isDisabled = false; // Re-enable button if form is invalid
      return;
    }

    if (!this.formData) {
      console.error("No file selected.");
      this.toastService.publishNotification("Error", "Please upload a logo.", "error");
      this.isDisabled = false; // Re-enable the button if there's an error
      return;
    }

    // Additional check for required user selection
    if (!this.selectedReseller && !this.selectedSeller && !this.selectedClient && !this.selectedadmin) {
      this.toastService.publishNotification("Error", "Please select at least one user type (Reseller, Seller, Client, or Admin).", "error");
      this.isDisabled = false;
      return;
    }

    const formData = new FormData();
    // formData.append('brandLogo', this.formData?.get('file') as Blob, this.fileName); 
    formData.append('loggedInUserName', sessionStorage.getItem('USER_NAME') || '');
    formData.append('resellerName', this.selectedReseller ?? ''); 
    formData.append('sellerName', this.selectedSeller ?? ''); 
    formData.append('clientName', this.selectedClient ?? ''); 
    formData.append('adminName', this.selectedadmin ?? ''); 

    for (const key in this.brandForm.value) {
      if (key !== 'brandLogo') { 
        formData.append(key, this.brandForm.value[key]);
      }
    }

    console.log('Form Submitted:', formData);

    const jsonData = {
      ...this.brandForm.value, 
      brandLogo: this.uploadedFileUrl, 
      fileName: this.storFile,
      loggedInUserName: sessionStorage.getItem('USER_NAME') || '',
      resellerName: this.selectedReseller ?? '',
      sellerName: this.selectedSeller ?? '',
      clientName: this.selectedClient ?? '',
      adminName: this.selectedadmin ?? ''
    };

    console.log("JSON Data Sent:", jsonData);

    this.ngxLoader.start();

    this.templateService.Branddata(jsonData).subscribe({
      next: (result) => {
        console.log('API Response:', result);

        this.ngxLoader.stop(); 

        if (result.result === "Failed" || result.status === "Failed") {
          this.toastService.publishNotification("Error", result.message || "Submission failed.", "error");
        } else {
          this.toastService.publishNotification("Success", result.message || "Brand added successfully.");
          this.brandForm.reset();
          this.router.navigate(['/Brand']);
          this.imageUrl = null; 
          this.fileName = ''; 
          this.formData = undefined;
          this.selectedReseller = null;
          this.selectedSeller = null;
          this.selectedClient = null;
          this.selectedadmin = null;
        }

        this.isDisabled = false; // Re-enable button
      },
      error: (error) => {
        console.error('Error while submitting brand data:', error);

        this.ngxLoader.stop();

        this.toastService.publishNotification("Error", error.message || "An error occurred", "error");
        this.isDisabled = false; // Re-enable button
      }
    });
    }
    
    
   
    
    getStatus(controlName: string): 'error' | 'success'|  null {
      const control = this.brandForm.get(controlName);
      if (control?.touched && control?.invalid) {
        return 'error';
      }
      if (control?.valid) {
        return 'success';
      }
      return null;
    }
    
    
  
    
  
    
  
    // Handle the back button (optional navigation logic)
    onBack(): void {
      console.log('Navigating back...');
    }
}