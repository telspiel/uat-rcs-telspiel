import { EventEmitter, Injectable, Output } from '@angular/core';
import { TemplateBuilderTypes } from '../enums/template-builder-types';
import { SEND_TEMPLATE_MODEL, TEMPLATES, TEMPLATE_MODEL_RESPONSE, TEMPLATE_RESPONSE } from '../models/templateModel';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { BASE_URL } from '../config/app-config';
import { HTTP_Response } from '../models/responseModel';
import { Observable } from 'rxjs';

const GET_ALL_TEMPLATES = '/whatsapp-sms/templates';
const PENDINGTEMPLATES='/rcs-reseller-service/templateService/getAllPendingTemplateByUserName'
const approvetemp='/rcs-reseller-service/templateService/getAllApprovedTemplateByUserName'
const SAVE_TEMPLATES = '/whatsapp-sms/templates';
const DELETE_TEMPLATES = '/whatsapp-sms/templates/delete';
const GET_LIST_TEMPLATES = '/whatsapp-sms/templates/fetch-template-name';
const SEND_TEMPLATES = '/whatsapp-sms/send-templates';
const BULK_MESSAGE = "/whatsapp-sms/bulk-message/upload";
const Brand_data = "/rcs-reseller-service/brandService/addBrand";
const addBot = "/rcs-reseller-service/botService/addBot";
const submitBot = "/rcs-reseller-service/botService/submitBot";
const botusername = "/rcs-reseller-service/botService/getAllBotByUserName";
const uploadbot = "/rcs-reseller-service/botService/uploadBotData";
const addtemplate = "/rcs-reseller-service/templateService/addTemplate";
const getbotdetail = "/rcs-reseller-service/botService/getBotByBotId";
const TEMPLATEDETAILS = "/rcs-reseller-service/templateService/getByTemplateName";
const editTemplate="/rcs-reseller-service/templateService/updateTemplate"
const editBot='/rcs-reseller-service/botService/editBot'
const upload ='/rcs-reseller-service/templateService/uploadFile'
const TestNumber='/rcs-reseller-service/botService/addTestNumbersForBot'
const uploadfile='/rcs-reseller-service/uploadFileService/uploadFile'
const testTemplate='/rcs-reseller-service/sendSMSService/sendSMS'
const capablity='/rcs-reseller-service/numberService/checkBulkCapablity'
const getBulkCapablityData='/rcs-reseller-service/numberService/getBulkCapablityData'
const UPLOADLOGO = '/rcs-reseller-service/uploadBrandFile';
const UPDATETEMPLATESTATUS='/rcs-reseller-service/templateService/updateTemplateStatus'
const REFRESH = "/rcs-reseller-service/numberService/checkCapablityForTester"
const APPROVEDBOT="/rcs-reseller-service/botService/getApprovedBotByBotName"
const InActivetemp="/rcs-reseller-service/templateService/getAllApprovedAndInActiveTemplateByUserName"
const updatetemplate="/rcs-reseller-service/templateService/updateTemplateActive"
const Activetemp = "/rcs-reseller-service/templateService/getAllApprovedAndActiveTemplateByUserName"
const addFallback='/rcs-reseller-service/templateService/addFallback'

@Injectable({
  providedIn: 'root'
})
export class TemplateService {

  @Output() templateEditorData: EventEmitter<TEMPLATE_RESPONSE> = new EventEmitter<TEMPLATE_RESPONSE>();
  // private editorData = new TemplateModel();
 
  data: any;
  TemplateServiceService: any;
  http: any;


  constructor(
    private httpService: HttpClient
  ) { }
  addFallback(dt:any){
    const headers = new HttpHeaders({
      "Authorization" : `${sessionStorage.getItem('TOKEN')}`,
    })
    const url  = `${BASE_URL}${addFallback}`
    return this.httpService.post<any>(url,dt, { headers });
  }

  getApprovedBotByBotName(dt:any){
    const headers = new HttpHeaders({
      "Authorization" : `${sessionStorage.getItem('TOKEN')}`,
    })
    const url  = `${BASE_URL}${APPROVEDBOT}`
    return this.httpService.post<any>(url,dt, { headers });
  }
  testTemplate(dt:any){
    const headers = new HttpHeaders({
      "Authorization" : `${sessionStorage.getItem('TOKEN')}`, 
    })
    const url=`${BASE_URL}${testTemplate}`
    return this.httpService.post<any>(url, dt, { headers });
  }
  test(dt:any){
    const headers = new HttpHeaders({
      "Authorization" : `${sessionStorage.getItem('TOKEN')}`, 
    })
    const url=`${BASE_URL}${TestNumber}`
    return this.httpService.post<any>(url, dt, { headers });
  }
  uploadFile(dt:any){
    const headers = new HttpHeaders({
      "Authorization" : `${sessionStorage.getItem('TOKEN')}`, 
    })
    const url=`${BASE_URL}${upload}`
    return this.httpService.post<any>(url, dt, { headers });
  }

  templateDetail(body: any) {
    const headers = new HttpHeaders({
      "Authorization" : `${sessionStorage.getItem('TOKEN')}`, 
    })
    const url = `${BASE_URL}${TEMPLATEDETAILS}`; 
    return this.httpService.post<any>(url, body, { headers });
  }


  getAllTemplateNames() {
    
    const url = `${BASE_URL}${GET_LIST_TEMPLATES}`
    return this.httpService.get<TEMPLATES[]>(url);
  }

  getTemplateById(id: string) {
   
    const url = `${BASE_URL}${GET_ALL_TEMPLATES}/${id}`
    return this.httpService.get<TEMPLATE_RESPONSE>(url);
  }


  getAllTemplates() {
    console.log("getAllTemplates")
    const url = `${BASE_URL}${GET_ALL_TEMPLATES}?page=0&size=100`
    return this.httpService.get<TEMPLATE_MODEL_RESPONSE>(url);
  }

  saveTemplates(body: TEMPLATE_RESPONSE) {
    console.log("saveTemplates")
    const url = `${BASE_URL}${SAVE_TEMPLATES}`
    // const url = "https://waba.360dialog.io/v1/configs/templates";
    return this.httpService.post<HTTP_Response>(url, JSON.stringify(body));
  }

  updateTemplates(templateId: string, body: any) {
    console.log("updateTemplates")
    const url = `${BASE_URL}${SAVE_TEMPLATES}/${templateId}`
    return this.httpService.patch<HTTP_Response>(url, JSON.stringify(body));
  }

  deleteTemplate(templateId: string) {
    console.log("deleteTemplate")
    const url = `${BASE_URL}${DELETE_TEMPLATES}/${templateId}`
    return this.httpService.delete<HTTP_Response>(url);
  }

  sendTemplates(body: SEND_TEMPLATE_MODEL) {
    const url = `${BASE_URL}${SEND_TEMPLATES}`;
    return this.httpService.post<any>(url, body);
  }

  uploadLogo(body: FormData) {
    const headers = new HttpHeaders({
      "Authorization" : `${sessionStorage.getItem('TOKEN')}`, 
    })
    const url = `${BASE_URL}${UPLOADLOGO}`; 
    return this.httpService.post<any>(url, body, { headers });
  }
  // sendBulkMessages(body: FormData) {

  //   console.log(body.getAll("file"))
  //   console.log(body.getAll("json"))

  //   // Create custom headers to set the desired content type and process data as needed.
  //   const headers = new HttpHeaders({
  //     'Content-Type': 'multipart/form-data',
  //     // 'X-Requested-With': 'XMLHttpRequest', // Mimic jQuery's AJAX behavior
  //   });

  //   const url = `${BASE_URL}${BULK_MESSAGE}`;
  //   return this.httpService.post<any>(url, body, { headers });
  //   // return this.httpService.post<any>(url, body);
  // }

  sendBulkMessages(body: FormData) {
    const url = `${BASE_URL}${BULK_MESSAGE}`;
    const headers = new HttpHeaders();
    headers.append('Content-Type', 'multipart/form-data');
    return this.httpService.post<any>(url, body, {headers});
    //return this.httpService.post<any>(url, body);
  }

  Branddata(body: FormData) {
    const url = `${BASE_URL}${Brand_data}`; 
    //const headers = new HttpHeaders().set('Accept', 'application/json', ); 
    const headers = new HttpHeaders({
      "Authorization" : `${sessionStorage.getItem('TOKEN')}`, 
    })
    return this.httpService.post<any>(url, body, { headers });
  }
  
  submitBot(body: FormData) {
    const headers = new HttpHeaders({
      "Authorization" : `${sessionStorage.getItem('TOKEN')}`, 
    })
    const url = `${BASE_URL}${addBot}`; 
    return this.httpService.post<any>(url, body, { headers });
  }

  uploadbot(body: FormData): Observable<any> {
    // Retrieve the token from sessionStorage
    const token = sessionStorage.getItem('TOKEN');

    // Initialize headers
    let headers = new HttpHeaders();

    if (token) {
      headers = headers.set('Authorization', token); // ✅ Set the token if available
    }

    // Construct the API URL
    const url = `${BASE_URL}${uploadbot}`; // ✅ Ensure the correct endpoint
    return this.httpService.post<any>(url, body, { headers });
    // Make the HTTP POST request
    
  }

  getallbotdetail(data :any){
      const headers = new HttpHeaders({
        "Authorization" : `${sessionStorage.getItem('TOKEN')}`, 
      })
      const url  = `${BASE_URL}${botusername}`
      return this.httpService.post<HTTP_Response>(url,data, { headers });
    }

    addtemp(body: FormData) {
      const headers = new HttpHeaders({
        "Authorization" : `${sessionStorage.getItem('TOKEN')}`, 
      })
      const url = `${BASE_URL}${addtemplate}`; 
      return this.httpService.post<any>(url, body, { headers });
    }
    editbotdetail(body: any) {
      const headers = new HttpHeaders({
        "Authorization" : `${sessionStorage.getItem('TOKEN')}`, 
      })
      const url = `${BASE_URL}${getbotdetail}`; 
      return this.httpService.post<any>(url, body, { headers });
    }
    editTemplate(dt:any){
      const headers = new HttpHeaders({
        "Authorization" : `${sessionStorage.getItem('TOKEN')}`, 
      })
      const url = `${BASE_URL}${editTemplate}`; 
      return this.httpService.post<any>(url, dt, { headers });
    }
      updateactive(dt:any){
      const headers = new HttpHeaders({
        "Authorization" : `${sessionStorage.getItem('TOKEN')}`, 
      })
      const url = `${BASE_URL}${updatetemplate}`; 
      return this.httpService.post<any>(url, dt, { headers });
    }
  
    editBot(dt:any){
      const headers = new HttpHeaders({
        "Authorization" : `${sessionStorage.getItem('TOKEN')}`, 
      })
      const url = `${BASE_URL}${editBot}`; 
      return this.httpService.post<any>(url, dt, { headers });
    }

    uploadCsvFlie(dt:FormData){
      const headers = new HttpHeaders({
        "Authorization" : `${sessionStorage.getItem('TOKEN')}`, 
      })
      const url = `${BASE_URL}${uploadfile}`; 
      return this.httpService.post<any>(url, dt, { headers });
    }

    capblityBulk(dt:any){
      const headers = new HttpHeaders({
        "Authorization" : `${sessionStorage.getItem('TOKEN')}`, 
      })
      const url = `${BASE_URL}${capablity}`; 
      return this.httpService.post<any>(url, dt, { headers });
    }

    getBulkCapablityData(dt:any){
      const headers = new HttpHeaders({
        "Authorization" : `${sessionStorage.getItem('TOKEN')}`, 
      })
      const url = `${BASE_URL}${getBulkCapablityData}`; 
      return this.httpService.post<any>(url, dt, { headers });
    }


     refresh(data :any){
        const headers = new HttpHeaders({
          "Authorization" : `${sessionStorage.getItem('TOKEN')}`, 
        })
        const url  = `${BASE_URL}${REFRESH}`
        return this.httpService.post<HTTP_Response>(url,data, { headers });
      }

      getAllPendingTemplates(dt:any){
        const headers = new HttpHeaders({
          "Authorization" : `${sessionStorage.getItem('TOKEN')}`, 
        })
        const url  = `${BASE_URL}${PENDINGTEMPLATES}`
        return this.httpService.post<any>(url,dt, { headers });
      }

      
      getAllapproveTemplates(dt:any){
        const headers = new HttpHeaders({
          "Authorization" : `${sessionStorage.getItem('TOKEN')}`, 
        })
        const url  = `${BASE_URL}${approvetemp}`
        return this.httpService.post<any>(url,dt, { headers });
      }

        getAllInActiveTemplates(dt:any){
        const headers = new HttpHeaders({
          "Authorization" : `${sessionStorage.getItem('TOKEN')}`, 
        })
        const url  = `${BASE_URL}${InActivetemp}`
        return this.httpService.post<any>(url,dt, { headers });
      }

        getAllactiveTemplates(dt:any){
        const headers = new HttpHeaders({
          "Authorization" : `${sessionStorage.getItem('TOKEN')}`, 
        })
        const url  = `${BASE_URL}${Activetemp}`
        return this.httpService.post<any>(url,dt, { headers });
      }

      updateTemplateStatus(dt:any){
        const headers = new HttpHeaders({
          "Authorization" : `${sessionStorage.getItem('TOKEN')}`,
        })
        const url  = `${BASE_URL}${UPDATETEMPLATESTATUS}`
        return this.httpService.post<any>(url,dt, { headers });
      }
}
