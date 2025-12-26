import { Component } from '@angular/core';

import { FormGroup ,  FormBuilder , FormControl , Validators } from '@angular/forms';

import { differenceInCalendarDays } from 'date-fns';
import { V } from 'jointjs';

import { AccountManagerService } from 'src/app/service/account-manager.service';

import { ToastService } from "src/app/shared/toast-service.service";

import { UserCreationService } from 'src/app/service/user-creation.service';

@Component({
  selector: 'app-add-account',
  templateUrl: './add-account.component.html',
  styleUrls: ['./add-account.component.scss']
})


export class AddAccountComponent {

  accountForm!:FormGroup;
  today = new Date();
  userNameExists=false;
   emailExists=false;

  disabledDate = (current: Date): boolean => differenceInCalendarDays(current, this.today) <= 0;

  constructor(private fb:FormBuilder , private accoutService:AccountManagerService , private toastService:ToastService , private userCreation: UserCreationService) {
    this.accountForm =  this.fb.group({
      userType: ["",[Validators.required]],
      username :["",[Validators.required]],
      mobile: ["",[Validators.required]],
      password :["",[Validators.required]],
      email : ["",[Validators.required]],
      status : ["",[Validators.required]],
      expiry : ["",[Validators.required]]
     


    })
  }

  getStatus(controlName: string): 'error' | 'success'|  null {
    const control = this.accountForm.get(controlName);
    if (control?.touched && control?.invalid) {
      return 'error';
    }
    if (control?.valid) {
      return 'success';
    }
    return null;
  }




addAccount(){

  if(this.accountForm.invalid){
    this.accountForm.markAllAsTouched();
    return 
  }


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

  let dt =  {
    loggedInUserName : sessionStorage.getItem('USER_NAME'),
    customerType : this.accountForm.value.userType,
    userName :  this.accountForm.value.username,
    mobile : this.accountForm.value.mobile,
    userPassword : this.accountForm.value.password,
    status : this.accountForm.value.status,
    email : this.accountForm.value.email,
    operation: "addUser",
    accountType: "web",
    userExpiryDate: this.accountForm.value.expiry,
    priority: ""
    
   
  };

  this.accoutService.addAccount(dt).subscribe((res:any)=>{

    if(res.status="Success"){

     this.toastService.publishNotification("Account added successfully"  , res.message, "success");
       this.accountForm.reset();

    }

    else{
     
     
     this.toastService.publishNotification("Error" , res.message, "error");
    }

  })

}

resetForm(){
  this.accountForm.reset();

}

 checkavailability(){
    const dt = {username:this.accountForm.value.username , email:this.accountForm.value.email.trim()};
    this.userCreation.checkavailability(dt).subscribe({
      next:(res)=>{
        this.userNameExists=res.usernameExists
        console.log(this.userNameExists)
        this.emailExists=res.emailExists

        if(this.userNameExists ){
          this.accountForm.get('username')?.setErrors({ 'incorrect': true });
        }
        if(this.emailExists){
          this.accountForm.get('email')?.setErrors({ 'incorrect': true });
        }
      }
    })
  }


}


