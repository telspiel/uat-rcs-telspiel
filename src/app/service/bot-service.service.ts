import { HttpClientModule } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { BASE_URL } from '../config/app-config';
import { BehaviorSubject } from 'rxjs';


const BRAND = "/rcs-reseller-service/botService/submitBot"
const UPLOD =  "/rcs-reseller-service/uploadFileService/uploadFile"
const TPS = "/rcs-reseller-service/saveOperatorInfo"
const TPS_EDIT = "/rcs-reseller-service/updateOperatorInfo"
const TPS_LIST = "/rcs-reseller-service/getOperatorInfo"
const credithistory = "/rcs-reseller-service/creditService/getCreditHistory"

@Injectable({
  providedIn: 'root'
})
export class BotServiceService {
  private selectedBot: any = null;

  private botNameSource = new BehaviorSubject<string>('');
    currentBotName = this.botNameSource.asObservable();
  
    setBotName(botName: string) {
      this.botNameSource.next(botName);
    }
  
  setBotDetails(bot: any) {
    
    sessionStorage.removeItem('botId')
    sessionStorage.setItem('botId',JSON.stringify(bot))
    let botDetails=sessionStorage.getItem('botId') || ""
    this.selectedBot=JSON.parse(botDetails)
  }

  getBotDetails() {
    return this.selectedBot;
  }
  constructor(private https : HttpClient) { }

  verifyBrand(data: any) { 
    const headers = new HttpHeaders({
        "Authorization": `${sessionStorage.getItem('TOKEN')}`,
        "Content-Type": "application/json"
    });
      
    console.log('Sending JSON Data:', data);
      
    const URL = `${BASE_URL}${BRAND}`;
    return this.https.post<any>(URL, JSON.stringify(data), { headers });
  }

  uplodFile(data : any){ 
    const headers = new HttpHeaders({
        "Authorization": `${sessionStorage.getItem('TOKEN')}`,
        //"Content-Type": "application/json"
    });
      
    console.log('Sending JSON Data:', data);
      
    const URL = `${BASE_URL}${UPLOD}`;
    return this.https.post<any>(URL, data, { headers });
  }


  addtps(dt:any){
    const headers = new HttpHeaders({
      "Authorization": `${sessionStorage.getItem('TOKEN')}`,
      "Content-Type": "application/json"
    })
    const Data= {
      "loggedInUserName": sessionStorage.getItem('USER_NAME'),
      ...dt
    }
    const url = `${BASE_URL}${TPS}`
    return this.https.post<any>(url,Data, { headers });


  }

 edittps(dt: any) {
  const headers = new HttpHeaders({
    "Authorization": `${sessionStorage.getItem('TOKEN')}`,
    "Content-Type": "application/json"
  });

  const Data = {
    "loggedInUserName": sessionStorage.getItem('USER_NAME'),
    ...dt
  };

  const url = `${BASE_URL}${TPS_EDIT}`;
  return this.https.put<any>(url, Data, { headers });
}


  
viewtps(dt: any) {
  const loggedInUserName = sessionStorage.getItem('USER_NAME') || "";
  const url = `${BASE_URL}${TPS_LIST}?loggedInUserName=${encodeURIComponent(loggedInUserName)}`;

  const headers = new HttpHeaders({
    "Authorization": `${sessionStorage.getItem('TOKEN') || ''}`,
    "Content-Type": "application/json"
  });

  return this.https.get<any>(url, { headers });
}


 credithistory(dt: any) {
  const headers = new HttpHeaders({
    "Authorization": `${sessionStorage.getItem('TOKEN')}`,
    "Content-Type": "application/json"
  });

  const Data = {
    "loggedInUserName": sessionStorage.getItem('USER_NAME'),
    ...dt
  };

  const url = `${BASE_URL}${credithistory}`;
  return this.https.post<any>(url, Data, { headers });
}




}