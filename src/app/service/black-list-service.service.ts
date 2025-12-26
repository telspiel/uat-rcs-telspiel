import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BASE_URL } from '../config/app-config';


const addNumberToList = "/rcs-reseller-service/blackListService/addNumberToList";

const addList = "/rcs-reseller-service/blackListService/addList";

const addNumbertoList = "/rcs-reseller-service/userBlackListService/addNumberInUserBlackList";

const viewNumber = "/rcs-reseller-service/userBlackListService/getAllBlacklistNumbersForUser"

const uploadNumber  = "/rcs-reseller-service/userBlackListService/uploadUserBlackListNumberFile"

const deleteNumber = "/rcs-reseller-service/userBlackListService/removeNumberFromUserBlackList"

const searchNumber = "/rcs-reseller-service/userBlackListService/searchUserBlacklistNumber"


@Injectable({
  providedIn: 'root'
})
export class BlackListServiceService {

  username = sessionStorage.getItem('USER_NAME');
  constructor(private https : HttpClient) { }


  addNumberToGroup(data:any)
      { 
        const headers = new HttpHeaders({
        "Authorization": `${sessionStorage.getItem('TOKEN')}`,
        // "Access-Control-Allow-Origin": `${BASE_URL}` 
        })
        console.log(headers)
        const URL =`${BASE_URL}${addNumberToList}`
        return this.https.post<any>(URL,data,{headers})
      }

      viewNumber(data:any)
         { 
           const headers = new HttpHeaders({
           "Authorization": `${sessionStorage.getItem('TOKEN')}`,
           // "Access-Control-Allow-Origin": `${BASE_URL}` 
           })
           console.log(headers)
           const URL =`${BASE_URL}${viewNumber}`
           return this.https.post<any>(URL,data,{headers})
         }

     
        addGroup(data:any)
         { 
           const headers = new HttpHeaders({
           "Authorization": `${sessionStorage.getItem('TOKEN')}`,
           // "Access-Control-Allow-Origin": `${BASE_URL}` 
           })
           console.log(headers)
           const URL =`${BASE_URL}${addNumbertoList}`
           return this.https.post<any>(URL,data,{headers})
         }

         uploadNumber(data:any){
           { 
           const headers = new HttpHeaders({
           "Authorization": `${sessionStorage.getItem('TOKEN')}`,
           // "Access-Control-Allow-Origin": `${BASE_URL}` 
           })
           console.log(headers)
           const URL =`${BASE_URL}${uploadNumber}`
           return this.https.post<any>(URL,data,{headers})
         }
         }


         deleteNumber(data:any){

            { 
           const headers = new HttpHeaders({
           "Authorization": `${sessionStorage.getItem('TOKEN')}`,
           // "Access-Control-Allow-Origin": `${BASE_URL}` 
           })
           console.log(headers)
           const URL =`${BASE_URL}${deleteNumber}`
           return this.https.post<any>(URL,data,{headers})
         }
         }

         Search(data:any){
           { 
           const headers = new HttpHeaders({
           "Authorization": `${sessionStorage.getItem('TOKEN')}`,
           // "Access-Control-Allow-Origin": `${BASE_URL}` 
           })
           console.log(headers)
           const URL =`${BASE_URL}${searchNumber}`
           return this.https.post<any>(URL,data,{headers})
         }

         }
}
