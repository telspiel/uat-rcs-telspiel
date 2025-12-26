declare var google:any
import { Component, OnInit } from '@angular/core';
import { UntypedFormBuilder, UntypedFormGroup, Validators } from '@angular/forms';
import { FormBuilder, FormGroup } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../shared/auth.service';
import { StorageService } from '../shared/storage.service';
import { ToastService } from '../shared/toast-service.service';
import { SignupService } from '../service/signup.service';
import { callback } from 'chart.js/dist/helpers/helpers.core';
import { CLIENT_ID } from '../config/app-config';
import { APP_BASE_HREF } from '@angular/common';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {
  googleData:any
  extraTemplate: any;
  isAdminRoute = false;
  validateForm!: UntypedFormGroup;
  isLogin = true; // Controls whether the Login or Sign-Up form is displayed
  loginForm!: FormGroup;
  signupForm!: FormGroup;
  checked: boolean =true;
  termschecked: boolean =true;
  constructor(private fb: UntypedFormBuilder,
    private authService: AuthService,
    private storageService: StorageService,
    private toastService: ToastService,
    private route: Router,
    private signup:SignupService
  ) {
  

   }

submitForm(): void {

  if (this.validateForm.valid) {
    console.log('submit', this.validateForm.value);
    this.login(this.validateForm.value); // Continue login
  } else {
      this.loginForm.get('password')?.valueChanges.subscribe(value => {
  if (value) {
    sessionStorage.setItem('USER_PASSWORD', value.trim());
  }
});
    Object.values(this.validateForm.controls).forEach(control => {
      if (control.invalid) {
        control.markAsDirty();
        control.updateValueAndValidity({ onlySelf: true });
      }
    });
  }
}


  login(cred: { username: string, password: string, type: string }) {
    this.authService.login(cred).subscribe({
      next: (data) => {
        if (data.result == "success") {
          const role=sessionStorage.getItem("ROLE")
          if (role === 'agent'){
            this.route.navigateByUrl('/bot-conversations')
          }
          const userexpiry = sessionStorage.getItem('userexpiry');
          if (userexpiry === 'inactive') {
            this.toastService.publishNotification("Error", "Your account has expired. Please contact support", "error")
          }
          else
            this.loginForm.get('password')?.valueChanges.subscribe(value => {
  if (value) {
    sessionStorage.setItem('USER_PASSWORD', value.trim());
  }
});
          {this.route.navigateByUrl('/');}
          
        } else {
          this.toastService.publishNotification("Error", data.message, "error")
        }
      },
      error: (err) => this.toastService.publishNotification("Error", "Something Went Wrong", "error")
    })
  }

  

  ngOnInit(): void {
    this.checkRoute();
    // google.accounts.id.initialize({
    //   client_id: CLIENT_ID,
    //   callback: (res:any)=>{
    //     this.handleGoogleSignup(res)
    //   }
    // })
    // google.accounts.id.renderButton(document.getElementById('google-btn'),{
    //   type:"standard",
    //   theme:"outline",
    //   size:"large",
    //   text: "continue_with",
    //   shape: "rectangular"
    // })

    this.validateForm = this.fb.group({
      username: [null, [Validators.required]],
      password: [null, [Validators.required]],
      remember: [true]
    });

    this.loginForm = this.fb.group({
      username: ['', [Validators.required]],
      password: ['', [Validators.required]],
      type: ["username"]
    });

      this.loginForm.get('password')?.valueChanges.subscribe(value => {
  if (value) {
    sessionStorage.setItem('USER_PASSWORD', value.trim());
  }
});

    this.signupForm = this.fb.group({
      firstname: ['', [Validators.required]],
      lastname: ['', [Validators.required]],
      email: ['', [Validators.required, Validators.email]],
      website:['',[Validators.required]],
      contry:["",[Validators.required] ],
      mobile:['',Validators.required],
      terms:[this.termschecked],
      blog:[this.checked],
      companyName:['',Validators.required]
      // password: ['', [Validators.required]],
      // confirmPassword: ['', [Validators.required]],
      //terms: [''],
    });

    if (this.authService.isLoggedIn()) {
      this.route.navigate(['/'])
    }
  }
  private checkRoute() {
    const pathname = window.location.pathname.toLowerCase(); // Normalize case
    const currentUrl = window.location.href.toLowerCase();   // Normalize case
  
    // Check if the route belongs to the admin panel
    this.isAdminRoute = 
      pathname.includes('/rcs-admin/') || 
      pathname.includes('/rcs/') ||
      currentUrl.includes('/rcs-admin') || 
      currentUrl.includes('/rcs') ||
      pathname.startsWith('/admin/') ||
      pathname.startsWith('/dashboard/');
  
    console.log('Current Pathname:', pathname);
    console.log('Current URL:', currentUrl);
    console.log('Is Admin Route:', this.isAdminRoute);
  }
  
  

  private decode(res:string){
    return JSON.parse(atob(res.split(".")[1]))
  }

  handleGoogleSignup(res:any){
    console.log(this.decode(res.credential))
    this.googleData=this.decode(res.credential)
    console.log(res)
    this.onSignup()
    //this.route.navigate(['/card'])
  }
  onLogin(): void {
    if (this.loginForm.valid) {
      console.log('submit', this.loginForm.value);
      this.login(this.loginForm.value)
    } else {
      Object.values(this.loginForm.controls).forEach(control => {
        if (control.invalid) {
          control.markAsDirty();
          control.updateValueAndValidity({ onlySelf: true });
        }
      });
    }
  }

  // Handles sign-up form submission
  onSignup(){
    //if (this.signupForm.valid) 
      {
      console.log('Signup Data:', this.signupForm.value);
      const dt={
        // name: this.signupForm.value.firstname +" "+this.signupForm.value.lastname ,
        // companyName: "VTSff",
        // companyEmail: this.signupForm.value.email,
        // email: "ambrishff@gmail.com",
        // mobile: "123456789000",
        // term: (this.termschecked)?"Y": "N",
        // blog: (this.checked)?"Y":"N"
        name: this.googleData.given_name ,
        companyName: this.signupForm.value.companyName || "N/A",
        companyWebsite: this.signupForm.value.website || "N/A",
        email: this.signupForm.value.email|| this.googleData.email,
        mobile: this.signupForm.value.mobile || Math.floor(1000000000 + Math.random() * 9000000000),
        country: this.signupForm.value.contry || "N/A",
        term: (this.termschecked)?"Y": "N",
        blog: (this.checked)?"Y":"N"
      }
      this.signup.signUp(dt).subscribe(
        {
          next:(res)=>{
            if (res){
            this.route.navigate(['/card'])
          }
          },
          error:(e)=>{
            console.log(e)
          }
        }
      )
      
      
    }
    // else {
    //   Object.values(this.signupForm.controls).forEach(control => {
    //     if (control.invalid) {
    //       control.markAsDirty();
    //       control.updateValueAndValidity({ onlySelf: true });
    //     }
    //   });}
    // this.loginForm.patchValue({
    //   username: "demoadmin",
    //   password: "password",
    //   type:"username"
    // })
    // this.login(this.loginForm.value)
  }
  toggleAuth(): void {
    this.isLogin = !this.isLogin;
  }
}
