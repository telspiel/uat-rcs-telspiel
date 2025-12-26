import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BASE_URL } from '../config/app-config';


const addGroup = "/rcs-reseller-service/groupService/addGroup";

const getAllGroupsList = "/rcs-reseller-service/groupService/getAllGroupsList";

const viewGroup = '/rcs-reseller-service/groupService/viewGroup';

const deleteGroup ='/rcs-reseller-service/groupService/deleteGroup';

const addNumberToGroup ='/rcs-reseller-service/groupNumberDetailsService/addNumberToGroup';

const removeNumberFromGroup = '/rcs-reseller-service/groupNumberDetailsService/removeNumberFromGroup';

const searchNumberInGroup = '/rcs-reseller-service/groupNumberDetailsService/searchNumberInGroup';

const getAllNumbersInGroup = '/rcs-reseller-service/groupNumberDetailsService/getAllNumbersInGroup';

const uploadNumberInUserGroup = '/rcs-reseller-service/groupService/uploadNumberInUserGroup';

@Injectable({
  providedIn: 'root'
})
export class PhonebookService {
private selectedBrand: any = null;

  constructor(private https : HttpClient) { }

  setTemplate(template: any) {
    // this.templateMessage.template = template;
    this.selectedBrand=template

  }

   addGroup(data:any)
    { 
      const headers = new HttpHeaders({
      "Authorization": `${sessionStorage.getItem('TOKEN')}`,
      // "Access-Control-Allow-Origin": `${BASE_URL}` 
      })
      console.log(headers)
      const URL =`${BASE_URL}${addGroup}`
      return this.https.post<any>(URL,data,{headers})
    }

    getAllGroupsList(data:any)
    { 
      const headers = new HttpHeaders({
      "Authorization": `${sessionStorage.getItem('TOKEN')}`,
      // "Access-Control-Allow-Origin": `${BASE_URL}` 
      })
      console.log(headers)
      const URL =`${BASE_URL}${getAllGroupsList}`
      return this.https.post<any>(URL,data,{headers})
      
    }


    

    viewGroup(data:any)
    { 
      const headers = new HttpHeaders({
      "Authorization": `${sessionStorage.getItem('TOKEN')}`,
      // "Access-Control-Allow-Origin": `${BASE_URL}` 
      })
      console.log(headers)
      const URL =`${BASE_URL}${viewGroup}`
      return this.https.post<any>(URL,data,{headers})
    }


    addNumberToGroup(data:any)
    { 
      const headers = new HttpHeaders({
      "Authorization": `${sessionStorage.getItem('TOKEN')}`,
      // "Access-Control-Allow-Origin": `${BASE_URL}` 
      })
      console.log(headers)
      const URL =`${BASE_URL}${addNumberToGroup}`
      return this.https.post<any>(URL,data,{headers})
    }
    
       deleteGroup(data:any)
    { 
      const headers = new HttpHeaders({
      "Authorization": `${sessionStorage.getItem('TOKEN')}`,
      // "Access-Control-Allow-Origin": `${BASE_URL}` 
      })
      console.log(headers)
      const URL =`${BASE_URL}${deleteGroup}`
      return this.https.post<any>(URL,data,{headers})
    }

       removeNumberFromGroup(data:any)
    { 
      const headers = new HttpHeaders({
      "Authorization": `${sessionStorage.getItem('TOKEN')}`,
      // "Access-Control-Allow-Origin": `${BASE_URL}` 
      })
      console.log(headers)
      const URL =`${BASE_URL}${removeNumberFromGroup}`
      return this.https.post<any>(URL,data,{headers})
    }

       searchNumberInGroup(data:any)
    { 
      const headers = new HttpHeaders({
      "Authorization": `${sessionStorage.getItem('TOKEN')}`,
      // "Access-Control-Allow-Origin": `${BASE_URL}` 
      })
      console.log(headers)
      const URL =`${BASE_URL}${searchNumberInGroup}`
      return this.https.post<any>(URL,data,{headers})
    }

       getAllNumbersInGroup(data:any)
    { 
      const headers = new HttpHeaders({
      "Authorization": `${sessionStorage.getItem('TOKEN')}`,
      // "Access-Control-Allow-Origin": `${BASE_URL}` 
      })
      console.log(headers)
      const URL =`${BASE_URL}${getAllNumbersInGroup}`
      return this.https.post<any>(URL,data,{headers})
    }

    uploadNumberInUserGroup(data:any)
    { 
      const headers = new HttpHeaders({
      "Authorization": `${sessionStorage.getItem('TOKEN')}`,
      // "Access-Control-Allow-Origin": `${BASE_URL}` 
      })
      console.log(headers)
      const URL =`${BASE_URL}${uploadNumberInUserGroup}`
      return this.https.post<any>(URL,data,{headers})
    }

}
