import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BASE_URL } from '../config/app-config';

const addAcccount = "/rcs-reseller-service/userService/saveUser"
const viewAccount = "/rcs-reseller-service/getAllAccountManager"
const editAccoutn = "/rcs-reseller-service/userService/saveUser"

@Injectable({
  providedIn: 'root'
})
export class AccountManagerService {
 constructor(private httpService:HttpClient) { }

 addAccount(data:any){
  const headers =  new HttpHeaders({
    'Content-Type': 'application/json',
    'Authorization': `${sessionStorage.getItem('TOKEN')}`
  })
  const URL = `${BASE_URL}${addAcccount}`;
  return this.httpService.post<any>(URL,data ,{headers})

 }

 viewAccont(data:any){
   const headers =  new HttpHeaders({
    'Content-Type': 'application/json',
    'Authorization': `${sessionStorage.getItem('TOKEN')}`
  })
  const URL = `${BASE_URL}${viewAccount}`;
  return this.httpService.post<any>(URL,data ,{headers})

 }

 editAccount(data:any){
   const headers =  new HttpHeaders({
    'Content-Type': 'application/json',
    'Authorization': `${sessionStorage.getItem('TOKEN')}`
  })
  const URL = `${BASE_URL}${editAccoutn}`;
  return this.httpService.post<any>(URL,data ,{headers})

 }


}
