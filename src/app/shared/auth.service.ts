import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BASE_URL } from '../config/app-config';
import { LoginResponse } from '../models/loginResponst';
import { map } from 'rxjs';
import { StorageService } from './storage.service';
import { Router } from '@angular/router';

const LOGIN_ENDPOINT = '/rcs-reseller-service/reseller/loginUserNameEmail';


@Injectable({
  providedIn: 'root'
})
export class AuthService {
  constructor(
    private httpService: HttpClient,
    private storageService: StorageService,
    private router: Router
  ) { }

  isLoggedIn(): boolean {
    // return !!this.storageService.getToken()
    return !!sessionStorage.getItem("TOKEN")
  }
  // userDetail(){
  //   return sessionStorage.getItem("TOKEN")
  // }
  logoutUser() {
    this.storageService.clear();
    localStorage.clear()
    sessionStorage.clear()
    this.router.navigate(['/login']);
  }

  login(cred: { username: string, password: string, type: string }) {
    const headers = new HttpHeaders({
      "Content-Type": "application/json",
      "X-FORWARDED-FOR": "localhost:8080"
    });
  
    const url = `${BASE_URL}${LOGIN_ENDPOINT}`;
  
    return this.httpService.post<LoginResponse>(url, cred, { headers }).pipe(
      map(data => {
        localStorage.clear();
        sessionStorage.clear();
      
        if (data.result === "success" && data.data.role) {
          console.log("userData:",data)
         sessionStorage.setItem("password", JSON.stringify(cred.password));
          sessionStorage.setItem("TOKEN", data.authJwtToken);
          sessionStorage.setItem("AUTHTOKEN", data.data.authToken);
          sessionStorage.setItem("USER_DATA", JSON.stringify(data.data));
          sessionStorage.setItem("USER_NAME", data.data.username);
          sessionStorage.setItem("USER_ID", data.data.userId);
          sessionStorage.setItem("ROLE", data.data.role);
          sessionStorage.setItem("logoUrl", data.data.logoUrl);
          sessionStorage.setItem("userexpiry", data.data.userexpiry);
          sessionStorage.setItem('userexpiry', data.data.userexpiry); 
           sessionStorage.setItem('lastLoginIp', data.data.lastLoginIp); 
            sessionStorage.setItem('lastLoginTime', data.data.lastLoginTime); 
             sessionStorage.setItem('billingType', data.data.billingType); 
              sessionStorage.setItem('emailId', data.data.emailId); 
            
            
          // Set theme color from API or default to #F44336
          const themeColor = data.data.themeColor ? data.data.themeColor : "#F44336";
          sessionStorage.setItem("themecolor", themeColor);
          
          const hex = themeColor;
          const r = parseInt(hex.slice(1, 3), 16);
          const g = parseInt(hex.slice(3, 5), 16);
          const b = parseInt(hex.slice(5, 7), 16);
          const alpha = 0.1; // Default alpha value
          sessionStorage.setItem("theme-rbga", `rgba(${r}, ${g}, ${b}, ${alpha})`);
          
          if (data.data.role === "admin") {
            console.log("Admin logged in");
            sessionStorage.setItem("ADMIN_PRIVILEGES", "true");
          } else if (data.data.role === "client") {
            console.log("Client logged in");
            sessionStorage.setItem("CLIENT_ACCESS", "true");
          } else {
            console.warn("Unknown role detected:", data.data.role);
          }
        }

        if (data.result === "success" && !data.data.role) {
          sessionStorage.setItem("TOKEN", data.authJwtToken || 'fiwehdfjsdjkbusiwssd')
          sessionStorage.setItem("ROLE", 'agent');
          sessionStorage.setItem("USER_NAME", data.data.userName);
          sessionStorage.setItem("USER_ID", data.data.agentId);
          sessionStorage.setItem("USER_DATA", JSON.stringify(data.data));
          sessionStorage.setItem("themecolor", "#F44336");
          this.router.navigate(['/bot-conversations'])
        }
  
        return data;
      })
    );
  }
  
}