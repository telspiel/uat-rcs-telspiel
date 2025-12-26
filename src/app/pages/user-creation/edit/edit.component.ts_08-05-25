import { Component, inject, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { UserCreationService } from 'src/app/service/user-creation.service';
import { ToastService } from 'src/app/shared/toast-service.service';
import { differenceInCalendarDays } from 'date-fns';
import { NgxUiLoaderService } from 'ngx-ui-loader';
import { formatDate } from '@angular/common';

@Component({
  selector: 'app-edit',
  templateUrl: './edit.component.html',
  styleUrls: ['./edit.component.scss']
})
export class EditComponent {

EndOfCampaignDate = 'EndOfCampaignDate';
TwentyFourHrFromCampTime = '24HrFromCampTime';

  updateForm: FormGroup;
  selectForm: FormGroup;
  isShow="false"
  // emailExists=false;
   emailExists: boolean = false;
  userNameExists=false;
  userCreation= inject(UserCreationService)
  toastService=inject(ToastService)
  status =""
    selectedColor: string = '';
  today = new Date();
    role=sessionStorage.getItem('ROLE')|| ""
  day = this.today.getDate();
  month = this.today.getMonth() + 1;
  year = this.today.getFullYear();
  dt = {
    loggedInUsername: "",
    userId:""
  }
  Clientlist : any []=[]
  ResllerList : any []=[]
  SellerList :any []=[]
 
  CreditHistory ="true";
  MobileNumberMasking="true";
  Reseller="";
  Seller="";
  client="";
  UserName = "";
  email="";
  Password="";
  themeColor="";
  // useraccounttype="";
  bilingMethod = "true";
  billingtype=""
  billngcycle=""
  senderidtype=""
  priority=""
  Auth=""
  Expiry=""
  traffictype=""
  Status=""
  plan=""
  mobile=""
  account=""
  Client=""
  Department=""
  dlrRetry=""
  retryCount=""
  Permission=""
  MaskingCount=""
  IsOTPAccount=""
  RejectFailedNumber=""
  IsVisualizeAllowed=""
  TM1_Id=""
  TM2_Id=""
  TDID=""
  creditRefund=""
  messageExpiry= ""
    dlrHandover= ""
    isBlackListAllowed = ""
    dlrCallbackApiMethod= ""
    dlrCallbackUrl= ""
    dlrRequestBodyType= ""
    dlrRequestBody= ""
  campaignFrequency=""
  OTPMasking=""
  SMPPCharSet=""
  WhiteListIp=""
  TX=""
  TRX=""
  RX=""
  usertype=""
 isAddOperatorViewAllowed= ""
 AddOperatorViewAllowed = '';
  userObj:any;
  userdt:any;
  DLRRetry: any;
Adminlist: any;
Admin: any;
is2FARequid = 'No';
dlrDefaltBody="{'message_id':'#messageid#','sent_time':'#senttime#','dlr_time':'#dlrtime#','status':'#status#'}"
  billingType: string | null
  get isAdmin(): boolean {
    return this.role === 'admin';
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
  constructor(private fb: FormBuilder, private ngxLoader: NgxUiLoaderService,) {
    this.billingType = (sessionStorage.getItem('billingType'));
    this.selectForm = this.fb.group({
      Reseller: [this.Reseller,],
      Seller: [this.Seller,],
      Client: [this.client,]
    })
    const username = {
      userName: sessionStorage.getItem('USER_NAME')
    }

    this.userdt =
    {
      loggedInUsername: sessionStorage.getItem('USER_NAME'),
      userId: sessionStorage.getItem('USER_ID')
    }
    this.getOptions()
    this.updateForm = this.fb.group({
     usertype: [null],
      UserName: [{value:'', disabled:'true'}],
      email: ["", [Validators.required, Validators.email]],
      Password: [this.Password],
      themeColor: [this.themeColor],
      // useraccounttype: [this.useraccounttype],
      billingMethod:[this.bilingMethod],
      billingtype: [this.billingtype],
      billngcycle: [this.billngcycle],
      senderidtype: [this.senderidtype],
      priority: [null, Validators.required],
      Auth: [this.Auth],
      Expiry: [this.Expiry],
      traffictype: [this.traffictype],
      Status: [this.Status],
      plan: [this.plan],
      mobile: [this.mobile, [
      Validators.required,
      Validators.pattern(/^[\d+]+$/) // Only digits and plus sign allowed
    ]],
      is2FARequid: [this.is2FARequid],
      creditRefund:[this.creditRefund],
      messageExpiry:[this.messageExpiry],
      dlrHandover:[this.dlrHandover],
      isBlackListAllowed: [this.isBlackListAllowed],
      dlrCallbackApiMethod:[this.dlrCallbackApiMethod],
      dlrCallbackUrl:[this.dlrCallbackUrl],
      dlrRequestBodyType:[this.dlrRequestBodyType],
      dlrRequestBody:[this.dlrRequestBody],
      campaignFrequency:[this.campaignFrequency],
      account: [this.account],
      Client: [this.Client],
      Department: [this.Department],
      dlrRetry: [this.dlrRetry,],
      retryCount: [this.retryCount,],
      Permission: [this.Permission,],
      CreditHistory: [this.CreditHistory,],
      MobileNumberMasking: [this.MobileNumberMasking,],
      MaskingCount: [this.MaskingCount,],
      IsOTPAccount: [this.IsOTPAccount,],
      RejectFailedNumber: [this.RejectFailedNumber,],
      IsVisualizeAllowed: [this.IsVisualizeAllowed,],
      TM1_Id: [this.TM1_Id,],
      TM2_Id: [this.TM2_Id,],
      TDID: [this.TDID,],
      OTPMasking:[this.OTPMasking,],
      SMPPCharSet:[this.SMPPCharSet,],
      WhiteListIp:[this.WhiteListIp],
      TX:[this.TX],
      TRX:[this.TRX],
      RX:[this.RX],
      dlrMediumType:[''],
      // isAddOperatorViewAllowed:[this.isAddOperatorViewAllowed],
     isAddOperatorViewAllowed: [],
    })
  }

  getStatus(controlName: string): 'error' | 'success'|  null {
    const control = this.updateForm.get(controlName);

    if (control?.touched && control?.invalid) {
      return 'error';
    }
    if (control?.valid) {
      return 'success';
    }
    return null;
  }
  

  checkavailability(){
    const dt = {username:this.updateForm.value.UserName , email:this.updateForm.value.email};
    this.userCreation.checkavailability(dt).subscribe({
      next:(res)=>{
        this.userNameExists=res.usernameExists
        console.log(this.userNameExists)
        this.emailExists=res.emailExists

        if(this.userNameExists ){
          this.updateForm.get('UserName')?.setErrors({ 'incorrect': true });
        }
        if(this.emailExists){
          this.updateForm.get('email')?.setErrors({ 'incorrect': true });
        }
      }
    })
  }


  ngOnInit(){
    
    
    this.updateForm.get('dlrRequestBodyType')?.valueChanges.subscribe((value: string) => {
      if (value === "Default") {
        this.updateForm.get('dlrRequestBody')?.setValue(this.dlrDefaltBody);
      } else {
        this.updateForm.get('dlrRequestBody')?.setValue("");
      }
    });
    
  }


   updateColorCode(event: Event): void {
    const inputElement = event.target as HTMLInputElement;
    this.selectedColor = inputElement.value;
    this.updateForm.get('themeColor')?.setValue(this.selectedColor);
  }

  onSubmit(){
  if (this.updateForm.invalid) {
     this.updateForm.markAllAsTouched();
    this.toastService.publishNotification("Please fill the required fields", "error", "error");
    return;
  }

  if (this.emailExists) {
      this.toastService.publishNotification(
        "Email already exists",
        "error",
        "error"
      );
      return;
    }
    const rawDate: Date = new Date(this.updateForm.value.Expiry);
     const formattedDate = formatDate(rawDate, 'yyyy-MM-dd HH:mm:ss', 'en-IN', 'Asia/Kolkata');
   this.userObj={
       loggedInUserName: sessionStorage.getItem('USER_NAME'),
       operation: "editUser",
       customerType: this.updateForm.value.usertype,
       userName: this.UserName,
       userPassword: this.updateForm.value.Password ,
       themeColor: this.updateForm.value.themeColor,
       accountType: "web",
       email: this.updateForm.value.email,
      // billingMethod: [null],
      walletBillingMethod: this.updateForm.value.billingMethod === true ? true: "",
      creditBillingMethod: this.updateForm.value.billingMethod === false ? true : "",
       mobile:  this.updateForm.value.mobile,
       status:  this.updateForm.value.Status,
       billingType: this.updateForm.value.billingtype,
       is2FARequid: this.updateForm.value.is2FARequid,
       createdDate: `${this.year}-${this.month}-${this.day}`,
       updatedDate: `${this.year}-${this.month}-${this.day}`,
       creditRefund: this.updateForm.value.creditRefund,
      messageExpiry: this.updateForm.value.messageExpiry,
       dlrHandover:this.updateForm.value.dlrHandover,
       isBlackListAllowed : this.updateForm.value.isBlackListAllowed,
      dlrCallbackApiMethod: this.updateForm.value.dlrCallbackApiMethod,
      dlrCallbackUrl:this.updateForm.value.dlrCallbackUrl,
      dlrRequestBodyType:this.updateForm.value.dlrRequestBodyType,
      dlrRequestBody:this.updateForm.value.dlrRequestBody,
      campaignFrequency: this.updateForm.value.campaignFrequency,
       updatedBy: sessionStorage.getItem('USER_NAME'),
       userComment: this.updateForm.value.userComment,
       ipAddress: "null",
       isAddOperatorViewAllowed: this.updateForm.value.isAddOperatorViewAllowed,
       domainName: "null",
       billingCycle: this.updateForm.value.billngcycle,
      //  dlrMediumType:this.updateForm.value.useraccounttype,
      // userExpiryDate:this.updateForm.value.Expiry ,
      userExpiryDate: formattedDate,
       priority: this.updateForm.value.priority,
       credentials: {
         emailId: this.updateForm.value.email,
         password: this.updateForm.value.Password,

         mobileNumber: this.updateForm.value.mobile,
         panelIpForReseller: this.updateForm.value.panelIpForReseller,
         panelDomainForReseller: this.updateForm.value.panelDomainForReseller ,
         panelIpForWebtool: this.updateForm.value.panelIpForWebtool,
         panelDomainForWebtool: this.updateForm.value.panelDomainForWebtool
       }
     
   }
   
  
   {
    this.ngxLoader.start();
   this.userCreation.addUser(JSON.stringify(this.userObj)).subscribe(
     {
       next:(res)=> {
        this.ngxLoader.stop();
      if (res.result.toLowerCase() === "success")
       {this.toastService.publishNotification("User Update Successfully", "success", "success")
       this.isShow ='false'
       this.Reseller = ""
      this.Seller = ""
      this.client = ""
      this.Admin = ""
       }
      else {
       this.toastService.publishNotification("Something Went Wrong", "error", "error")
      }
      },
       error: (err)=>{
        this.ngxLoader.stop();
        this.toastService.publishNotification(err.error.error, err.status, "error")
    
       }
      }
   )
   
   }
   }
   disabledDate = (current: Date): boolean => differenceInCalendarDays(current, this.today) <= 0;
   getOptions() {
    this.userCreation.getAllChildForUser(this.userdt).subscribe(
      (res) => {
        this.Adminlist=[res.data.userAllChildMap.ADMIN].flatMap((obj: any) => {
          return Object.entries(obj).map(([key, value]) => ({
            label: key,
            value: value
          }))
        });
        this.SellerList = [res.data.userAllChildMap.SELLER].flatMap((obj: any) => {
          return Object.entries(obj).map(([key, value]) => ({
            label: key,
            value: value
          }))
        }
        )
        this.Clientlist = [res.data.userAllChildMap.CLIENT].flatMap((obj: any) => {
          return Object.entries(obj).map(([key, value]) => ({
            label: key ,
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
    const username = {
      userName: Value
    }
    this.userCreation.getUser(username).subscribe(
      {
next: (res) => {
  this.isShow = 'true';
  this.UserName = res.data.user.userName;
  // Determine billing method
  let billingMethodValue: boolean | null = null;
  if (res.data.user.walletbillingMethod === 'true') {
    billingMethodValue = true; // Wallet
  } else if (res.data.user.creditbillingMethod === 'true') {
    billingMethodValue = false; // Credit
  }


const user = res.data.user; // or res.user, depending on your response

if (user) {
  const rawValue = user.isAddOperatorViewAllowed;
  const AddOperatorViewAllowed = typeof rawValue === 'string' 
    ? rawValue.toLowerCase().trim() === 'true'
    : Boolean(rawValue);

  this.updateForm.patchValue({
    isAddOperatorViewAllowed: AddOperatorViewAllowed,
    themeColor: res.data.user.themeColor
  });
} else {
  console.error("User object missing", res.data);
}
const rawPriority = res.data.user.vtPriority?.toString().toLowerCase().trim();  
console.log('Raw Priority (normalized):', rawPriority);
const formattedPriority = 
  rawPriority === 'high' ? 'High' :
  rawPriority === 'medium' ? 'Medium' :
  rawPriority === 'low' ? 'Low' : null; 
  this.updateForm.patchValue({
    themeColor: res.data.user.themeColor,
  usertype: res.data.user.customerType,
   priority: formattedPriority,
    UserName: res.data.user.userName,
    email: res.data.user.email,
    campaignFrequency: res.data.user.campaignFrequency,
    creditRefund: res.data.user.creditRefund === 'true' ? true : false,
    messageExpiry: res.data.user.messageExpiry === 'true' ? true : false,
     dlrHandover:res.data.user.dlrHandover === 'true' ? true : false,
    isBlackListAllowed: res.data.user.isBlackListAllowed ,
      dlrCallbackApiMethod: res.data.user.dlrCallbackApiMethod,
      dlrCallbackUrl:res.data.user.dlrCallbackUrl,
      dlrRequestBodyType:res.data.user.dlrRequestBodyType,
      dlrRequestBody:res.data.user.dlrRequestBody,
      is2FARequid: res.data.user.is2FARequid,
    Password: res.data.user.userPassword,
    billingMethod: billingMethodValue,
    billingtype: res.data.user.billingType,
    billngcycle: res.data.user.billingCycle,
    mobile: res.data.user.mobile,
    Status: res.data.user.status,
    Expiry : res.data.user.expiryDate,
  //  isAddOperatorViewAllowed: AddOperatorViewAllowed,
  });
  this.selectedColor = res.data.user.themeColor || '#000000';
},
        error: (err) => {this.toastService.publishNotification(err.error.error, err.status, "error")
          this.isShow='false'
        }
      }
    )
  }
    get themeColorControl(): FormControl {
    return this.updateForm.get('themeColor') as FormControl;
  }

  onColorCodeInput(value: string) {
    // Validate hex color code (basic)
    if (/^#[0-9A-Fa-f]{6}$/.test(value)) {
      this.selectedColor = value;
      this.updateForm.get('themeColor')?.setValue(value);
    }
  }
}
