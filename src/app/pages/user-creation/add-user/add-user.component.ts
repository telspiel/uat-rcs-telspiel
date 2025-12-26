import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators, FormControl } from '@angular/forms';
import {UserCreationService} from"../../../service/user-creation.service"
import { differenceInCalendarDays } from 'date-fns';
import { ToastService } from 'src/app/shared/toast-service.service';
import { ReactiveFormsModule } from '@angular/forms';
import { NzUploadFile } from 'ng-zorro-antd/upload';
import { NgxUiLoaderService } from 'ngx-ui-loader';
import { formatDate } from '@angular/common';
import { AccountManagerService } from 'src/app/service/account-manager.service';


@Component({
  selector: 'app-add-user',
  templateUrl: './add-user.component.html',
  styleUrls: ['./add-user.component.scss']
})


export class AddUserComponent {
  role=sessionStorage.getItem('ROLE')||""
  today = new Date();
  status =""
  day = this.today.getDate();
  month = this.today.getMonth() + 1;
  year = this.today.getFullYear();
  addUserForm: FormGroup ;
  Permission = '';
  CreditHistory ="";
  MobileNumberMasking="";
  DLRRetry="";
  usertype="";
  reportList : any;
  selectedFile: File | null = null;
  previewImage: string | ArrayBuffer | null = null;
  userNameExists=false;
  emailExists=false;
  dlrDefaltBody="{'message_id':'#messageid#','sent_time':'#senttime#','dlr_time':'#dlrtime#','status':'#status#'}"
EndOfCampaignDate = 'EndOfCampaignDate';
TwentyFourHrFromCampTime = '24HrFromCampTime';
// Retrieve billingType from sessionStorage




  logColor() {
    console.log("user creation colour"+this.selectedColor); // Logs the selected color
  }

  selectedColor: string = '#ffcc29';
  // useraccounttype="";
  userObj:any
  userType:string | null
  accountManagerName: string = '';

  billingType: string | null
  fileList: NzUploadFile[] = [];
  
  get isAdmin(): boolean {
    return this.userType === 'admin';
  }

  get allowedBillingTypes(): string[] {
    if (this.isAdmin) {
      return ['Prepaid', 'Postpaid'];
    }
    if (this.billingType) {
      return [this.billingType];
    }
    return [];
  }

  get themeColorControl(): FormControl {
    return this.addUserForm.get('Themecolor') as FormControl;
  }

  onColorCodeInput(value: string) {
    // Validate hex color code (basic)
    if (/^#[0-9A-Fa-f]{6}$/.test(value)) {
      this.selectedColor = value;
      this.addUserForm.get('Themecolor')?.setValue(value);
    }
  }

  constructor(private fb: FormBuilder,
    private ngxLoader: NgxUiLoaderService,
    private userCreation: UserCreationService,
    private toastService:ToastService,
    private accountService : AccountManagerService
  ){
    this.billingType = (sessionStorage.getItem('billingType'));
    console.log("billing type here is "+this.billingType)
    this.userType=(sessionStorage.getItem('ROLE'))
    console.log(this.userType)
    this.addUserForm = this.fb.group({
    usertype: [this.usertype, [Validators.required]],
    UserName: ["", [Validators.required, Validators.pattern(/^\S*$/)]], // No spaces allowed
    email: ["", [Validators.required, Validators.email]],
    Password: [
      this.randomPassword(10),
      [
      Validators.required,
      ]
    ],
    is2FARequid: ['No'], 
    billingMethod: [true],
    billingtype: [""],
    billngcycle: [""],
    senderidtype: [""],
    priority: [""],
    Auth: [""],
    Expiry: [""],
    traffictype: [""],
    Status: [""],
    plan: [""],
    mobile: [
      "",
      [
        Validators.required,
        Validators.pattern(/^\+?[1-9]\d{9,14}$/) // Allows optional +, starts with non-zero, 10-15 digits, no spaces
      ]
    ],
    account: [""],
    Client: [""],
    Department: [""],
    dlrRetry: [this.DLRRetry],
    retryCount: [""],
    Permission: [this.Permission],
    CreditHistory: [this.CreditHistory],
    accountManagerName : [this.accountManagerName],
    MobileNumberMasking: [this.MobileNumberMasking],
    MaskingCount: [""],
    creditRefund:[false],
    messageExpiry:[false],
    dlrHandover:[false],
    isBlackListAllowed:["No"],
    dlrCallbackApiMethod:["GET"],
    dlrCallbackUrl:[""],
    dlrAccessToken:[""],
    dlrRequestBodyType:["Default"],
    dlrRequestBody:[ this.dlrDefaltBody ],
    campaignFrequency:[""],
    IsOTPAccount: [""],
    RejectFailedNumber: [""],
    IsVisualizeAllowed: [""],
    TM1_Id: [""],
    TM2_Id: [""],
    TDID: [""],
    DLRUrlType: [""],
    DLRPushURL: [""],
    EnableWhiteListIP: [""],
    WhiteListIp: [""],
    DLRBody: [""],
    panelIpForReseller: [""],
    panelDomainForReseller: [""],
    panelIpForWebtool: [""],
    panelDomainForWebtool: [""],
    userComment: [""],
    Themecolor: [""],
    isAddOperatorViewAllowed:['false'],
  });




  }
  
  ngOnInit(){
    this.viewAccount();
    this.addUserForm.get('dlrRequestBodyType')?.valueChanges.subscribe((value: string) => {
      if (value === "Default") {
        this.addUserForm.get('dlrRequestBody')?.setValue(this.dlrDefaltBody);
      } else {
        this.addUserForm.get('dlrRequestBody')?.setValue("");
      }
    });
  }


  disabledDate = (current: Date): boolean => differenceInCalendarDays(current, this.today) <= 0;
  
  getStatus(controlName: string): 'error' | 'success'|  null {
    const control = this.addUserForm.get(controlName);
    if (control?.touched && control?.invalid) {
      return 'error';
    }
    if (control?.valid) {
      return 'success';
    }
    return null;
  }

  updateColorCode(event: Event): void {
    const inputElement = event.target as HTMLInputElement;
    this.selectedColor = inputElement.value;
  }
  randomPassword(length: number): string {
    const charset = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
    let password = "";
    for (let i = 0; i < length; i++) {
      const randomIndex = Math.floor(Math.random() * charset.length);
      password += charset[randomIndex];
    }
    return password;
  }
  checkavailability(){
    const dt = {username:this.addUserForm.value.UserName , email:this.addUserForm.value.email.trim()};
    this.userCreation.checkavailability(dt).subscribe({
      next:(res)=>{
        this.userNameExists=res.usernameExists
        console.log(this.userNameExists)
        this.emailExists=res.emailExists

        if(this.userNameExists ){
          this.addUserForm.get('UserName')?.setErrors({ 'incorrect': true });
        }
        if(this.emailExists){
          this.addUserForm.get('email')?.setErrors({ 'incorrect': true });
        }
      }
    })
  }

  onFileSelected(event: any) {
    const file = event.target.files[0];
  
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        this.previewImage = e.target?.result as string | ArrayBuffer | null; // Show image preview
      };
      reader.readAsDataURL(file);
  
      // Prepare FormData
      const formData = new FormData();
      formData.append("loggedInUserName", sessionStorage.getItem('USER_NAME') || ""); // Ensure a valid string
      formData.append("file", file); // Append binary file
  
      // Call API to upload logo
      // this.userCreation.userlogo(formData).subscribe(
      //   (response) => {
      //     console.log("File uploaded successfully:", response);
      //   },
      //   (error) => {
      //     console.error("File upload failed:", error);
      //   }
      // );
    }
  }
  
  

  onSubmit() {
    if (this.addUserForm.invalid) {
      this.addUserForm.markAllAsTouched();
      const controls = this.addUserForm.controls;
      let errorMessages: string[] = [];
      Object.keys(controls).forEach(key => {
        const control = controls[key];
        if (control.invalid) {
          if (control.errors?.['required']) {
            errorMessages.push(`${key} is required`);
          }
          if (control.errors?.['email']) {
            errorMessages.push(`Invalid email format`);
          }
          if (control.errors?.['pattern']) {
            errorMessages.push(`${key} has invalid format`);
          }
          if (control.errors?.['incorrect']) {
            errorMessages.push(`${key} already exists`);
          }
        }
      });
      if (errorMessages.length > 0) {
        errorMessages.forEach(msg => {
          this.toastService.publishNotification(msg, "error", "error");
        });
      } else {
        this.toastService.publishNotification("Please fill all the required fields", "error", "error");
      }
      return;
    }
    // Check if username or email already exists before proceeding
    if (this.userNameExists || this.emailExists) {
      this.toastService.publishNotification(
      this.userNameExists && this.emailExists
        ? "Username and Email already exist"
        : this.userNameExists
        ? "Username already exists"
        : "Email already exists",
      "error",
      "error"
      );
      return;
    }
    const rawDate: Date = new Date(this.addUserForm.value.Expiry);
  const formattedDate = formatDate(rawDate, 'yyyy-MM-dd HH:mm:ss', 'en-IN', 'Asia/Kolkata');

    this.userObj = {
      loggedInUserName: sessionStorage.getItem('USER_NAME'),
      themeColor: this.addUserForm.value.Themecolor,
      operation: "addUser",
       accountType: "web",
      walletBillingMethod: this.addUserForm.value.billingMethod === true? true: "",
      creditBillingMethod: this.addUserForm.value.billingMethod === false ? true : "",
      customerType: this.addUserForm.value.usertype,
      userName: this.addUserForm.value.UserName,
      userPassword: this.addUserForm.value.Password,
      email: this.addUserForm.value.email,
      accountManagerName : this.addUserForm.value.accountManagerName,
      isAddOperatorViewAllowed: this.addUserForm.value.isAddOperatorViewAllowed,
      mobile: this.addUserForm.value.mobile,
      status: this.addUserForm.value.Status,
      billingType: this.addUserForm.value.billingtype,
      createdDate: `${this.year}-${this.month}-${this.day}`,
      updatedDate: `${this.year}-${this.month}-${this.day}`,
      updatedBy: "adminUser",
      is2FARequid: this.addUserForm.value.is2FARequid,
      creditRefund: this.addUserForm.value.creditRefund,
      dlrHandover:this.addUserForm.value.dlrHandover,
      isBlackListAllowed:this.addUserForm.value.isBlackListAllowed,
      dlrCallbackApiMethod:this.addUserForm.value.dlrCallbackApiMethod,
      dlrCallbackUrl:this.addUserForm.value.dlrCallbackUrl,
      dlrAccessToken:this.addUserForm.value.dlrAccessToken,
      dlrRequestBodyType:this.addUserForm.value.dlrRequestBodyType,
      dlrRequestBody:this.addUserForm.value.dlrRequestBody,
      messageExpiry: this.addUserForm.value.messageExpiry,
      campaignFrequency: this.addUserForm.value.campaignFrequency,
      userComment: this.addUserForm.value.userComment,
      ipAddress: "",
      domainName: "",
      billingCycle: this.addUserForm.value.billngcycle,
      // userExpiryDate: this.addUserForm.value.Expiry,
      userExpiryDate: formattedDate,
      priority: this.addUserForm.value.priority,
      credentials: {
        emailId: this.addUserForm.value.email,
        password: this.addUserForm.value.Password,
        mobileNumber: this.addUserForm.value.mobile,
        panelIpForReseller: this.addUserForm.value.panelIpForReseller,
        panelDomainForReseller: this.addUserForm.value.panelDomainForReseller,
        panelIpForWebtool: this.addUserForm.value.panelIpForWebtool,
        panelDomainForWebtool: this.addUserForm.value.panelDomainForWebtool
      }
    };
  
    if (this.addUserForm.valid) {
     
      this.ngxLoader.start();
  
      this.userCreation.addUser(JSON.stringify(this.userObj)).subscribe({
        next: (res) => {
          this.ngxLoader.stop();
  
          if (res.result.toLowerCase() === "success") {
            this.toastService.publishNotification("User created", "success", "success");
            this.addUserForm.reset();
          } else {
            this.toastService.publishNotification("Something Went Wrong", "error", "error");
          }
        },
        error: (err) => {
          
          this.ngxLoader.stop();
  
          this.toastService.publishNotification(err.error?.error || "An error occurred", err.status, "error");
        }
      });
    } else {
      this.addUserForm.markAllAsTouched();
    }
  }
  


  onBillingMethodChange(selectedMethod: string) {
    if (selectedMethod) {
      this.userObj.walletBillingMethod = selectedMethod;
      this.userObj.creditBillingMethod = ""; 
    } else{
      this.userObj.creditBillingMethod = selectedMethod;
      this.userObj.walletBillingMethod = "";  
    }
  }


    viewAccount(){
      let dt  = {
      loggedInUserName : sessionStorage.getItem('USER_NAME'),
      }

      this.accountService.viewAccont(dt).subscribe((res)=>{

        this.reportList  = res.dataList; 



      })
    };
  
}