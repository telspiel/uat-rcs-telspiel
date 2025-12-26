import { Component } from '@angular/core';

import { FormGroup ,  FormBuilder , FormControl , Validators } from '@angular/forms';

import { differenceInCalendarDays } from 'date-fns';
import { V } from 'jointjs';

import { AccountManagerService } from 'src/app/service/account-manager.service';

import { ToastService } from "src/app/shared/toast-service.service";

import { UserCreationService } from 'src/app/service/user-creation.service';


@Component({
  selector: 'app-edit-account',
  templateUrl: './edit-account.component.html',
  styleUrls: ['./edit-account.component.scss']
})
export class EditAccountComponent {
  

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

    userNameExists=false;

   viewForm!: FormGroup;

    
  constructor(private fb:FormBuilder , private accoutService:AccountManagerService , private toastService:ToastService , private userCreation: UserCreationService) {
   

  this.viewForm = this.fb.group({
  userType:[''],
  userName: [{value:'', disabled:'true'}],
  email: [''],
  password:[''],
  mobile: [''],
  Expiry: [''],
  vtStatus: [''],
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
              password: res.data.user.userPassword,
              //  priority: formattedPriority,
             // billingMethod :res.data.user.creditBillingMethod ,
            
              // useraccounttype: res.data.user.accountType,
      
              mobile: res.data.user.mobile,
          

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

addAccount(){



  let dt =  {
    loggedInUserName : sessionStorage.getItem('USER_NAME'),
    customerType : this.viewForm.value.userType,
    userName :  this.viewForm.getRawValue().userName,
    mobile : this.viewForm.value.mobile,
    userPassword : this.viewForm.value.password,
    status : this.viewForm.value.vtStatus,
    email : this.viewForm.value.email,
    operation: "editUser",
    accountType: "web",
    userExpiryDate: this.viewForm.value.expiry,
    priority: ""
    
   
  };

  this.accoutService.addAccount(dt).subscribe((res:any)=>{

    if(res.status="Success"){

     this.toastService.publishNotification("Account added successfully"  , res.message, "success");
       this.viewForm.reset();
      this.selectedAccountManager = '';
  
        

    }

    else{
     
     
     this.toastService.publishNotification("Error" , res.message, "error");
    }

  })

}

resetForm(){
  this.viewForm.reset();

}
  
}









