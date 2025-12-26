import { Component } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { Validators } from '@angular/forms';

@Component({
  selector: 'app-dltupload',
  templateUrl: './dltupload.component.html',
  styleUrls: ['./dltupload.component.scss']
})
export class DltuploadComponent {
  

  fileList:any[]=[]

  messageencoading = 'headerfile';

  validForm = new FormGroup({

    
    messageencoading: new FormControl(this.messageencoading),
    entityID : new FormControl('',[Validators.required]),
    templateType : new FormControl('',[Validators.required]),
    operator : new FormControl('',[Validators.required]),
    File : new FormControl('',[Validators.required]),
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
