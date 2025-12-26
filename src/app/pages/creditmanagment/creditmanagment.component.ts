// creditmanagment.component.ts
import { Component, OnInit } from "@angular/core";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { DomSanitizer } from "@angular/platform-browser";
import { Router } from "@angular/router";
import { TemplateMessageService } from "src/app/service/template-message.service";
import { TemplateService } from "src/app/service/template-service.service";
import { ToastService } from "src/app/shared/toast-service.service";
import { BotServiceService } from "src/app/service/bot-service.service";
import { UserCreationService } from "src/app/service/user-creation.service";
import { BrandService } from "src/app/service/brand.service";
import { ReportService } from "src/app/service/report.service";
import { formatDate } from "@angular/common";
import { format } from "date-fns";

@Component({
  selector: "app-creditmanagment",
  templateUrl: "./creditmanagment.component.html",
  styleUrls: ["./creditmanagment.component.scss"],
})
export class CreditmanagmentComponent implements OnInit {
  data: any;
  date: [Date, Date] = [new Date(), new Date()];
  creditForm: FormGroup;
  credithistory!: FormGroup;
  loggedInUserName: string = "";
  selectedAdmin: string | null = null;
  selectedReseller: string | null = null;
  selectedSeller: string | null = null;
  selectedClient: string | null = null;
  Admin: string | null = null;
  Seller: string | null = null;
  Client: string | null = null;
  Reseller: string | null = null;
  pageSize = 10;
  pageIndex = 1;
  totalRecords = 0;
  userHistory: any[] = [];
  Adminlist: any[] = [];
  ResllerList: any[] = [];
  SellerList: any[] = [];
  Clientlist: any[] = [];

  fromDate: any;
  toDate: any;

  role: string = sessionStorage.getItem("ROLE") || "";

  constructor(
    private fb: FormBuilder,
    private templateMessageService: TemplateMessageService,
    private toastService: ToastService,
    private router: Router,
    private templateService: TemplateService,
    private sanitizer: DomSanitizer,
    private notifyService: ToastService,
    private botService: BotServiceService,
    private userCreation: UserCreationService,
    private brandService: BrandService,
    private reportService: ReportService
  ) {
    this.creditForm = this.fb.group({
      reseller: [null],
      seller: [null],
      client: [null],
      yourCredit: [{ value: "", disabled: true }],
      customerCredit: [{ value: "", disabled: true }],
      creditType: ["TEXT_CREDIT"],
      creditTypes: [""],
      addCredits: ["", Validators.required],
      remark: ["", Validators.required],
    });
  }
  handleSelection(event: any): void {
  console.log('User selection:', event);
  this.selectedAdmin=event.admin
  this.selectedClient=event.client
  this.selectedReseller=event.reseller
  this.selectedSeller=event.seller
  this.totalCredit(); // Based on updated values
}
  ngOnInit(): void {
    this.onChangeDate();
    this.creditForm
      .get("creditType")
      ?.valueChanges.subscribe(() => this.totalCredit());
    this.getAllChildUsers();

    const userName = sessionStorage.getItem("USER_NAME");
    if (this.role === "agent") return;
    console.log("role of my " + this.role);
    const creditType = this.creditForm.get("creditType")?.value;
    const payload = {
      loggedInUserName: userName,
      creditType,
      resellerName:
        this.selectedReseller || (this.role === "reseller" ? userName : ""),
      sellerName:
        this.selectedSeller || (this.role === "seller" ? userName : ""),
      clientName:
        this.selectedClient || (this.role === "client" ? userName : ""),
      adminName: this.selectedAdmin || (this.role === "admin" ? userName : ""),
    };

    this.reportService.totalCredit(payload).subscribe(
      (res) => {
        if (res.result.toLowerCase() === "success" && res.data?.userCredit) {
          const creditData = res.data.userCredit;
          const availableCredit =
            creditType === "TEXT_CREDIT"
              ? creditData.userTextAvailableCredit
              : creditData.userTextAvailableCredit;
          const customerCredit =
            creditType === "RICH_CREDIT"
              ? creditData.loggedInUserTextCredit
              : creditData.loggedInUserTextCredit;

          this.creditForm.patchValue({
            // yourCredit: availableCredit ?? '0',
            customerCredit: customerCredit ?? "0",
          });

            // Show notification only for admin, seller, or reseller
            if (["admin", "seller", "reseller"].includes(this.role)) {
            this.toastService.publishNotification(
              "Success",
              `Available Credit: ${availableCredit}`,
              "Success"
            );
            }
        } else {
          if (["admin", "seller", "reseller"].includes(this.role)){
            this.toastService.publishNotification(
            "Error",
            "Failed to fetch available credit",
            "error"
          );
          }
          
        }
      },
      () => {
        if (["admin", "seller", "reseller"].includes(this.role)){
          this.toastService.publishNotification(
          "Error",
          "Failed to fetch credit",
          "error"
        );
        }
        
      }
    );
  }

  onAdminChange(value: string): void {
    this.selectedAdmin = value;
    this.selectedReseller = "";
    this.selectedSeller = "";
    this.selectedClient = "";
    this.totalCredit();
  }

  onResellerChange(value: string): void {
    this.selectedReseller = value;
    this.selectedAdmin = "";
    this.selectedSeller = "";
    this.selectedClient = "";
    this.totalCredit();
  }

  onSellerChange(value: string): void {
    this.selectedSeller = value;
    this.selectedAdmin = "";
    this.selectedReseller = "";
    this.selectedClient = "";
    this.totalCredit();
  }

  onClientChange(value: string): void {
    this.selectedClient = value;
    this.selectedAdmin = "";
    this.selectedReseller = "";
    this.selectedSeller = "";
    this.totalCredit();
  }

  getAllChildUsers(): void {
    const userData = {
      loggedInUsername: sessionStorage.getItem("USER_NAME"),
      userId: sessionStorage.getItem("USER_ID"),
    };

    this.userCreation.getAllChildForUser(userData).subscribe((res) => {
      this.Adminlist = this.mapUserList(res.data.userAllChildMap.ADMIN);
      this.ResllerList = this.mapUserList(res.data.userAllChildMap.RESELLER);
      this.SellerList = this.mapUserList(res.data.userAllChildMap.SELLER);
      this.Clientlist = this.mapUserList(res.data.userAllChildMap.CLIENT);
    });
  }

  mapUserList(userMap: any): any[] {
    return [userMap].flatMap((obj: any) => {
      return Object.entries(obj).map(([key, value]) => ({
        label: key,
        value: value,
      }));
    });
  }

  ngoninitapicall() {
    const userName = sessionStorage.getItem("USER_NAME");
    if (this.role === "agent") return;
    console.log("role of my " + this.role);
    const creditType = this.creditForm.get("creditType")?.value;

    const payload = {
      loggedInUserName: userName,
      creditType,
      resellerName:
        this.selectedReseller || (this.role === "reseller" ? userName : ""),
      sellerName:
        this.selectedSeller || (this.role === "seller" ? userName : ""),
      clientName:
        this.selectedClient || (this.role === "client" ? userName : ""),
      adminName: this.selectedAdmin || (this.role === "admin" ? userName : ""),
    };

    this.reportService.totalCredit(payload).subscribe(
      (res) => {
        if (res.result.toLowerCase() === "success" && res.data?.userCredit) {
          const creditData = res.data.userCredit;
          const availableCredit =
            creditType === "TEXT_CREDIT"
              ? creditData.userTextAvailableCredit
              : creditData.userTextAvailableCredit;
          const customerCredit =
            creditType === "RICH_CREDIT"
              ? creditData.loggedInUserTextCredit
              : creditData.loggedInUserTextCredit;

          this.creditForm.patchValue({
            yourCredit: availableCredit ?? "0",
            customerCredit: customerCredit ?? "0",
          });

          this.toastService.publishNotification(
            "Success",
            `Available Credit: ${availableCredit}`,
            "Success"
          );
        } else {
          this.toastService.publishNotification(
            "Error",
            "Failed to fetch available credit",
            "error"
          );
        }
      },
      () => {
        this.toastService.publishNotification(
          "Error",
          "Failed to fetch credit",
          "error"
        );
      }
    );
  }

  onTabChange(event: any) {
    // Clear role selections
    this.selectedAdmin = null;
    this.selectedReseller = null;
    this.selectedSeller = null;
    this.selectedClient = null;
    this.userHistory = [];

    // Get the selected tab

    // Reset form properly
    this.creditForm.reset();

    // If you need to reset other forms or data, do it here too
    // this.operatorForm.reset();
    // this.operatorData.clear();

    if (event.index === 2) {
      // Optional: handle third tab separately
    }
  }

  totalCredit(): void {
    const userName = sessionStorage.getItem("USER_NAME") || "";
    const role = sessionStorage.getItem("ROLE") || "";
    const creditType = this.creditForm.get("creditType")?.value;
    const payload: any = {
      loggedInUserName: userName,
      creditType,
    };

    if (this.selectedReseller) {
      payload.resellerName = this.selectedReseller;
    } else if (this.selectedSeller) {
      payload.sellerName = this.selectedSeller;
    } else if (this.selectedClient) {
      payload.clientName = this.selectedClient;
    } else if (this.selectedAdmin) {
      payload.adminName = this.selectedAdmin;
    } else {
      // No selections made, set based on role
      if (role === "reseller") {
        payload.resellerName = userName;
      } else if (role === "seller") {
        payload.sellerName = userName;
      } else if (role === "client") {
        payload.clientName = userName;
      } else if (role === "admin") {
        payload.adminName = userName;
      }
    }

    console.log("API Payload:", JSON.stringify(payload, null, 2));

    this.reportService.totalCredit(payload).subscribe(
      (res) => {
        if (res.result.toLowerCase() === "success" && res.data?.userCredit) {
          const creditData = res.data.userCredit;
          const availableCredit =
            creditType === "TEXT_CREDIT"
              ? creditData.userTextAvailableCredit
              : creditData.userRichAvailableCredit;

          const customerCredit =
            creditType === "TEXT_CREDIT"
              ? creditData.loggedInUserTextCredit
              : creditData.loggedInUserRichCredit;

          const patchValues: any = {
            customerCredit: customerCredit ?? "0",
          };

          // ✅ Only patch 'yourCredit' if a dropdown was selected
          if (
            this.selectedAdmin ||
            this.selectedReseller ||
            this.selectedSeller ||
            this.selectedClient
          ) {
            patchValues.yourCredit = availableCredit ?? "0";
          }

          this.creditForm.patchValue(patchValues);

          this.toastService.publishNotification(
            "Success",
            `Available Credit: ${availableCredit}`,
            "Success"
          );
        } else {
          // Handle unsuccessful result
          const apiMessage = res?.message;

          this.toastService.publishNotification("Error", apiMessage, "error");
        }
      },
      (error: any) => {
        console.error("API Error:", error);
        this.toastService.publishNotification(
          "Error",
          "Failed to fetch credit",
          "error"
        );
      }
    );
  }

  addCredit(): void {
    const formData = this.creditForm.value;

    const requestData = {
      remarks: formData.remark,
      creditToBeAdded: formData.addCredits,
      loggedInUserName: sessionStorage.getItem("USER_NAME"),
      creditType: formData.creditType,
      operation: "addCredit",
      resellerName: this.selectedReseller,
      sellerName: this.selectedSeller,
      clientName: this.selectedClient,
      adminName: this.selectedAdmin,
    };

    this.reportService.updateCreditForUser(requestData).subscribe(
      (res) => {
        if (res.result.toLowerCase() === "success") {
          this.toastService.publishNotification(
            "Success",
            res.message,
            "Success"
          );
          this.creditForm.reset();
          this.selectedReseller = "";
          this.selectedSeller = "";
          this.selectedClient = "";
          this.selectedAdmin = "";
          this.resetForm();
        } else {
          this.toastService.publishNotification("Error", res.message, "error");
        }
      },
      () => {
        this.toastService.publishNotification(
          "Error",
          "Internal Server Error. Please try again later",
          "error"
        );
      }
    );
  }

  search() {
    let adminName = this.selectedReseller?this.selectedReseller: "";
    let clientName = this.selectedClient? this.selectedClient: "";
    let resellerName = this.selectedReseller? this.selectedReseller: "";
    let sellerName = this.selectedSeller? this.selectedSeller: "";

    // Determine label names for UI, fallback to ID for API
    // if (this.role === "admin" && this.Admin && this.Adminlist?.length) {
    //   const admin = this.Adminlist.find((x) => x.value === this.Admin);
    //   adminName = admin?.label || "";
    // }

    // if (this.role === "client" && this.Client && this.Clientlist?.length) {
    //   const client = this.Clientlist.find((x) => x.value === this.Client);
    //   clientName = client?.label || "";
    // }

    // if (this.role === "reseller" && this.Reseller && this.ResllerList?.length) {
    //   const reseller = this.ResllerList.find((x) => x.value === this.Reseller);
    //   resellerName = reseller?.label || "";
    // }

    // if (this.role === "seller" && this.Seller && this.SellerList?.length) {
    //   const seller = this.SellerList.find((x) => x.value === this.Seller);
    //   sellerName = seller?.label || "";
    // }

    const requestData: any = {
      loggedInUserName: sessionStorage.getItem("USER_NAME"),
      fromDate: `${format(new Date(this.date[0]), "yyyy-MM-dd")}`,
      toDate: `${format(new Date(this.date[1]), "yyyy-MM-dd")}`,
     adminName,
     sellerName,
     clientName,
      resellerName,
      // pageNumber: this.pageIndex
    };

    // Send IDs to backend
    // if (this.Admin) requestData.adminName = this.Admin;
    // if (this.Client) requestData.clientName = this.Client;
    // if (this.Reseller) requestData.resellerName = this.Reseller;
    // if (this.Seller) requestData.sellerName = this.Seller;
    // if (
    //   this.Admin === null &&
    //   this.Client === null &&
    //   this.Reseller === null &&
    //   this.Seller === null
    // ) {
    //   if (this.role === "client")
    //     requestData.clientName = sessionStorage.getItem("USER_NAME");
    //   if (this.role === "seller")
    //     requestData.sellerName = sessionStorage.getItem("USER_NAME");
    //   if (this.role === "reseller")
    //     requestData.resellerName = sessionStorage.getItem("USER_NAME");
    //   if (this.role === "admin")
    //     requestData.adminName = sessionStorage.getItem("USER_NAME");
    //   if (this.role === "superadmin")
    //     requestData.adminName = sessionStorage.getItem("USER_NAME");
    // }

    console.log("API Request:", requestData);

    this.botService.credithistory(requestData).subscribe(
      (response: any) => {
        console.log("API Response:", response);

        if (
          response?.data?.userHistoryList &&
          Array.isArray(response.data.userHistoryList)
        ) {
          this.userHistory = response.data.userHistoryList;
        } else {
          this.userHistory = [];
        }
      },
      (error) => {
        console.error("API Error:", error);
        this.userHistory = [];
      }
    );
  }

  onChange(type: string) {
    if (type == "reseller") {
      this.Admin = "";
      this.Seller = "";
      this.Client = "";
    } else if (type == "seller") {
      this.Reseller = "";
      this.Client = "";
      this.Admin = "";
    } else if (type == "client") {
      this.Reseller = "";
      this.Seller = "";
      this.Admin = "";
    } else if (type == "admin") {
      this.Reseller = "";
      this.Seller = "";
      this.Client = "";
    }
  }

  onChangeDate() {
    const formattedDate = new Date(this.date[0]).toISOString().split("T")[0];
    const fromDate = this.date[0];
    const toDate = this.date[1];
    this.fromDate = fromDate;
    this.toDate = toDate;
  }

  disableFutureDates = (current: Date): boolean => {
    // Disable dates after today
    return current && current > new Date();
  };

  resetForm(): void {
    // this.creditForm.reset();
    window.location.reload();
  }
}
