import { Component } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { Validators } from 'ngx-editor';
import { BillingPageService } from 'src/app/service/billing-page.service';
import { UserCreationService } from 'src/app/service/user-creation.service';
import { WalletService } from 'src/app/service/wallet.service';
import { ToastService } from 'src/app/shared/toast-service.service';
import { NzNotificationService } from 'ng-zorro-antd/notification';

@Component({
  selector: 'app-generate-api',
  templateUrl: './generate-api.component.html',
  styleUrls: ['./generate-api.component.scss']
})
export class GenerateApiComponent {
plans: any[] = [];
 fileErr:boolean = false;
  // sirf string rakhenge
  selectedReseller: string | null = null;
  selectedSeller: string | null = null;
  selectedClient: string | null = null;
  selectedAdmin: string | null = null;

  loggedInUserWallet: string | number = '';
  Clientlist: any[] = [];
  ResllerList: any[] = [];
  SellerList: any[] = [];
  Adminlist: any[] = [];
  role = sessionStorage.getItem('ROLE') || '';
  genbtn: boolean = true;
  updateWallet!: FormGroup;
  toCopy: any;
  userdt: any;

  constructor(
    private billigService: BillingPageService,
    private userCreation: UserCreationService,
    private fb: FormBuilder,
    private walletService: WalletService,
    private toastService: ToastService,
    private notification: NzNotificationService
  ) {
    this.updateWallet = this.fb.group({
      loggedInUserName: [sessionStorage.getItem('USER_NAME')],
      resellerName: [''],
      sellerName: [''],
      clientName: [''],
      adminName: [''],
      remarks: ['', Validators.required],
      balanceAdded: ['', Validators.required],
      walletPlanName: [''],
    });
  }

  handleSelection(event: any): void {
    console.log('User selection:', event);

    this.selectedAdmin = event.admin || null;
    this.selectedReseller = event.reseller || null;
    this.selectedSeller = event.seller || null;
    this.selectedClient = event.client || null;

    console.log('Updated selections =>', {
      admin: this.selectedAdmin,
      reseller: this.selectedReseller,
      seller: this.selectedSeller,
      client: this.selectedClient,
    });
  }

  ngOnInit(): void {
    const role = sessionStorage.getItem('ROLE');
    const userName = sessionStorage.getItem('USER_NAME');
    if (role === 'agent') {
      return;
    }

    let dt = {
      loggedInUserName: userName,
      resellerName: role === 'reseller' ? userName : null,
      sellerName: role === 'seller' ? userName : null,
      clientName: role === 'client' ? userName : null,
      adminName: role === 'admin' ? userName : null,
    };

    this.walletService.getAvailableBalanceForUser(dt).subscribe((res) => {
      if (res.result === 'Success' && res.data?.responseData?.loggedInUserWallet !== undefined) {
        this.loggedInUserWallet = res.data.responseData.loggedInUserWallet;
      }
    });

    this.billigService.getAllBillingPlan().subscribe((res) => {
      this.plans = res.data.map((dt: any) => dt.planName);
    });

    this.userdt = {
      loggedInUsername: sessionStorage.getItem('USER_NAME'),
      userId: sessionStorage.getItem('USER_ID'),
    };

    this.userCreation.getAllChildForUser(this.userdt).subscribe((res) => {
      this.Adminlist = Object.keys(res.data.userAllChildMap.ADMIN || {}).map((key) => ({
        label: key,
        value: key,
      }));
      this.SellerList = Object.keys(res.data.userAllChildMap.SELLER || {}).map((key) => ({
        label: key,
        value: key,
      }));
      this.Clientlist = Object.keys(res.data.userAllChildMap.CLIENT || {}).map((key) => ({
        label: key,
        value: key,
      }));
      this.ResllerList = Object.keys(res.data.userAllChildMap.RESELLER || {}).map((key) => ({
        label: key,
        value: key,
      }));
    });
  }

  private getSelectedUser(): string | null {
    return this.selectedReseller || this.selectedSeller || this.selectedClient || this.selectedAdmin;
  }

 viewApiKey(): void {
  let userName = this.getSelectedUser();
  if (!userName) {
    this.toastService.publishNotification('warn', 'Please select a user');
    return;
  }

  const parameter = {
    loggedInUserName: sessionStorage.getItem('USER_NAME') || '',
    userName: userName,
    operation: 'getUserApiKey',
  };

  console.log('viewApiKey Payload:', parameter);

  this.walletService.getUserApiKey(parameter).subscribe(
    (res) => {
      if (
        res.result?.toLowerCase() === 'success' &&
        res.data?.apiKey
      ) {
        this.toCopy = res.data.apiKey;
        this.toastService.publishNotification('success', 'API Key fetched successfully!');
      } else {
        this.toastService.publishNotification('error', 'API Key not available for this user.');
      }
    },
    () =>
      this.toastService.publishNotification(
        'error',
        'Internal Server Error. Please try again later.'
      )
  );

  this.genbtn = false;
}


  generateApiKey(): void {
    if (!window.confirm('Are you sure you want to generate new API key?')) {
      return;
    }

    let userName = this.getSelectedUser();
    if (!userName) {
      this.toastService.publishNotification('warn', 'Please select a user');
      return;
    }

    const parameter = {
      loggedInUserName: sessionStorage.getItem('USER_NAME') || '',
      userName: userName,
      operation: 'getUserApiKey',
    };

    console.log('generateApiKey Payload:', parameter);

    this.walletService.generateUserApiKey(parameter).subscribe(
      (res) => {
        if (res.result.toLowerCase() === 'success') {
          this.toCopy = res.data.apiKey;
          this.toastService.publishNotification('Success', 'New API Key generated successfully!', 'success');
        } else {
          this.toastService.publishNotification('error', 'Invalid selection or Something went wrong');
        }
      },
      () => this.toastService.publishNotification('error', 'Internal Server Error. Please try again later.')
    );
  }

  copyInputMessage(inputElement: HTMLTextAreaElement) {
    inputElement.select();
    document.execCommand('copy');
    inputElement.setSelectionRange(0, 0);
    this.toastService.publishNotification('Success', 'Copied successfully!');
  }
}