import { Component } from '@angular/core';
import { FormGroup ,  FormControl} from '@angular/forms';
import { Validators } from '@angular/forms';

@Component({
  selector: 'app-dltadd',
  templateUrl: './dltadd.component.html',
  styleUrls: ['./dltadd.component.scss']
})
export class DltaddComponent {

  messageEncoding = "transactional";
  templateType="plainText"

  validForm = new FormGroup({
    messageEncoding: new FormControl(this.messageEncoding),
    senderId: new FormControl('',[Validators.required]),
    entityID: new FormControl('',[Validators.required]),
    templateName: new FormControl('',[Validators.required]),
    templateDescription: new FormControl('',[Validators.required]),
    templateID: new FormControl('',[Validators.required]),
    messageText : new FormControl('',[Validators.required]),
    serviceType : new FormControl(''),
    templateType:new FormControl('')
  })

  
  getStatus(FormGroup: string): 'error' | 'success'|  null {
    const control = this.validForm.get(FormGroup);
    if (control?.touched && control?.invalid) {
      return 'error';
    }
    if (control?.valid) {
      return 'success';
    }
    return null;
  }

  sumbit() {
  
    if(this.validForm.valid){
      console.log('sucess',this.validForm.value)
    }
    else{
      this.validForm.markAllAsTouched()
    }
  }

}
