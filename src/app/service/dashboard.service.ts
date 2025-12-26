import { Injectable } from '@angular/core';
import { BASE_URL } from '../config/app-config';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { lastValueFrom } from 'rxjs';
import { DashboardStats } from '../models/dashboard-count';
import { SendMessageHistory } from '../models/send-message-hook';

const dashboardurl = '/whatsapp-sms/dashboard-status/all-status';
const TEMPLATE_HISTORY = '/whatsapp-sms/dashboard-status/send-message-data?page=0&size=100';


@Injectable({
  providedIn: 'root'
})
export class DashboardService {

  constructor(

    private httpService: HttpClient
  ) { }

  dashboard(dt:any)
  { 
    const headers = new HttpHeaders({
    "Authorization": `${sessionStorage.getItem('TOKEN')}`,
    // "Access-Control-Allow-Origin": `${BASE_URL}` 
    })
    console.log(headers)
    const URL =`${BASE_URL}${dashboardurl}`
    return this.httpService.post<any>(URL,dt,{headers})
  }
  // getDashboardCount() {
  //   const url = `${BASE_URL}${ALL_STATUS}`
  //   return lastValueFrom(this.httpService.get<DashboardStats[]>(url));
  // }

  // getSendMessageHistory() {
  //   const url = `${BASE_URL}${TEMPLATE_HISTORY}`
  //   return lastValueFrom(this.httpService.get<SendMessageHistory>(url));
  // }

}
