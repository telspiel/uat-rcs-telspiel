import { Component } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { BillingPageService } from 'src/app/service/billing-page.service';

@Component({
  selector: 'app-addbilling',
  templateUrl: './addbilling.component.html',
  styleUrls: ['./addbilling.component.scss']
})
export class AddbillingComponent {
  AddBilling!: FormGroup;

  constructor(private billingService:BillingPageService,private fb: FormBuilder) {
    
    this.AddBilling = this.fb.group({
     
      planName: [''],
      richTemplate: [''],
      carouselTemplate: [''],
      textTemplate: [''],
      textWithPdfTemplate: [''],

    });
   }

  submit(){
    let obj={
      
        "userName": sessionStorage.getItem('USER_NAME'),
        "planName": this.AddBilling.value.planName,
        "templateTypeCharges": [
          {
            "charge": this.AddBilling.value.richTemplate,
            "templateType": "RICH_CARD_TEMPLATE"
          },
          {
            "charge": this.AddBilling.value.carouselTemplate,
            "templateType": "CAROUSEL_TEMPLATE"
          },
          {
            "charge": this.AddBilling.value.textTemplate,
            "templateType": "TEXT_TEMPLATE"
          },
          {
            "charge": this.AddBilling.value.textWithPdfTemplate,
            "templateType": "TEXT_WITH_PDF_TEMPLATE"
          }
        ]
      
      }
    
    console.log(this.AddBilling.value);
    this.billingService.saveBillingPlan(obj).subscribe(
      (response) => {
        console.log(response);
      }
    );
  }
}
