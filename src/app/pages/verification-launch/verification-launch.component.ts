import { Component } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { DomSanitizer, SafeUrl } from '@angular/platform-browser';
// import { NzUploadChangeParam, NzUploadFile } from 'ng-zorro-antd/upload';
import { ImageCroppedEvent } from 'ngx-image-cropper';
import { BotServiceService } from 'src/app/service/bot-service.service';
import { BrandService } from 'src/app/service/brand.service';
import { TemplateService } from 'src/app/service/template-service.service';
import { ToastService } from 'src/app/shared/toast-service.service';
import { NzUploadChangeParam, NzUploadFile } from 'ng-zorro-antd/upload';
// import { BASE_URL } from '../config/app-config';
import { BASE_URL } from 'src/app/config/app-config';
import { ActivatedRoute } from '@angular/router';



@Component({
  selector: 'app-verification-launch',
  templateUrl: './verification-launch.component.html',
  styleUrls: ['./verification-launch.component.scss']
})
export class VerificationLaunchComponent {


  apiUrl = `${BASE_URL}/rcs-reseller-service/uploadFileService/uploadFile`

  currentStep = 0;
  brandForm: FormGroup;
  verifyForm : FormGroup;
  verificationForm : FormGroup;
  docType: any;
  docType2: any;
  brandDataList: any;
  isOptOutByPlatform = "true";
  isCarrierEdited  = " true";
  verifyFormobj : any;
  isConversationalSupported = "false"
  botId: string = '';
  kycDetails : any = '';
  isVisible = false;
  formData: FormData | undefined;
  isConfirmLoading = false;
  imageUrl: string ="";
  getDocumentTypeId : any = "";
  operatorBrandid : any = "";
  filename = ""
  brandFilename= ""
  backgroundUrl: SafeUrl | null = null;
  croppedImage: any = '';
  file: File | null = null;
  uploadedFileUrl: string = '';
  newuploadedFileUrl : string = '';
  screenshoteUrlArray: { imageName: string }[] = [];
  id=''
  imageChangedEvent: any;
  data:any
  brand:string=this.botService.getBotDetails()?.brandName  
  sessionStorage: any;

  uploadedFiles: any[] = [
    { docType: '', fileName: '', otherType: '' } // Default one file upload section
  ];

  fileName: string =this.getRandomValue().toString()+".png";
  fileType : any;
  token=sessionStorage.getItem('TOKEN') || ''
  uploadData: any = {
    userName: sessionStorage.getItem('USER_NAME') || '',
    fileType: '',
    fileName: ''
  };  
  userName = sessionStorage.getItem('USER_NAME') || '';

  

 

  handleUploadChange(event: { file: NzUploadFile }): void {
    if (event.file.status === 'uploading') {
     
      this.uploadData = {
        ...this.uploadData,
        fileType: event.file.type,
        fileName: event.file.name
      };
    }
  
    if (event.file.status === 'done') {
      this.toastService.publishNotification("Success", "File uploaded successfully.");
      this.uploadedFileUrl = event.file.response.data.serverFileName
      console.log("Upload Response:", event.file.response.data.fileAccessUrl);


    } else if (event.file.status === 'error') {
      this.toastService.publishNotification("Error", "Upload failed.", "error");
    }
  }
  

  getRandomValue(): number {
    return Math.floor(Math.random() * 1000000);

  }

  handleUploadChange1(event: { file: NzUploadFile }): void {
    if (event.file.status === 'uploading') {
     
      this.uploadData = {
        ...this.uploadData,
        fileType: event.file.type,
        fileName: event.file.name
      };
    }
  
    if (event.file.status === 'done') {
      this.toastService.publishNotification("Success", "File uploaded successfully.");
      this.newuploadedFileUrl = event.file.response.data.serverFileName
      console.log("Upload Response:", event.file.response.data.fileAccessUrl);


    } else if (event.file.status === 'error') {
      this.toastService.publishNotification("Error", "Upload failed.", "error");
    }
  }


  handleUploadChange2(event: { file: NzUploadFile, fileList: NzUploadFile[] }): void {
    if (event.file.status === 'uploading') {
    
      this.uploadData = {
        ...this.uploadData,
        fileType: event.file.type,
        fileName: event.file.name
      };
    }
  
    if (event.file.status === 'done') {
      this.toastService.publishNotification("Success", "File uploaded successfully.");
      console.log("Upload Response:", event.file.response.data.fileAccessUrl);
  
      
      if (event.fileList.length > 1) {
        this.screenshoteUrlArray = this.screenshoteUrlArray || [];
        this.screenshoteUrlArray.push({ imageName: event.file.response.data.serverFileName });
      } else {
        this.screenshoteUrlArray = [{ imageName: event.file.response.data.serverFileName }];
      }
  
    } else if (event.file.status === 'error') {
      this.toastService.publishNotification("Error", "Upload failed.", "error");
    }
  }
  
  


handleOk(file: NzUploadFile): void {
//const file =event
console.log(file);
this.formData = new FormData();
  
if (this.file) {
      this.formData.append('file', this.file, this.filename);
      this.formData.append('fileType' , this.fileType , this.fileType)
    } else {
      console.error("No file selected.");
      this.toastService.publishNotification("Error", "Please select a file.", "error");
      this.isConfirmLoading = false;
      return;
    }
  
    const userName = sessionStorage.getItem('USER_NAME') || '';
    this.formData.append('userName', userName);
    
    
    this.botService.uplodFile(this.formData).subscribe({
      next: (result) => {
        console.log("File Upload Response:", result);

        if(result.status = "SUCCESS"){
          this.uploadedFileUrl = result.uploadedFilePath;
          console.log(this.uploadedFileUrl);
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












  getUploadData() {
    return {
      fileName: this.fileName, // Send file name
      loggedInUserName: sessionStorage.getItem('USER_NAME'),
      fileType: 'document'
    
    };
  }

  getBranddetails(brand :any){
    let dte = {
      loggedInUserName:sessionStorage.getItem('USER_NAME'),
      brandName:brand,
    }
    this.brands.branddetails(dte).subscribe((res: any) => {
      console.log(res);
      if (res) {
        this.data = res; 
        this.imageUrl=res.brandLogo
        this.fileName=res.fileName
        this.operatorBrandid = res.operatorBrandId
        this.brandFilename = res.fileName
        this.brandForm.patchValue({
          brandName:this.data.brandName,
          officialWebsite: this.data.officialWebsite,
          industryType : this.data.industryType,
          firstName :  this.data.firstName,
          lastName : this.data.lastName,
          designation :  this.data.designation ,
          email: this.data.email,
          mobileNumber: this.data.mobileNumber,
          addressLine1:this.data.addressLine1,
          addressLine2: this.data.addressLine2,
          city: this.data.city,
          state :this.data.state,
          country : this.data.country,
          postalCode :this.data.postalCode,

        })
      } else {
        this.data = []; 
        
      }

    });

   }

  constructor(private route: ActivatedRoute,private brands : BrandService,private fb: FormBuilder ,  private botService : BotServiceService , private  templateService :  TemplateService , private toastService: ToastService, private sanitizer: DomSanitizer)  { 
    this.id = this.route.snapshot.paramMap.get('id')||'';
   
    this.verifyForm = this.fb.group({ 
      
        botId:[this.id],
        webhookUrl: [""],  
        optInMessage: [" "],
        videoUrl: [""],  
        botAccessInstructions: [""],
        triggerAction: [""],  
        botInteractionTypes: [""],  
        
       
        imageName: this.screenshoteUrlArray,
        

        isCarrierEdited:  true,
        carrierList: [[1, 410, 96]], 
        isOptOutByPlatform: true,  
        optOutKeyword: [""],  
        optOutMessage: [""],  
        revokeOptOut: [""],
        revokeOptOutMessage: [""],  
        isConversationalSupported: false,
      
      })

    this.brandForm = this.fb.group({

  

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




        })
      

      this.verificationForm = this.fb.group({

      kycDetails: [
      {
        documentType: "businessNameDoc",
        documentName: this.docType,
        fileName:this.uploadedFileUrl,
        documentTypeId: 1
      },
      {
        documentType: "businessAddressDoc",
        documentName: this.docType2,
        fileName: "",
        documentTypeId: 2
      }
    ]


    


      
      })
    }

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



  
  onStepChange(index: number): void {
    this.currentStep = index;
  }

  showModal(): void {
    this.isVisible = true;
  }

  handleCancel(): void {
    this.isVisible = false;
  }


  

 





  nextStep(): void {
    
      this.getBranddetails(this.brand)
    
    if (this.currentStep < 2) {
      this.currentStep++;
    }
  }

  prevStep(): void {
    if (this.currentStep > 0) {
      this.currentStep--;
    }
  }
  // beforeUpload = (file: File): boolean => {
  //   console.log('Uploaded File:', file);
  //   return false; // Prevent automatic upload
  // };



  // onSumbit(){
  //   let dt1 = {
  //     "loggedInUserName": sessionStorage.getItem('USER_NAME'),
  //     "data": {
  //   "botId": this.botService.getBotDetails()?.botId,
  //   "webhookUrl": "https://google.com/webhook ",
  //   "optInMessage":this.verifyForm.get('optInMessage')?.value ,
  //   "videoUrl": this.verifyForm.get('videoUrl')?.value,
  //   "botAccessInstructions": this.verifyForm.get('botAccessInstructions')?.value,
  //   "triggerAction": this.verifyForm.get('triggerAction')?.value,
  //   "botInteractionTypes":  this.verifyForm.get('botInteractionTypes')?.value,
  //   "screenImage": this.screenshoteUrlArray ,
  //   "isCarrierEdited":  true,
  //   "carrierList": [
  //     1,
  //     410,
  //     96
  //   ],
  //   "isOptOutByPlatform": true,
  //   "optOutKeyword": this.verifyForm.get('optOutKeyword')?.value,
  //   "optOutMessage": this.verifyForm.get('optOutMessage')?.value,
  //   "revokeOptOut":this.verifyForm.get('revokeOptOut')?.value,
  //   "revokeOptOutMessage": "Welcome back",
  //   "isConversationalSupported":false,

  //   "brandDetails": {
  //     "brandName": this.brandForm.get('brandName')?.value,
  //     "brandId": this.operatorBrandid,
  //     "brandLogoUrl":  this.brandFilename,
  //     "industryId": 5,
  //     "industryType": this.brandForm.get('industryType')?.value,
  //     "address": {
  //       "addressLine1": this.brandForm.get('addressLine1')?.value,
  //       "addressLine2": this.brandForm.get('addressLine2')?.value,
  //       "city": this.brandForm.get('city')?.value,
  //       "state": this.brandForm.get('state')?.value,
  //       "zipCode": this.brandForm.get('postalCode')?.value,
  //       // "countryId": this.brandForm.get('countryId')?.value
  //       "countryId": 1

  //     },
  //     "brandEmails": [
  //       {
  //         "contactFirstName": this.brandForm.get('firstName')?.value,
  //         "contactLastName": this.brandForm.get('lastName')?.value,
  //         "contactDesignation": this.brandForm.get('designation')?.value,
  //         "email": this.brandForm.get('email')?.value,
  //         "mobile": this.brandForm.get('mobileNumber')?.value,
  //       }
  //     ],
  //     "brandWebsite": this.brandForm.get('officialWebsite')?.value
  //   },
  //   "kycDetails": [
  //     {
  //       "documentType": " Business Name",
  //       "documentName":this.docType,
  //       "fileName": this.uploadedFileUrl,
  //       "documentTypeId": 1
  //     },
  //     {
  //       "documentType": "Business Address",
  //       "documentName": this.docType2,
  //       "fileName": this.newuploadedFileUrl,
  //       "documentTypeId": 2
  //     }
  //   ]
    

  // }


  //   };

  //   console.log(this.botService.getBotDetails());
  //   this.botService.verifyBrand(dt1).subscribe((res: any) => {
  //     console.log(res);
  //     if (res.data && res.data.dataList) {
  //       this.brandDataList = res.data.dataList; 
  //     }
  //   });
    
  // }

  onSumbit() {
    let dt1 = {
      "loggedInUserName": sessionStorage.getItem('USER_NAME'),
      "data": {
        "botId": this.botService.getBotDetails()?.botId,
        "webhookUrl": "https://google.com/webhook",
        "optInMessage": this.verifyForm.get('optInMessage')?.value,
        "videoUrl": this.verifyForm.get('videoUrl')?.value,
        "botAccessInstructions": this.verifyForm.get('botAccessInstructions')?.value,
        "triggerAction": this.verifyForm.get('triggerAction')?.value,
        "botInteractionTypes": this.verifyForm.get('botInteractionTypes')?.value,
        "screenImage": this.screenshoteUrlArray,
        "isCarrierEdited": true,
        "carrierList": [1, 410, 96],
        "isOptOutByPlatform": true,
        "optOutKeyword": this.verifyForm.get('optOutKeyword')?.value,
        "optOutMessage": this.verifyForm.get('optOutMessage')?.value,
        "revokeOptOut": this.verifyForm.get('revokeOptOut')?.value,
        "revokeOptOutMessage": "Welcome back",
        "isConversationalSupported": false,
        "brandDetails": {
          "brandName": this.brandForm.get('brandName')?.value,
          "brandId": this.operatorBrandid,
          "brandLogoUrl": this.brandFilename,
          "industryId": 5,
          "industryType": this.brandForm.get('industryType')?.value,
          "address": {
            "addressLine1": this.brandForm.get('addressLine1')?.value,
            "addressLine2": this.brandForm.get('addressLine2')?.value,
            "city": this.brandForm.get('city')?.value,
            "state": this.brandForm.get('state')?.value,
            "zipCode": this.brandForm.get('postalCode')?.value,
            "countryId": 1
          },
          "brandEmails": [
            {
              "contactFirstName": this.brandForm.get('firstName')?.value,
              "contactLastName": this.brandForm.get('lastName')?.value,
              "contactDesignation": this.brandForm.get('designation')?.value,
              "email": this.brandForm.get('email')?.value,
              "mobile": this.brandForm.get('mobileNumber')?.value
            }
          ],
          "brandWebsite": this.brandForm.get('officialWebsite')?.value
        },
        "kycDetails": [
          {
            "documentType": "Business Name",
            "documentName": this.docType,
            "fileName": this.uploadedFileUrl,
            "documentTypeId": 1
          },
          {
            "documentType": "Business Address",
            "documentName": this.docType2,
            "fileName": this.newuploadedFileUrl,
            "documentTypeId": 2
          }
        ]
      }
    };
  
    console.log(this.botService.getBotDetails());
  
    this.botService.verifyBrand(dt1).subscribe({
      next: (res: any) => {
        console.log(res);
        if (res.result =="Success") {
          this.brandDataList = res.data.dataList;
          this.toastService.publishNotification("Success", "Form submitted successfully!");
      
          this.brandForm.reset();
          this.verifyForm.reset();
          this.docType = '';
          this.uploadedFileUrl = '';
          this.docType2 = '';
          this.newuploadedFileUrl = '';
          }
        else{
          this.toastService.publishNotification("Error", res.message || "An error occurred", "error");
        }
      },
      
      error: (error) => {
        console.error('Error while submitting brand data:', error);
        this.toastService.publishNotification("Error", error.message || "An error occurred", "error");
      }
    });
  
  }
  
  

}