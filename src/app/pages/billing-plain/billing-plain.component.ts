import { Component, OnInit } from '@angular/core';
import { BillingPageService } from 'src/app/service/billing-page.service';

@Component({
  selector: 'app-billing-plain',
  templateUrl: './billing-plain.component.html',
  styleUrls: ['./billing-plain.component.scss']
})
export class BillingPlainComponent implements OnInit {
  data: any[] = [];
  tableData: any[] = [];
  columnKeys: string[] = [];
  userName=sessionStorage.getItem('USER_NAME')

  constructor(private billingService: BillingPageService) {}

  ngOnInit(): void {
    this.billingService.getAllBillingPlan().subscribe((response) => {
      if (response.data) {
        this.data = response.data;

        // Transform data for table
        this.tableData = this.data.map(plan => {
          let transformed: { userName: any; planName: any; [key: string]: any } = {
            userName: plan.userName,
            planName: plan.planName
          };

          plan.templateTypeCharges.forEach((tc:any) => {
            transformed[tc.templateType] = tc.charge;
          });

          return transformed;
        });

        // Extract dynamic column headers
        this.columnKeys = [
          'planName',
          ...new Set(this.data.flatMap(plan => plan.templateTypeCharges.map((tc:any) => tc.templateType)))
        ];
      }
    });
  }

  formatKey(key: string): string {
    return key.replace(/_/g, ' ');
  }
}
