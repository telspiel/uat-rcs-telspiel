import { Component } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { UserCreationService } from 'src/app/service/user-creation.service';
import { ToastService } from 'src/app/shared/toast-service.service';
@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.scss']
})
export class ProfileComponent {
  logoUrl: string = sessionStorage.getItem('logoUrl')?.trim() || 'assets/images/nopictures.png';
  USER_NAME: string = sessionStorage.getItem('USER_NAME')?.trim() || '';
 ROLE: string =  sessionStorage.getItem('ROLE')?.trim() || '';
  billingType: string =  sessionStorage.getItem('billingType')?.trim() || '';        
  emailId: string =  sessionStorage.getItem('emailId')?.trim() || '';
password: string = JSON.parse(sessionStorage.getItem('password') || '""');
  profileform: FormGroup;
  firstName: any;
  isVisible = false;

  constructor(private fb: FormBuilder, public User:UserCreationService, public toastService: ToastService) {
    // ✅ Initialize the form first

    // ✅ Then subscribe to valueChanges
   this.profileform = this.fb.group({
 userName: [this.USER_NAME],
 role:[this.ROLE],
 email:[this.emailId],
 billingtype:[this.billingType],
 oldPassword: [this.password],
 newPassword:['']
});

  }
   showModal(): void {
    this.isVisible = true;
  }


  handleOk(): void {
const payload = {
  loggedInUserName: sessionStorage.getItem('USER_NAME') || '',
  oldPassword: sessionStorage.getItem('password') || '',
  newPassword: this.profileform.get('newPassword')?.value
};


  this.User.updatepassword(payload).subscribe({
    next: (response:any) => {
      console.log('Password updated successfully', response);
       this.toastService.publishNotification("Success", response.message);
      this.isVisible = false;
    },
    error: (error) => {
      console.error('Failed to update password', error);
       this.toastService.publishNotification("error", error.message);
    }
  });
}


  handleCancel(): void {
    console.log('Button cancel clicked!');
    this.isVisible = false;
  }
}
