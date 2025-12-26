import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-add-view-sender-id',
  templateUrl: './add-view-sender-id.component.html',
  styleUrls: ['./add-view-sender-id.component.scss']
})
export class AddViewSenderIdComponent {
  date: any;
  total=1
  loading = true;
  pageSize = 10;
  pageIndex = 1;
  senderIdType="promotional";
  senderId: any;

  addViewSenderId:FormGroup
  entityId: any;

  constructor(private fb:FormBuilder){
    this.addViewSenderId= this.fb.group({
      senderIdType:[this.senderIdType],
      entityId:["",[Validators.required]],
      headerId:[""],
      senderId:["",[Validators.required]]
    })
  }
getStatus(controlName: string): 'error' | 'success'|  null {
  const control = this.addViewSenderId.get(controlName);
  if (control?.touched && control?.invalid) {
    return 'error';
  }
  if (control?.valid) {
    return 'success';
  }
  return null;
}
onSubmit() {

  if(this.addViewSenderId.valid){
    console.log('sucess',this.addViewSenderId.value)
  }
  else{
    this.addViewSenderId.markAllAsTouched()
  }
}
}
