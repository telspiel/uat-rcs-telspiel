import { Component } from '@angular/core';
import { UserCreationService } from 'src/app/service/user-creation.service';

@Component({
  selector: 'app-download-report',
  templateUrl: './download-report.component.html',
  styleUrls: ['./download-report.component.scss']
})
export class DownloadReportComponent {
  date:any
  total=1
  loading = true;
  pageSize = 10;
  pageIndex = 1;
  SellerList: any[] = [];
  Adminlist: any[] = [];
  Clientlist: any[] = [];
  ResllerList: any[] = [];
  Reseller = "";
  Seller = "";
  client = "";
  Admin = "";
  role=sessionStorage.getItem('ROLE') || "";


  constructor(private userCreation: UserCreationService) {
    this.getOptions()
  }
  onSubmit(){

  }
  getOptions() {
    const userdt = {
      loggedInUsername: sessionStorage.getItem('USER_NAME'),
      userId: sessionStorage.getItem('USER_ID')
    };
    this.userCreation.getAllChildForUser(userdt).subscribe(res => {
      const userMap = res.data.userAllChildMap;
  
      const mapToList = (role: string) => {
        const data = userMap[role];
        return data ? [data].flatMap((obj: any) =>
          Object.entries(obj).map(([key, value]) => ({
            label: key,
            value: value
          }))
        ) : [];
      };
  
      this.SellerList = mapToList('SELLER');
      this.Adminlist = mapToList('ADMIN');
      this.Clientlist = mapToList('CLIENT');
      this.ResllerList = mapToList('RESELLER');
    });
  }
  getUserData(Value:string, type:string) {
    if(type=='reseller')
    {
      this.Seller = ""
      this.client = ""
    }
    else if(type=='Seller'){
      this.Reseller = ""
      this.client = ""
    }
    else if (type=='client'){
      this.Reseller = ""
      this.Seller = ""
    }
    
  }
  
}
