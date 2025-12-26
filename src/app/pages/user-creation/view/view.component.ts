
import { Component, inject } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { HTTP_Response } from 'src/app/models/responseModel';
import { UserCreationService } from 'src/app/service/user-creation.service';
import { ToastService } from 'src/app/shared/toast-service.service';
import { BrandService } from 'src/app/service/brand.service';


@Component({
  selector: 'app-view',
  templateUrl: './view.component.html',
  styleUrls: ['./view.component.scss']
})
export class ViewComponent {

  EndOfCampaignDate = 'EndOfCampaignDate';
TwentyFourHrFromCampTime = '24HrFromCampTime';

  userCreation = inject(UserCreationService)
  toastService = inject(ToastService)
  userId: any
  role=sessionStorage.getItem('ROLE')|| ""
  // userdt = {
  //   loggedInUsername: "",
  //   userId:""
  // }
  Adminlist:any
  Clientlist: any
  ResllerList: any 
  SellerList: any
  SellerListoption: any
  data: HTTP_Response | undefined
  selectForm: FormGroup;
    selectedColor: string = '';
  viewForm: FormGroup;
  CreditHistory = "true";
  MobileNumberMasking = "true";
  Admin="";
  Reseller = "";
  Seller = "";
  client = "";
  UserName = "";
  email = "";
  accountManager = "";
  Password = "";
  themeColor = "";
  // useraccounttype = "";
  billingtype = ""
  billngcycle = ""
  senderidtype = ""
  priority = ""
  Auth = ""
  Expiry = ""
  // traffictype = ""
  Status = ""
  plan = ""
  mobile = ""
  account = ""
  Client = ""
  Department = ""
  creditRefund=""
  messageExpiry= ""
  dlrHandover= ""
  isBlackListAllowed = ""
  
    dlrCallbackApiMethod= ""
    dlrCallbackUrl= ""
    dlrRequestBodyType= ""
    dlrRequestBody= ""
  campaignFrequency=""
  dlrRetry = ""
  retryCount = ""
  Permission = ""
  MaskingCount = ""
  IsOTPAccount = ""
  RejectFailedNumber = ""
  IsVisualizeAllowed = ""
  TM1_Id = ""
  TM2_Id = ""
  TDID = ""
  OTPMasking = ""
  SMPPCharSet = ""
  WhiteListIp = ""
  TX = ""
  TRX = ""
  RX = ""
  usertype = ""
  userdt: any
  isView="false"
   isAddOperatorViewAllowed= ""


  constructor(private fb: FormBuilder, private brandService: BrandService,) {

    // const username = {
    //   userName: "superadmin"
    // }

    this.userdt =
    {
      loggedInUsername: sessionStorage.getItem('USER_NAME'),
      userId: sessionStorage.getItem('USER_ID')

    }


    // this.userCreation.getUser(username).subscribe(

    //   (res) => {

    //     sessionStorage.setItem('username', res.data.user.userName)
    //     sessionStorage.setItem('uid', res.data.user.userId)
    //   }

    // )

    this.getOptions()
    this.selectForm = this.fb.group({
      Reseller: [this.Reseller,],
      Seller: [this.Seller,],
      Client: [this.client,]
    })
    this.viewForm = this.fb.group({
      usertype: [null],
      UserName: [{value:'', disabled: true}],
      accountManager:[{value:'', disabled: true}],
      email: [{value:'', disabled: true }],
      Password: [{value:'', disabled: true }],
      themeColor: [{value:'', disabled: true}],
      billingtype: [{value:'', }],
       billingMethod: [null],
      billngcycle: [{value:'', }],
      senderidtype: [{value:'', }],
      priority: [{value:'', }],
      Auth: [{value:'', }],
      is2FARequid: [{value:'',disabled: true }],
      Expiry: [{value:'', }],
      Status: [{value:'', }],
      plan: [{value:'', }],
      mobile: [{value:'', disabled: true }],
      creditRefund:[{value: null, disabled: true }],
      messageExpiry:[{value: null, disabled: true }],
      dlrHandover:[{value: null, disabled: true }],
      isBlackListAllowed : [{value: null, disabled: true }],
      dlrCallbackApiMethod:[{value: null, disabled: true }],
      dlrCallbackUrl:[{value: null, disabled: true }],
      dlrRequestBodyType:[{value: null, disabled: true }],
      dlrRequestBody:[{value: null, disabled: true }],
      campaignFrequency:[{value:'', disabled: true }],
      account: [{value:'', }],
      Client: [{value:'', }],
      Department: [{value:'', }],
      dlrRetry: [{value:'', }],
      retryCount: [{value:'', }],
      Permission: [{value:'', }],
      CreditHistory: [{value:'', }],
      MobileNumberMasking: [{value:'', }],
      MaskingCount: [{value:'', }],
      IsOTPAccount: [{value:'', }],
      RejectFailedNumber: [{value:'', }],
      IsVisualizeAllowed: [{value:'', }],
      TM1_Id: [{value:'', }],
      TM2_Id: [{value:'', }],
      TDID: [{value:'', }],
      OTPMasking: [{value:'', }],
      SMPPCharSet: [{value:'', }],
      WhiteListIp: [{value:'', }],
      TX: [{value:'', }],
      TRX: [{value:'', }],
      RX: [{value:'', }],
        isAddOperatorViewAllowed: [],
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


  getUserData(Value:string) {
      
      const username = {
        userName: Value
      }
      this.userCreation.getUser(username).subscribe(
        {
          next: (res) => {
            // this.useraccounttype=  res.data.user.accountType;
             let billingMethodValue: boolean | null = null;
  if (res.data.user.walletbillingMethod === 'true') {
    billingMethodValue = true; // Wallet
  } else if (res.data.user.creditbillingMethod === 'true') {
    billingMethodValue = false; // Credit
  }


  const rawPriority = res.data.user.vtPriority?.toString().toLowerCase().trim();  // Example path

console.log('Raw Priority (normalized):', rawPriority);

const formattedPriority = 
  rawPriority === 'high' ? 'High' :
  rawPriority === 'medium' ? 'Medium' :
  rawPriority === 'low' ? 'Low' : null; 


  const user = res.data.user; // or res.user, depending on your response

if (user) {
  const rawValue = user.isAddOperatorViewAllowed;
  const AddOperatorViewAllowed = typeof rawValue === 'string' 
    ? rawValue.toLowerCase().trim() === 'true'
    : Boolean(rawValue);

  this.viewForm.patchValue({
    isAddOperatorViewAllowed: AddOperatorViewAllowed,
  });
} else {
  console.error("User object missing", res.data);
}


            this.viewForm.patchValue({
               usertype: res.data.user.customerType,
              UserName: res.data.user.userName,
              email:res.data.user.email ,
              accountManager : res.data.user.accountManagerName,
              Password: res.data.user.userPassword,
              themeColor: res.data.user.themeColor,
              billingMethod: billingMethodValue,
               priority: formattedPriority,
             // billingMethod :res.data.user.creditBillingMethod ,
             Expiry : res.data.user.expiryDate,
              // useraccounttype: res.data.user.accountType,
              billingtype: res.data.user.billingType,
              is2FARequid: res.data.user.is2FARequid,
              billngcycle: res.data.user.billingCycle,
              mobile: res.data.user.mobile,
              creditRefund: res.data.user.creditRefund === 'true' ? true : false,
              messageExpiry:res.data.user.messageExpiry === 'true' ? true : false,
               dlrHandover:res.data.user.dlrHandover === 'true' ? true : false,
               isBlackListAllowed : res.data.user.isBlackListAllowed,
               dlrCallbackApiMethod: res.data.user.dlrCallbackApiMethod,
               dlrCallbackUrl:res.data.user.dlrCallbackUrl,
               dlrRequestBodyType:res.data.user.dlrRequestBodyType,
               dlrRequestBody:res.data.user.dlrRequestBody,
              campaignFrequency: res.data.user.campaignFrequency,

              Status:res.data.user.status
            })
              console.log('Formatted priority:', formattedPriority);
            this.isView="true"
          },
          error: (err) => {
            
            
            this.toastService.publishNotification(err.error.error, err.status, "error")
            this.isView="false"
          }
            
        }
      )
    }
       logColor() {
    console.log("user creation colour"+this.selectedColor); // Logs the selected color
  }

   updateColorCode(event: Event): void {
    const inputElement = event.target as HTMLInputElement;
    this.selectedColor = inputElement.value;
  }


  handleSelection(event: any): void {
  console.log('User selection:', event);
  this.client=event.client
  this.Reseller=event.reseller
  this.Seller=event.seller
  this.Admin=event.admin 
  const value= this.client|| this.Reseller|| this.Seller || this.Admin
  this.getUserData(value)
}


}
