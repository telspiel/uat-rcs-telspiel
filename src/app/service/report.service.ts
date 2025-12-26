import { Injectable } from '@angular/core';
import { BASE_URL } from '../config/app-config';
import { HTTP_Response } from '../models/responseModel';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';


const DETAILREPORT="/rcs-reseller-service/misService/detailedReport";
const dashboardurl="/rcs-reseller-service/reseller/dashboard";
const templatelist="/rcs-reseller-service/templateService/getAllTemplateByUserName";
const approvetemp='/rcs-reseller-service/templateService/getAllApprovedTemplateByUserName'
const addtemplate="/rcs-reseller-service/templateService/addTemplate";
const schreport = "/rcs-reseller-service/campaignService/viewAllScheduledCampaignForUser";
const detaildownloadreport = "/rcs-reseller-service/misService/downloadDetailedReport";
const updateCreditForUser="/rcs-reseller-service/creditService/updateCreditForUser";
const SUMMARYREPORT="/rcs-reseller-service/userSummaryService/userSummaryReport";
const totalcredit  = "/rcs-reseller-service/creditService/getAvailableCreditForUser"

const blockRichCredit = "/rcs-reseller-service/creditService/getBlockedCredit"
const blockTextCredit = "/rcs-reseller-service/creditService/getBlockedCredit"

@Injectable({
  providedIn: 'root'
})

export class ReportService {
  
  constructor(private httpService:HttpClient ) { }
  getSummaryReport(dt:any){
    const headers = new HttpHeaders({
    "Authorization": `${sessionStorage.getItem('TOKEN')}`,
    }) 
    const URL =`${BASE_URL}${SUMMARYREPORT}`
    return this.httpService.post<any>(URL,dt,{headers})

  }
  getDetailReport(dt:any)
  { 
    const headers = new HttpHeaders({
    "Authorization": `${sessionStorage.getItem('TOKEN')}`,
    // "Access-Control-Allow-Origin": `${BASE_URL}` 
    })
    
    const URL =`${BASE_URL}${DETAILREPORT}`
    return this.httpService.post<any>(URL,dt,{headers})
  }

downloaddetailreport(dt: any): Observable<Blob> {
  const headers = new HttpHeaders({
    Authorization: `${sessionStorage.getItem('TOKEN')}`
  });
  const URL = `${BASE_URL}${detaildownloadreport}`;
  return this.httpService.post(URL, dt, {
    headers: headers,
    responseType: 'blob' as 'json'
  }) as Observable<Blob>;
}



  getscheduledReport(dt:any)
  { 
    const headers = new HttpHeaders({
    "Authorization": `${sessionStorage.getItem('TOKEN')}`,
    // "Access-Control-Allow-Origin": `${BASE_URL}` 
    })
   
    const URL =`${BASE_URL}${schreport}`
    return this.httpService.post<any>(URL,dt,{headers})
  }

  updateCreditForUser(dt:any)
  { 
    const headers = new HttpHeaders({
    "Authorization": `${sessionStorage.getItem('TOKEN')}`,
    // "Access-Control-Allow-Origin": `${BASE_URL}` 
    })
    
    const URL =`${BASE_URL}${updateCreditForUser}`
    return this.httpService.post<any>(URL,dt,{headers})
  }

  blockRichCredit(data:any){
    const headers = new HttpHeaders({
      "Authorization": `${sessionStorage.getItem('TOKEN')}`,
    })
    const URL =`${BASE_URL}${blockRichCredit}`
    return this.httpService.post<any>(URL,data,{headers})
  }

  blockTextCredit(data:any){
     const headers = new HttpHeaders({
      "Authorization": `${sessionStorage.getItem('TOKEN')}`,
    })
    const URL =`${BASE_URL}${blockTextCredit}`
    return this.httpService.post<any>(URL,data,{headers})

  }


  totalCredit(dte:any)
  { 
    const headers = new HttpHeaders({
    "Authorization": `${sessionStorage.getItem('TOKEN')}`,
    // "Access-Control-Allow-Origin": `${BASE_URL}` 
    })
    
    const URL =`${BASE_URL}${totalcredit}`
    return this.httpService.post<any>(URL,dte,{headers})
  }





  dashboard(dt:any)
  { 
    const headers = new HttpHeaders({
    "Authorization": `${sessionStorage.getItem('TOKEN')}`,
    // "Access-Control-Allow-Origin": `${BASE_URL}` 
    })
    
    const URL =`${BASE_URL}${dashboardurl}`
    return this.httpService.post<any>(URL,dt,{headers})
  }



  templatelist(dt:any)
  { 
    const headers = new HttpHeaders({
    "Authorization": `${sessionStorage.getItem('TOKEN')}`,
    // "Access-Control-Allow-Origin": `${BASE_URL}` 
    })
    
    const URL =`${BASE_URL}${templatelist}`
    return this.httpService.post<any>(URL,dt,{headers})
  }

  addtemplate(dt:any)
  { 
    const headers = new HttpHeaders({
    "Authorization": `${sessionStorage.getItem('TOKEN')}`,
    // "Access-Control-Allow-Origin": `${BASE_URL}` 
    })
    
    const URL =`${BASE_URL}${addtemplate}`
    return this.httpService.post<any>(URL,dt,{headers})
  }
    getAllapproveTemplates(dt:any){
          const headers = new HttpHeaders({
            "Authorization" : `${sessionStorage.getItem('TOKEN')}`, 
          })
          const url  = `${BASE_URL}${approvetemp}`
          return this.httpService.post<any>(url,dt, { headers });
        }

}
