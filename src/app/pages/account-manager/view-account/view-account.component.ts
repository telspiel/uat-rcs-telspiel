import { Component } from '@angular/core';

import { FormGroup ,  FormBuilder , FormControl , Validators } from '@angular/forms';

import { differenceInCalendarDays } from 'date-fns';
import { V } from 'jointjs';

import { AccountManagerService } from 'src/app/service/account-manager.service';

import { ToastService } from "src/app/shared/toast-service.service";

import { UserCreationService } from 'src/app/service/user-creation.service';


@Component({
  selector: 'app-view-account',
  templateUrl: './view-account.component.html',
  styleUrls: ['./view-account.component.scss']
})
export class ViewAccountComponent {


  accountManager = "";
  isView="false"
  Accountlist : any
  selectedAccountManager: string = '';
  reportList: any;  
  disabledDate = (current: Date): boolean => differenceInCalendarDays(current, this.today) <= 0;



    // accountForm!:FormGroup;
    today = new Date();
    // userNameExists=false;
    emailExists=false;

   viewForm!: FormGroup;

    
  constructor(private fb:FormBuilder , private accoutService:AccountManagerService , private toastService:ToastService , private userCreation: UserCreationService) {
   

    this.viewForm = this.fb.group({
  userType:[{value:'', disabled: true}],
  userName: [{value:'', disabled: true}],
  email: [{value:'', disabled: true}],
  userPassword:[{value:'', disabled: true}],
  mobile: [{value:'', disabled: true}],
  Expiry: [{value:'', disabled: true}],
  vtStatus: [{value:'', disabled: true}],
  });

  }



   ngOnInit(){
    this.viewAccount();
  }


  viewAccount() {
  let dt = {
    loggedInUserName: sessionStorage.getItem('USER_NAME'),
  };

  this.accoutService.viewAccont(dt).subscribe((res) => {
    this.reportList = res.dataList;

    if (this.reportList && this.reportList.length > 0) {
      const userData = this.reportList[0]; 

    }
  })
};


 getUserData(Value:string) {
      
      const username = {
        userName: Value
      }
      this.userCreation.getUser(username).subscribe(
        {
          next: (res) => {
           
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
              userType: res.data.user.customerType,
              userName: res.data.user.userName,
              email:res.data.user.email ,
              userPassword: res.data.user.userPassword,
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

              vtStatus:res.data.user.status
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

onAccountManagerChange(selectedUserName: string): void {
    this.getUserData(selectedUserName);


}

}


