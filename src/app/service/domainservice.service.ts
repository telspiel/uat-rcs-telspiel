import { Injectable } from '@angular/core';
import { HttpClient , HttpHeaders } from '@angular/common/http';
import { BASE_URL } from '../config/app-config';

const domain = "/rcs-reseller-service/domainService/saveDomainMappingInfo";
const domainReport = "/rcs-reseller-service/domainService/getAllDomainInfo";

@Injectable({
  providedIn: 'root'
})
export class DomainserviceService {

  constructor(private httpService:HttpClient) { }

  addDomain(data:any)
    { 
      const headers = new HttpHeaders({
      "Authorization": `${sessionStorage.getItem('TOKEN')}`,
      })
      
      const URL =`${BASE_URL}${domain}`
      return this.httpService.post<any>(URL,data,{headers})
    }

    
  viewDomain(data:any)
  { 
    const headers = new HttpHeaders({
    "Authorization": `${sessionStorage.getItem('TOKEN')}`,
    })
    
    const URL =`${BASE_URL}${domainReport}`
    return this.httpService.post<any>(URL,data,{headers})
  }
  

}
