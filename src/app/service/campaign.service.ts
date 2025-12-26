import { HttpClient, HttpHandler, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BASE_URL } from '../config/app-config';
import { HTTP_Response } from '../models/responseModel';
import { Observable } from 'rxjs';
const CAMPAIGNREPORT = "/rcs-reseller-service/createCampaign";
const checkcapability = "/rcs-reseller-service/numberService/checkCapablity";
const UPLOAD = "/rcs-reseller-service/uploadFile" ;
const uploadDynamicMessageFile = "/rcs-reseller-service/dynamicSMSService/uploadDynamicMessageFile";
const BULCKREPORT  = "/rcs-reseller-service/quickGroupBulkScheduleFile" ;
const SHORTURLCONVERTER='/rcs-reseller-service/templateService/convertShortUrlForPreview'
const campaignReport = "/rcs-reseller-service/campaignService/campaignReportForUser"
const CHATBOTNAME= "/rcs-reseller-service/chatBotNames?loggedInUserName="
const campaignUpload ='/rcs-reseller-service/uploadCampaignFile'
const DeleteFile='/rcs-reseller-service/deleteFileById?id='
const getAllFiles='/rcs-reseller-service/getAllFilesByUserName?userName='
const downlodallrepot='/rcs-reseller-service/campaignService/downloadCampaignSummaryReport';
const deletecampaign ='/rcs-reseller-service/deleteCampaign'
const getstatusreport ='/rcs-reseller-service/campaignService/campaignReportWithStatusForUser'

@Injectable({
  providedIn: 'root'
})
export class CampaignService {

  constructor(private https: HttpClient) { }

  
  // getCampaign(data :any){
  //   const headers = new HttpHeaders({
  //     "Authorization" : `${sessionStorage.getItem('TOKEN')}`, 
  //   })
  //   const url  = `${BASE_URL}${CAMPAIGNREPORT}`
  //   return this.https.post<HTTP_Response>(url,data, { headers });
  // }
  chekCampaignName(CampaignName :string){
    const headers = new HttpHeaders({
      "Authorization" : `${sessionStorage.getItem('TOKEN')}`,
    })
    const url  = `${BASE_URL}/rcs-reseller-service/findUniqueCampaignName?loggedInUserName=${sessionStorage.getItem('USER_NAME')}&campaignName=${CampaignName}`
    return this.https.get<any>(url, { headers });
  }

   downlodrepot(campaignName:any){
   const headers = new HttpHeaders({
      "Authorization" : `${sessionStorage.getItem('TOKEN')}`,
    })
    return this.https.get<any>(`${BASE_URL}/rcs-reseller-service/misService/downloadCampaignWiseReportForAll?campaign=${campaignName}&loggedInUserName=${sessionStorage.getItem('USER_NAME')}`, { headers, responseType: 'blob' as 'json' });
    
  }

  //    downlodallrepot(campaignName:any){
  //  const headers = new HttpHeaders({
  //     "Authorization" : `${sessionStorage.getItem('TOKEN')}`,
  //   })
  //   return this.https.post<any>(`${BASE_URL}/rcs-reseller-service/campaignService/downloadCampaignSummaryReport`);
    
  // }

downlodallrepot(data: any): Observable<Blob> {
  const headers = new HttpHeaders({
    "Authorization": `${sessionStorage.getItem('TOKEN')}`,
  });
  const url = `${BASE_URL}${downlodallrepot}`;

  return this.https.post<Blob>(url, data, {
    headers,
    responseType: 'blob' as 'json' // important: force blob response and cast for TypeScript
  });
}


  getAllFiles(){
    const headers = new HttpHeaders({
      "Authorization" : `${sessionStorage.getItem('TOKEN')}`,
    })
    const url  = `${BASE_URL}${getAllFiles}${sessionStorage.getItem('USER_NAME')}`
    return this.https.get<any>(url, { headers });
  }
  deleteFile(id :any){
    const headers = new HttpHeaders({
      "Authorization" : `${sessionStorage.getItem('TOKEN')}`,
    })
    const url  = `${BASE_URL}${DeleteFile}${id}`
    return this.https.delete<any>(url, { headers });
  }

  getChatBotNameList(){
    const headers = new HttpHeaders({
      "Authorization" : `${sessionStorage.getItem('TOKEN')}`,
    })
    const url  = `${BASE_URL}${CHATBOTNAME}${sessionStorage.getItem('USER_NAME')}`
    return this.https.get<HTTP_Response>(url, { headers });
  }
  sortUrlConverter(data :any){
    const headers = new HttpHeaders({
      "Authorization" : `${sessionStorage.getItem('TOKEN')}`,
    })
    const url  = `${BASE_URL}${SHORTURLCONVERTER}`
    return this.https.post<HTTP_Response>(url,data, { headers });
  }
  getCampaign(data :any){
    const headers = new HttpHeaders({
      "Authorization" : `${sessionStorage.getItem('TOKEN')}`, 
    })
    const url  = `${BASE_URL}${CAMPAIGNREPORT}`
    return this.https.post<HTTP_Response>(url,data, { headers });
  }

  bulkCampaign(data : any){
    const headers = new HttpHeaders({
      "Authorization" : `${sessionStorage.getItem('TOKEN')}`, 
    })
    const url  = `${BASE_URL}${BULCKREPORT}`
    return this.https.post<HTTP_Response>(url,data, { headers });
  }


  uploadDynamicMessageFile(data :any){
    const headers = new HttpHeaders({
      "Authorization" : `${sessionStorage.getItem('TOKEN')}`, 
    })
    const url  = `${BASE_URL}${uploadDynamicMessageFile}`
    return this.https.post<HTTP_Response>(url,data, { headers });
  }
  

  imUpload(data :any){
    const headers = new HttpHeaders({
      "Authorization" : `${sessionStorage.getItem('TOKEN')}`, 
    })
    const url  = `${BASE_URL}${UPLOAD}`
    return this.https.post<HTTP_Response>(url,data, { headers });
  }

  checkcapability(data :any){
    const headers = new HttpHeaders({
      "Authorization" : `${sessionStorage.getItem('TOKEN')}`, 
    })
    const url  = `${BASE_URL}${checkcapability}`
    return this.https.post<HTTP_Response>(url,data, { headers });
  }

  campaignReport(data :any){
    const headers = new HttpHeaders({
      "Authorization" : `${sessionStorage.getItem('TOKEN')}`, 
    })
    const url  = `${BASE_URL}${campaignReport}`
    return this.https.post<HTTP_Response>(url,data, { headers });
  }

    getstatusreport(data :any){
    const headers = new HttpHeaders({
      "Authorization" : `${sessionStorage.getItem('TOKEN')}`, 
    })
    const url  = `${BASE_URL}${getstatusreport}`
    return this.https.post<HTTP_Response>(url,data, { headers });
  }
  uploadFlile(data :any){
    const headers = new HttpHeaders({
      "Authorization" : `${sessionStorage.getItem('TOKEN')}`,
    })
    const url  = `${BASE_URL}${campaignUpload}`
    return this.https.post<any>(url,data, { headers });
  }
    deletecampaign(data :any){
    const headers = new HttpHeaders({
      "Authorization" : `${sessionStorage.getItem('TOKEN')}`,
    })
    const url  = `${BASE_URL}${deletecampaign}`
    return this.https.post<any>(url,data, { headers });
  }
}