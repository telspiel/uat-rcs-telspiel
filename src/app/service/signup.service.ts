import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

const BASE_URL="https://uatbackend1.gmstool.com"
const endpoint="/file-uploader/signup"
@Injectable({
  providedIn: 'root'
})
export class SignupService {

  constructor(private httpService: HttpClient) { }
  
  signUp(dt:any){
    const url =`${BASE_URL}${endpoint}`
    return this.httpService.post<any>(url, dt)

  }
}
