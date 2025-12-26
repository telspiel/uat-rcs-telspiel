import { Component, OnInit } from '@angular/core';
import { FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { NzUploadFile } from 'ng-zorro-antd/upload';
import { differenceInCalendarDays } from 'date-fns';
import { DatePipe } from '@angular/common';

@Component({
  selector: 'app-upload',
  templateUrl: './upload.component.html',
  styleUrls: ['./upload.component.scss']
})
export class UploadComponent implements OnInit {
fileList!: NzUploadFile[];
schduleMessage='no'
split="no"
shortUrlSelected="no"
messagetype="transactional"
today = new Date();
day = this.today.getDate();
month = this.today.getMonth() + 1;
year = this.today.getFullYear();
//time :any |null =null
myForm: FormGroup;
uploadCampaign: FormGroup;
  constructor(private fb: FormBuilder) {
    this.myForm = this.fb.group({
      timeSlots: this.fb.array([]) 
    });
    this.uploadCampaign=this.fb.group({
      campaignName:["",[Validators.required]],
      fileType:[""],
      messageType:[this.messagetype],
      serviceType:[""],
      senderId:["",[Validators.required] ],
      templateName:[""],
      messageEncoding:[""],
      messagePart:[""],
      messageText:["",[Validators.required]],
      shortUrlSelected:[this.shortUrlSelected],
      shortURLName:[""],
      entityID:["",[Validators.required]],
      operatorTemplateId:["",[Validators.required]],
      scheduleMessage:[this.schduleMessage],
      split:[this.split],



    })
  }

  disabledDate = (current: Date): boolean => differenceInCalendarDays(current, this.today) <= 0;
  get timeSlots(): FormArray {
    return this.myForm.get('timeSlots') as FormArray;
  }

  ngOnInit(): void {
    this.myForm = this.fb.group({
      timeSlots: this.fb.array([this.createTimeSlot()])
    });
  }

  getStatus(controlName: string): 'error' | 'success'|  null {
    const control = this.uploadCampaign.get(controlName);
    if (control?.touched && control?.invalid) {
      return 'error';
    }
    if (control?.valid) {
      return 'success';
    }
    return null;
  }
  onSubmit() {
    if(this.uploadCampaign.valid){
      console.log('success',this.uploadCampaign.value)
      console.log(this.myForm.value,this.timeSlots.value.map((slot: { time: any; }) => slot.time.toLocaleTimeString('en-GB', { hour12: false, hour: '2-digit', minute: '2-digit' })))
    }
    else{
      this.uploadCampaign.markAllAsTouched()
    }
  }

  createTimeSlot(): FormGroup {
    return this.fb.group({
      From: ['', Validators.required],
      To: ['', Validators.required],
      time: [null , Validators.required]
    });
  }
  addTimeSlot(): void {
   
    this.timeSlots.push(this.createTimeSlot());
  }
  removeTimeSlot(index: number): void {
    if (this.timeSlots.length > 1) {
      this.timeSlots.removeAt(index);
    }
  }
}
