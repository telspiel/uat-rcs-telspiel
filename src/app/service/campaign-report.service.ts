import { Injectable } from '@angular/core';
import { BASE_URL } from '../config/app-config';
import { HTTP_Response } from '../models/responseModel';
import { HttpClient, HttpHeaders } from '@angular/common/http';



const CAMPAIGN='/rcs-reseller-service/campaignService/campaignReportByCampaignNameForAllUser'




@Injectable({ providedIn: 'root' })
export class CampaignReportService {
  private campaignData: any = null;
  
  constructor(private https : HttpClient) {
    const storedData = sessionStorage.getItem('campaignData');
    if (storedData) {
      this.campaignData = JSON.parse(storedData);
    }
  }

  setCampaignData(data: any): void {
    this.campaignData = data;
    sessionStorage.setItem('campaignData', JSON.stringify(data)); 
  }

  getCampaignData(): any {
    return this.campaignData;
  }

  clearCampaignData(): void {
    this.campaignData = null;
    sessionStorage.removeItem('campaignData'); 
  }

  getcampaignData(dt:any): any {
    const headers = new HttpHeaders({
          "Authorization" : `${sessionStorage.getItem('TOKEN')}`,
        })
        const url  = `${BASE_URL}${CAMPAIGN}`
        return this.https.post<HTTP_Response>(url,dt, { headers });
  }
}
