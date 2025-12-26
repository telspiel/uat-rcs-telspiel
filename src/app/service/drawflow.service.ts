import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { BASE_URL } from '../config/app-config';
import { Observable, tap, catchError } from 'rxjs';

const Add = '/rcs-reseller-service/saveBotTemplates';
const View = '/rcs-reseller-service/viewBotTemplates';
const Update = '/rcs-reseller-service/viewBotTemplates';
const viewchatbot = '/rcs-reseller-service/chatBotNames';

@Injectable({
  providedIn: 'root'
})
export class DrawflowService {
  constructor(private httpService: HttpClient) {}

  // Optional: Keep this if you want a reusable post method
  post<T>(url: string, body: any, options: { headers: HttpHeaders }): Observable<T> {
    return this.httpService.post<T>(url, body, options);
  }

  drawflowadd(body: any, loggedInUserName: string, chatBotName: string): Observable<any> {
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': `${sessionStorage.getItem('TOKEN')}`,
      'loggedInUserName': loggedInUserName, 
      'chatBotName': chatBotName           
    });
  
    const URL = `${BASE_URL}/rcs-reseller-service/saveBotTemplates`;
  
    console.log("📤 Request URL:", URL);
    console.log("📤 Request Headers:", headers.keys().map(key => `${key}: ${headers.get(key)}`));
    console.log("📤 Request Body:", JSON.stringify(body, null, 2));
  
    return this.httpService.post<any>(URL, body, { headers }).pipe(
      tap(response => console.log("✅ Response:", response)),
      catchError(err => {
        console.error("❌ Error:", err);
        throw err;
      })
    );
  }



  chatview(body: any, loggedInUserName: string): Observable<any> {
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': `${sessionStorage.getItem('TOKEN')}`,
      'loggedInUserName': loggedInUserName,          
    });
  
    const URL = `${BASE_URL}/rcs-reseller-service/chatBotNames`;
  
    console.log("📤 Request URL:", URL);
    console.log("📤 Request Headers:", headers.keys().map(key => `${key}: ${headers.get(key)}`));
    console.log("📤 Request Body:", JSON.stringify(body, null, 2));
  
    return this.httpService.post<any>(URL, body, { headers }).pipe(
      tap(response => console.log("✅ Response:", response)),
      catchError(err => {
        console.error("❌ Error:", err);
        throw err;
      })
    );
  }

  drawflowupdate(dt: any): Observable<any> {
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': `${sessionStorage.getItem('TOKEN')}`
    });
    const URL = `${BASE_URL}${Update}`;
    return this.httpService.get<any>(URL, { headers }).pipe(
      tap(response => console.log("✅ Update Response:", response)),
      catchError(err => {
        console.error("❌ Update Error:", err);
        throw err;
      })
    );
  }

  drawflowview(loggedInUserName: string, chatBotName: string): Observable<any> {
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': `${sessionStorage.getItem('TOKEN')}`,
      'loggedInUserName': loggedInUserName,
      'chatBotName': chatBotName
    });
  
    const URL = `${BASE_URL}/rcs-reseller-service/viewBotTemplates`;
  
    console.log("📤 Request URL:", URL);
    console.log("📤 Request Headers:", headers.keys().map(key => `${key}: ${headers.get(key)}`));
  
    return this.httpService.get<any>(URL, { headers }).pipe(
      tap(response => console.log("✅ Response:", response)),
      catchError(err => {
        console.error("❌ Error:", err);
        throw err;
      })
    );
  }
  
}