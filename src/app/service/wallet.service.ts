import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { BASE_URL } from '../config/app-config';

const GETALLBILLINGPLAN="/rcs-reseller-service/billingService/getAllBillingPlan"
const getAvailableBalanceForUser='/rcs-reseller-service/walletService/getAvailableBalanceForUser'
const WALLETHISTORY='/rcs-reseller-service/walletService/getWalletHistory'
const UPDATEWALLET='/rcs-reseller-service/walletService/updateWalletForUser'
const GENERATEUSERAPI='/rcs-reseller-service/pushApiKeyService/generateUserApiKey'
const GETUSERAPIKEY='/rcs-reseller-service/pushApiKeyService/getUserApiKey'


@Injectable({
  providedIn: 'root'
})
export class WalletService {



  constructor(private httpService:HttpClient) { }

  getAllBillingPlan(){
      const headers = new HttpHeaders({
        'Content-Type': 'application/json', 
        'Authorization': `${sessionStorage.getItem('TOKEN')}`
      });
      const URL = `${BASE_URL}${GETALLBILLINGPLAN}`;
      return this.httpService.post<any>(URL,{ "loggedInUserName":sessionStorage.getItem('USER_NAME')}, { headers });
    }

    getAvailableBalanceForUser(dt:any){
      const headers = new HttpHeaders({
        'Content-Type': 'application/json',
        'Authorization': `${sessionStorage.getItem('TOKEN')}`
      }); 
      const URL = `${BASE_URL}${getAvailableBalanceForUser}`;
      return this.httpService.post<any>(URL,dt, { headers });
    }

    getWalletHistory(dt:any){
      const headers = new HttpHeaders({
        'Content-Type': 'application/json',
        'Authorization': `${sessionStorage.getItem('TOKEN')}`
      });
      const URL = `${BASE_URL}${WALLETHISTORY}`;
      return this.httpService.post<any>(URL,dt, { headers });

    }

    updateWalletForUser(dt:any){
      const headers = new HttpHeaders({
        'Content-Type': 'application/json',
        'Authorization': `${sessionStorage.getItem('TOKEN')}`
      });
      const URL = `${BASE_URL}${UPDATEWALLET}`;
      return this.httpService.post<any>(URL,dt, { headers });

    }
 generateUserApiKey(dt:any){
  const headers = new HttpHeaders({
    'Content-Type': 'application/json',
    'Authorization': `${sessionStorage.getItem('TOKEN')}`
  });
  const URL = `${BASE_URL}${GENERATEUSERAPI}`;
  return this.httpService.post<any>(URL,dt, { headers });
}

getUserApiKey(dt:any){
  const headers = new HttpHeaders({
    'Content-Type': 'application/json',
    'Authorization': `${sessionStorage.getItem('TOKEN')}`
  });
  const URL = `${BASE_URL}${GETUSERAPIKEY}`;
  return this.httpService.post<any>(URL,dt, { headers });
}

}
