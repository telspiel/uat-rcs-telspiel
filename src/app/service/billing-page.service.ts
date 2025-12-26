import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BASE_URL } from '../config/app-config';
const GETALLBILLINGPLAN="/rcs-reseller-service/billingService/getAllBillingPlan"
const SAVEBILLINGPLAN="/rcs-reseller-service/billingService/saveUserBillingInfo"
@Injectable({
  providedIn: 'root'
})

export class BillingPageService {
  getAllBillingPlan(){
    const headers = new HttpHeaders({
      'Content-Type': 'application/json', 
      'Authorization': `${sessionStorage.getItem('TOKEN')}`
    });
    const URL = `${BASE_URL}${GETALLBILLINGPLAN}`;
    return this.httpService.post<any>(URL,{ "loggedInUserName":sessionStorage.getItem('USER_NAME')}, { headers });
  }
  saveBillingPlan(data:any){
    const headers = new HttpHeaders({
      'Content-Type': 'application/json', 
      'Authorization': `${sessionStorage.getItem('TOKEN')}`
    });
    const URL = `${BASE_URL}${SAVEBILLINGPLAN}`;
    return this.httpService.post<any>(URL,data, { headers });
  }
  constructor(private httpService:HttpClient) { }
}
