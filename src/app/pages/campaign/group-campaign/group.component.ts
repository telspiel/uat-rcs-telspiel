import { Component } from '@angular/core';
import { FormControl, FormGroup, } from '@angular/forms';
import { scheduled } from 'rxjs';
import { differenceInCalendarDays } from 'date-fns';
// import { Validators } from 'ngx-editor';
import { Validators } from '@angular/forms';

@Component({
  selector: 'app-group',
  templateUrl: './group.component.html',
  styleUrls: ['./group.component.scss']
})

export class GroupComponent {
today = new Date();  
day = this.today.getDate();
month = this.today.getMonth() + 1;
year = this.today.getFullYear();
disabledDate = (current: Date): boolean => differenceInCalendarDays(current, this.today) <= 0;
// onSubmit() {
// throw new Error('Method not implemented.');
// }
  MessagePart="singlePart"
  messagess= "plainText"
  Messagetype = "transcational"
  ScheduleMessage = "no"
  shortUrlSelected="no"
  
  
  validateForm = new FormGroup({
    campaignName: new FormControl('', [Validators.required]),
    message : new FormControl(''),
    messagepart : new FormControl(''),
    selectgroup : new FormControl('' , [Validators.required]),
    senderID : new FormControl('', [Validators.required] ),
    contenttemplate : new FormControl('', [Validators.required]),
    scheduledmessage : new FormControl(''),
    messagetext : new FormControl('',[Validators.required]),
    shorturl : new FormControl(''),
    entityid : new FormControl('',[Validators.required]),
    operator : new FormControl('',[Validators.required]),
    ShortUrlSelected : new FormControl(this.shortUrlSelected),
    shortURLName:new FormControl(''),
    ScheduleMessage : new FormControl(this.ScheduleMessage),
    messagePart : new FormControl(this.MessagePart),
    messageEncoding : new FormControl(this.messagess),
    Messagetype : new FormControl(this.Messagetype),
    serviceType:new FormControl('')

  })

  // submitForm(){
  //   console.log('submit', this.validateForm.value);
  //   this.validateForm.reset();
    
  // }

  getStatus(FormGroup: string): 'error' | 'success'|  null {
    const control = this.validateForm.get(FormGroup);
    if (control?.touched && control?.invalid) {
      return 'error';
    }
    if (control?.valid) {
      return 'success';
    }
    return null;
  }

  onSubmit() {
  
    if(this.validateForm.valid){
      console.log('sucess',this.validateForm.value)
    }
    else{
      this.validateForm.markAllAsTouched()
    }
  }
}
