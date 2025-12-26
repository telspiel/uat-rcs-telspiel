import { Component, ChangeDetectorRef, ElementRef, ViewChild } from '@angular/core';
import { UserCreationService } from 'src/app/service/user-creation.service';
import { FormBuilder, FormArray, Validators } from "@angular/forms";
import { HttpClient } from '@angular/common/http';
import { ToastService } from 'src/app/shared/toast-service.service';
// import { ValidatePassword } from "./must-match/validate-password";


@Component({
  selector: 'app-uploadlogo',
  templateUrl: './uploadlogo.component.html',
  styleUrls: ['./uploadlogo.component.scss']
})
export class UploadlogoComponent {
  imageUrl: string | ArrayBuffer | null = null;
  selectedFile: File | null = null;
  isImageUploaded = false; // State variable for button text change

  constructor(private userCreationService: UserCreationService, private http: HttpClient, private toastService: ToastService) {}

  onFileSelected(event: Event) {
    const fileInput = event.target as HTMLInputElement;
    if (fileInput.files && fileInput.files.length > 0) {
      this.selectedFile = fileInput.files[0];

      // Preview the uploaded image
      const reader = new FileReader();
      reader.onload = (e) => {
        this.imageUrl = e.target?.result || null;
      };
      reader.readAsDataURL(this.selectedFile);

      this.isImageUploaded = true; // Change button text to "SUBMIT"
    }
  }

  handleButtonClick() {
    if (this.isImageUploaded && this.selectedFile) {
      this.uploadImage(); // Call API if image is uploaded
    } else {
      document.getElementById('fileInput')?.click(); // Trigger file input if no image is uploaded
    }
  }

  uploadImage() {
    if (!this.selectedFile) return;
    if (!this.selectedFile.type.startsWith('image/')) {
      this.toastService.publishNotification('error', 'Selected file is not an image', 'error');
      return;
    }
    const formData = new FormData();
    formData.append('loggedInUserName', sessionStorage.getItem('USER_NAME') || '');
    formData.append('file', this.selectedFile);


    this.userCreationService.logoupload(formData).subscribe(
      (response) => {
        console.log('Upload successful', response);
        this.toastService.publishNotification('success', response.message, 'success');
      },
      (error) => {
        console.error('Upload failed', error);
        this.toastService.publishNotification('error', 'Failed to Upload Logo', 'error');
      }
    );
  }
}
