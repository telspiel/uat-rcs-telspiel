import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BASE_URL } from '../config/app-config';
import { Observable } from 'rxjs';
import { HTTP_Response } from '../models/responseModel';

const ADDUSER = '/rcs-reseller-service/userService/saveUser';
const GETUSER = '/rcs-reseller-service/userService/getUser';
const GETALLCHILDUSERS = '/rcs-reseller-service/reseller/getAllChildForUser'
const logoupload = '/rcs-reseller-service/logoService/uploadLogo';
const checkavailability='/rcs-reseller-service/checkAvailability'

const updatepassword = '/rcs-reseller-service/userProfile/updatedPassword'





@Injectable({
  providedIn: 'root'
})
export class UserCreationService {
  data: any = sessionStorage.getItem("USER_DATA")
  user: any = JSON.parse(this.data)

  constructor(private httpService: HttpClient) { }
  checkavailability(dt: any) {
    const headers = new HttpHeaders({
      "Authorization": `${sessionStorage.getItem('TOKEN')}`,
      "Content-Type": "application/json"
    })
    const url = `${BASE_URL}${checkavailability}?loggedInUserName=${sessionStorage.getItem('USER_NAME')}&userName=${dt.username}&email=${dt.email}`
    return this.httpService.get<any>(url, { headers });
  }
  addUser(dt: any) {
    const headers = new HttpHeaders({
      "Authorization": `${sessionStorage.getItem('TOKEN')}`,
      // "Access-Control-Allow-Origin": `${BASE_URL}`
      
    })
    const url = `${BASE_URL}${ADDUSER}`
    return this.httpService.post<HTTP_Response>(url, JSON.parse(dt), { headers });
  }


    updatepassword(dt: any) {
    const headers = new HttpHeaders({
      "Authorization": `${sessionStorage.getItem('TOKEN')}`,
      // "Access-Control-Allow-Origin": `${BASE_URL}`
      
    })
    const url = `${BASE_URL}${updatepassword}`
     return this.httpService.post(url, dt, { headers });
  }


  getUser(dt: any) {
    const headers = new HttpHeaders({
      "Authorization": `${sessionStorage.getItem('TOKEN')}`,
      // "Access-Control-Allow-Origin": `${BASE_URL}`
      
    })
    const url =`${BASE_URL}${GETUSER}`
    return this.httpService.post<HTTP_Response>(url,dt, { headers })

  }

  logoupload (dt: any) {
    const headers = new HttpHeaders({
      "Authorization": `${sessionStorage.getItem('TOKEN')}`,
      // "Access-Control-Allow-Origin": `${BASE_URL}`
      
    })
    const url =`${BASE_URL}${logoupload}`
    return this.httpService.post<HTTP_Response>(url,dt, { headers })

  }
  //  getUserById(id:any){
  //   const baseUrl=""
  //   const url = `${baseUrl}${GETUSER}/${id}`
  //   return this.httpService.post<HTTP_Response>(url);
  //  }
  getAllChildForUser(dt: any) {
    const headers = new HttpHeaders({
      "Authorization": `${sessionStorage.getItem('TOKEN')}`,
      "Content-Type":"application/json",
      "X-FORWARDED-FOR":"localhost:8080",
      // "authToken":`${sessionStorage.getItem('AUTHTOKEN')}`
    })
    const url = `${BASE_URL}${GETALLCHILDUSERS}`
    return this.httpService.post<HTTP_Response>(url, dt, { headers })
  }
}
