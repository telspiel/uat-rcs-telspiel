import { Component } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { Validators } from 'ngx-editor';
import { BillingPageService } from 'src/app/service/billing-page.service';
import { UserCreationService } from 'src/app/service/user-creation.service';
import { WalletService } from 'src/app/service/wallet.service';
import { ToastService } from 'src/app/shared/toast-service.service';
import { NzNotificationService } from 'ng-zorro-antd/notification';

@Component({
  selector: 'app-add-wallet',
  templateUrl: './add-wallet.component.html',
  styleUrls: ['./add-wallet.component.scss']
})
export class AddWalletComponent {
  plans: any[] = [];
  selectedReseller: string | null = null;
  selectedSeller: string | null = null;
  selectedClient: string | null = null;
  loggedInUserWallet: string | number = ''; 
  Clientlist: any[] = []
  ResllerList: any[] = []
 userAvailableWallet: number | null = null;
  SellerList: any[] = []
  role = sessionStorage.getItem('ROLE') || ""
  client:any
  userdt: any;
  updateWallet!: FormGroup;
  Adminlist: any []=[]

  constructor(private billigService: BillingPageService, private userCreation: UserCreationService, private fb :FormBuilder, private walletService: WalletService, private toastService:ToastService, private notification: NzNotificationService) {

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







  onResellerChange(selectedReseller: string) {
    this.selectedReseller = selectedReseller;
    this.selectedSeller = null;
    this.selectedClient = null;
    this.client=selectedReseller
    this.AvailableBalance()

    
  }

  onSellerChange(selectedSeller: string) {
    this.selectedSeller = selectedSeller;
    this.selectedClient = null;
    this.selectedReseller = null;
    this.client=selectedSeller
    this.AvailableBalance()
  }

  onClientChange(selectedClient: string) {
    this.selectedClient = selectedClient;
    this.selectedReseller = null;
    this.selectedSeller = null;
    this.client = selectedClient;
    this.AvailableBalance()


  }
  ngOnInit(): void {
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
    if (res.result === "Success" && res.data?.responseData?.loggedInUserWallet !== undefined) {
      this.loggedInUserWallet = res.data.responseData.loggedInUserWallet;
    }
      },
  (error) => {
    console.error("Error fetching text credit:", error);
  }

);
    this.billigService.getAllBillingPlan().subscribe((res) => {
      this.plans = res.data.map((dt: any) => dt.planName);
    })

    this.userdt =
    {
      loggedInUsername: sessionStorage.getItem('USER_NAME'),
      userId: sessionStorage.getItem('USER_ID')

    }
    this.userCreation.getAllChildForUser(this.userdt).subscribe(
      (res) => {
        this.Adminlist=[res.data.userAllChildMap.ADMIN].flatMap((obj: any) => {
          return Object.entries(obj).map(([key, value]) => ({
            label: key,
            value: value
          }))
        });
        this.SellerList = [res.data.userAllChildMap.SELLER].flatMap((obj: any) => {
          return Object.entries(obj).map(([key, value]) => ({
            label: key,
            value: value
          }))
        }
        )
        this.Clientlist = [res.data.userAllChildMap.CLIENT].flatMap((obj: any) => {
          return Object.entries(obj).map(([key, value]) => ({
            label: key,
            value: value
          }))
        });
        this.ResllerList = [res.data.userAllChildMap.RESELLER].flatMap((obj: any) => {
          return Object.entries(obj).map(([key, value]) => ({
            label: key,
            value: value
          }))
        });

      }

    )
  }


  AvailableBalance(){
    let dt={
      loggedInUserName:sessionStorage.getItem('USER_NAME'),
      resellerName:this.selectedReseller || '',
      sellerName:this.selectedSeller || '',
      clientName:this.selectedClient || '',
    }
  this.walletService.getAvailableBalanceForUser(dt).subscribe(
  (res) => {
    console.log("xoxoxoxox", JSON.stringify(res));
    if (res?.data?.responseData) {
      this.loggedInUserWallet = res.data.responseData.loggedInUserWallet;
      this.userAvailableWallet = res.data.responseData.userAvailableWallet;
    }
  }
);

  }
updateWalletData() {
  console.log(this.updateWallet.value);

this.walletService.updateWalletForUser(this.updateWallet.value).subscribe(
  (res: any) => {
    console.log(res);

   if (res?.result === 'Success') {
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



}


