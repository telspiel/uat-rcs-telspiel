import { Component } from '@angular/core';
import { FormBuilder , FormGroup } from '@angular/forms';
import { descriptors } from 'chart.js/dist/core/core.defaults';
import { DomainserviceService } from 'src/app/service/domainservice.service';

import { ToastService } from 'src/app/shared/toast-service.service';

@Component({
  selector: 'app-domain-manager',
  templateUrl: './domain-manager.component.html',
  styleUrls: ['./domain-manager.component.scss']
})
export class DomainManagerComponent {

  domainForm: FormGroup;
  reportList : any;
  listOfData: any;
  constructor(private fb: FormBuilder , private domainService : DomainserviceService , private toastService: ToastService) {
    this.domainForm = this.fb.group({
      tittle: [''],
      descripton:['']
   
    });
  }

  onSumbit(){

    if (!this.domainForm.value.descripton || !this.domainForm.value.tittle ) {
      this.toastService.publishNotification('Error',"Please fill all required fields .", "error");
      return;
    }

    let dt = {
      "userName": sessionStorage.getItem('USER_NAME'),
     
      "domainName": this.domainForm.value.tittle,
      "description": this.domainForm.value.descripton,
       }
    
    
       this.domainService.addDomain(dt).subscribe({
        next: (result) => {
          console.log('API Response:', result);
          this.domainForm.reset();
          this.tableapi();
          if (result.result === "Failed") {
            // this.toastService.publishNotification("Error", result.message, "error");
            this.toastService.publishNotification("Error", result.message, "error");
          } else {
            this.toastService.publishNotification("Success", result.message);
           
           
  
            
          }
          
          
        },
        error: (error) => {
          this.toastService.publishNotification("Error", error.message || "An error occurred", "error");
          // this.isDisabled = false; // Re-enable button in case of an error
        },
      });


  }

  ngOnInit(): void {
  this.tableapi();
}




tableapi(){
  let data = {
    "userName": sessionStorage.getItem('USER_NAME'),
};

this.domainService.viewDomain(data).subscribe({
    next: (result) => {
        console.log('Full API Response:', result); // Log entire response
      this.listOfData = result.dataList;
        if (result.result === "Failed") {
            console.error("API Error:", result.message);
        } else {
            console.log('Extracted DataList:', result.dataList); // Log extracted dataList
            
            this.reportList = result.dataList;  
        }
    },
    error: (error) => {
        console.error("API Request Failed:", error);
    },
});
}
  }



