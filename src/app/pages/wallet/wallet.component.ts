import { Component } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { BillingPageService } from 'src/app/service/billing-page.service';
import { UserCreationService } from 'src/app/service/user-creation.service';
import { WalletService } from 'src/app/service/wallet.service';
import { ToastService } from 'src/app/shared/toast-service.service';
import { NzNotificationService } from 'ng-zorro-antd/notification';
import { Validators } from 'ngx-editor';


@Component({
  selector: 'app-wallet',
  templateUrl: './wallet.component.html',
  styleUrls: ['./wallet.component.scss']
})



export class WalletComponent {
  plans: any[] = [];
  userName=sessionStorage.getItem('USER_NAME')
  tableData:any;
  // date:any;
   date: [Date, Date] = [new Date(), new Date()];
  fromDate: any;
  toDate: any;
  selectedAdmin: string | null = null;
  selectedReseller: string| null = null;
  selectedSeller: string | null = null;
  selectedClient: string | null = null;
 Admin: string | null = null;
  Seller: string | null = null;
  Client: string | null = null;
  Reseller: string | null = null;
    client:any
    updateWallet!: FormGroup;
    loggedInUserWallet: string | number = ''; 
      Adminlist: any []=[];
  ResllerList: any[] = [];
  SellerList: any[] = [];
  Clientlist: any[] = [];
public userAvailableWallet: number | string = '';

  
constructor(private billigService: BillingPageService , private fb :FormBuilder,  private userCreation: UserCreationService, private walletService:WalletService,  private toastService:ToastService, private notification: NzNotificationService){
 this.updateWallet=this.fb.group({
      loggedInUserName:[sessionStorage.getItem('USER_NAME')],
      resellerName: [this.selectedReseller||''],
      sellerName: [this.selectedSeller||''],
      clientName: [this.selectedClient||''],
      adminName: [''],
      remarks: ['',Validators.required],
      balanceAdded: ['',Validators.required],
      walletPlanName: [''],
    })
}
role=sessionStorage.getItem('ROLE')||""
userdt:any;

onChangedate(){
  const formattedDate = new Date(this.date[0]).toISOString().split('T')[0];
  console.log(formattedDate);
  console.log(this.date[1])
}

handleSelection(event:any){
  console.log(event)
  if(event.admin){
    this.Admin = event.admin;
  }
  if(event.reseller){
    this.Reseller = event.reseller;
  }
  if(event.seller){
    this.Seller = event.seller;
  }
  if(event.client){
    this.Client = event.client;
  }

}
   onChange(type:string){
    if(type=='reseller')
      {
        this.Admin=""
        this.Seller = ""
        this.Client = ""
        
      }
      else if(type=='seller'){
        this.Reseller = ""
        this.Client = ""
        this.Admin=""
        
      }
      else if (type=='client'){
        this.Reseller = ""
        this.Seller = ""
        this.Admin=""
        
      }
      else if (type=='admin'){
        this.Reseller = ""
        this.Seller = ""
        this.Client = ""
        
      }
     
  }


onTabChange(event: any) {
  // Clear role selections
this.selectedAdmin = null;
  this.selectedReseller = null;
    this.selectedSeller = null;
    this.selectedClient = null;
      this.tableData = null;
    this.fromDate = [new Date(), new Date()];
  this.toDate = [new Date(), new Date()];


// Get the selected tab

  // Reset form properly
  this.updateWallet.reset();

  // If you need to reset other forms or data, do it here too
  // this.operatorForm.reset();
  // this.operatorData.clear();

  if (event.index === 2) {
    // Optional: handle third tab separately
  }
}



      onAdminChange(value: string): void {
    this.selectedAdmin = value;
    this.selectedReseller = '';
    this.selectedSeller = '';
    this.selectedClient = '';
 this.AvailableBalance()
  }
  onResellerChange(value: string) {
    this.selectedReseller = value;
    this.selectedSeller = '';
    this.selectedClient = '';
    this.AvailableBalance()

    
  }

  onSellerChange(value: string) {
    this.selectedSeller = value;
    this.selectedClient = '';
    this.selectedReseller = '';
    this.client=''
    this.AvailableBalance()
  }

  onClientChange(value: string) {
    this.selectedClient = value;
    this.selectedReseller = '';
    this.selectedSeller = '';
    this.client = '';
    this.AvailableBalance()


  }
ngOnInit(): void {
   this.onChangeDate();
  this.getAllChildUsers();
  this.billigService.getAllBillingPlan().subscribe((res)=>{
    this.plans = res.data.map((dt: any) => dt.planName);
    console.log(res)
  })

  
  // add tab changes

  const role = sessionStorage.getItem("ROLE");
    const userName = sessionStorage.getItem("USER_NAME");
    if (role === "agent") {
      return;
    }

        let dt = {
      loggedInUserName: sessionStorage.getItem("USER_NAME"),
      resellerName: role === "reseller" ? userName : null,
      sellerName: role === "seller" ? userName : null,
      clientName: role === "client" ? userName : null,
      adminName: role === "admin" ? userName : null,
    };
   this.walletService.getAvailableBalanceForUser(dt).subscribe(

(res) =>{
    if (res.result === "Success" && res.data?.responseData?.loggedInUserWallet !== undefined && res.data?.responseData?.userAvailableWallet !== undefined) {
      this.loggedInUserWallet = res.data.responseData.loggedInUserWallet;
    }
  },

);
    this.billigService.getAllBillingPlan().subscribe((res) => {
      this.plans = res.data.map((dt: any) => dt.planName);
    })

}


 getAllChildUsers(): void {
    const userData = {
      loggedInUsername: sessionStorage.getItem('USER_NAME'),
      userId: sessionStorage.getItem('USER_ID')
    };

    this.userCreation.getAllChildForUser(userData).subscribe(res => {
      this.Adminlist = this.mapUserList(res.data.userAllChildMap.ADMIN);
      this.ResllerList = this.mapUserList(res.data.userAllChildMap.RESELLER);
      this.SellerList = this.mapUserList(res.data.userAllChildMap.SELLER);
      this.Clientlist = this.mapUserList(res.data.userAllChildMap.CLIENT);
    });
  }
    mapUserList(userMap: any): any[] {
    return [userMap].flatMap((obj: any) => {
      return Object.entries(obj).map(([key, value]) => ({ label: key, value: value }));
    });
  }

onSearch(){
  let dt={
    loggedInUserName:sessionStorage.getItem('USER_NAME'),
    resellerName:this.selectedReseller|| '',
    sellerName:this.selectedSeller|| '',
    clientName:this.selectedClient|| '',
    fromDate:new Date(this.date[0]).toISOString().split('T')[0],
    toDate:new Date(this.date[1]).toISOString().split('T')[0],

  }
  this.walletService.getWalletHistory(dt).subscribe(

    (res)=>{
     this.tableData = res.data.userHistoryList.map((entry: any) => {
        return {
          userName: entry.updatedBy || 'N/A',  // You can replace this if userName comes from another field
          planName: entry.walletPlanName || 'N/A',
          comments: entry.remarks || 'N/A',
          createdDate: entry.createdDate || null,
          remarks: entry.remarks || 'N/A',
          updatedAmount: entry.updatedAmount || 'N/A',
          amount: entry.amount || 'N/A'
        };
      console.log(res)
    }
  )
}
  )
}


// add tab wallet changes -------------------------------------------------------
AvailableBalance() {
  const dt = {
    loggedInUserName: sessionStorage.getItem('USER_NAME'),
    resellerName: this.selectedReseller || '',
    sellerName: this.selectedSeller || '',
    clientName: this.selectedClient || '',
  };

  this.walletService.getAvailableBalanceForUser(dt).subscribe(
    (res: any) => {
      console.log("xoxoxoxox", JSON.stringify(res));

      if (res?.result === 'Success') {
        // this.notification.create('success', 'Success', res.message);
        
        this.loggedInUserWallet = res.data.responseData.loggedInUserWallet;
        this.userAvailableWallet = res.data.responseData.userAvailableWallet;

        console.log("userAvailableWallet: " + this.userAvailableWallet);
      } else if (res?.result === 'Failure') {
        // this.notification.create('error', 'Error', res.message);
      } else {
        // this.notification.create('error', 'Error', 'Unexpected response.');
      }
    },
    (error) => {
      console.error(error);
      this.notification.create('error', 'Error', 'Something went wrong while fetching wallet balance.');
    }
  );
}

updateWalletData() {
  console.log(this.updateWallet.value);

  const requestData = {
      resellerName: this.selectedReseller,
      sellerName: this.selectedSeller,
      clientName: this.selectedClient,
      adminName: this.selectedAdmin,
     remarks: this.updateWallet.get('remarks')?.value,
    balanceAdded: this.updateWallet.get('balanceAdded')?.value,
    walletPlanName: this.updateWallet.get('walletPlanName')?.value,
    loggedInUserName: sessionStorage.getItem('USER_NAME'),
      
  }

this.walletService.updateWalletForUser(requestData).subscribe(
  (res: any) => {
    console.log(res);
   if (res?.result === 'Success') {
    this.updateWallet.reset();
  this.notification.create('success', 'Success', res.message);
} else if (res?.result === 'Failure') {
  this.notification.create('error', 'Error', res.message);
} else {
  this.notification.create('error', 'Error', 'Unexpected response.');
}

  },
  (error) => {
    console.error(error);
    this.toastService.publishNotification('Something went wrong while updating the wallet.', 'error');
  }
);


}
disableFutureDates = (current: Date): boolean => {
  // Disable dates after today
  return current && current > new Date();
};
onChangeDate() {
    const formattedDate = new Date(this.date[0]).toISOString().split('T')[0];
    const fromDate = this.date[0]
    const toDate = this.date[1];
    this.fromDate = fromDate
    this.toDate = toDate
   
  }
      
    
}
