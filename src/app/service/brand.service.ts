import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BASE_URL } from '../config/app-config';


const SELECTBRAND = "/rcs-reseller-service/getBrandByBrandName";

const EDITBRAND = "/rcs-reseller-service/brandService/editBrand";

const BRANDNAME = '/rcs-reseller-service/getAllBrandByUserName';

const botlogo ='/rcs-reseller-service/botService/uploadBotData';


@Injectable({
  providedIn: 'root'
})
export class BrandService {

  private selectedBrand: any = null;

  constructor(private https : HttpClient) { }

  setTemplate(template: any) {
    // this.templateMessage.template = template;
    this.selectedBrand=template

  }

   branddetails(data:any)
    { 
      const headers = new HttpHeaders({
      "Authorization": `${sessionStorage.getItem('TOKEN')}`,
      // "Access-Control-Allow-Origin": `${BASE_URL}` 
      })
      console.log(headers)
      const URL =`${BASE_URL}${SELECTBRAND}`
      return this.https.post<any>(URL,data,{headers})
    }

    getAllbrandname(data:any)
    { 
      const headers = new HttpHeaders({
      "Authorization": `${sessionStorage.getItem('TOKEN')}`,
      // "Access-Control-Allow-Origin": `${BASE_URL}` 
      })
      console.log(headers)
      const URL =`${BASE_URL}${BRANDNAME}`
      return this.https.post<any>(URL,data,{headers})
      
    }


    

    editBrand(data:any)
    { 
      const headers = new HttpHeaders({
      "Authorization": `${sessionStorage.getItem('TOKEN')}`,
      // "Access-Control-Allow-Origin": `${BASE_URL}` 
      })
      console.log(headers)
      const URL =`${BASE_URL}${EDITBRAND}`
      return this.https.post<any>(URL,data,{headers})
    }


    botlogo(data:any)
    { 
      const headers = new HttpHeaders({
      "Authorization": `${sessionStorage.getItem('TOKEN')}`,
      // "Access-Control-Allow-Origin": `${BASE_URL}` 
      })
      console.log(headers)
      const URL =`${BASE_URL}${botlogo}`
      return this.https.post<any>(URL,data,{headers})
    }
    



}