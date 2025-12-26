import { Component, OnInit, Renderer2 } from '@angular/core';
import { AuthService } from 'src/app/shared/auth.service';
import { ReportService } from 'src/app/service/report.service';
import { WalletService } from 'src/app/service/wallet.service';
import { ActivatedRoute } from '@angular/router';


interface MenuItem {
  label: string;
  altLabel?: string; // Optional property for alternative label
  group?: string;
  icon: string;
  link: string;
  roles: string[];
  exact?: boolean; // Optional property to specify if the route should match exactly
  enabled?: boolean; // Optional property to enable/disable menu items
}

@Component({
  selector: "app-main-layout",
  templateUrl: "./main-layout.component.html",
  styleUrls: ["./main-layout.component.scss"],
})
export class MainLayoutComponent implements OnInit {
  availableRichCredit: number = 0; // Variable to store available rich credit
  availableTextCredit: number = 0;
  availableTextBlockCredit: number = 0;
  availableRichBlockCredit: number = 0;
userAvailableBalance: number = 0;
  routeLink: string = "";
  isCollapsed = false;
  data: any;
  availableWalletbalance: number = 0;
  isUpcomingFeatureVisible = false;
  themeColor: string = "#F44336";
  // themeColor: string = '#F44336';
  role: string = sessionStorage.getItem("ROLE") || "";
  // logoUrl: string = sessionStorage.getItem('logoUrl')?.trim() || 'assets/images/nopictures.png';
  lastLoginIp: string = sessionStorage.getItem('lastLoginIp')?.trim() || '';
  lastLoginTime: string = sessionStorage.getItem('lastLoginTime')?.trim() || '';
  logoUrl: string = "";
  userName: string | null;
  hex = sessionStorage.getItem("themecolor");
  
  menuItems: MenuItem[] = [
    {
      label: "Dashboard",
      icon: "appstore",
      link: "/dashboard",
      roles: ["admin", "seller", "reseller", "client", "superadmin","accountManager"],
      group: "dashboard",
    },

    {
      label: "User Management",
      icon: "user-add",
      link: "/userCreation/ ",
      roles: ["superadmin", "admin", "seller", "reseller"],
      exact:false,
      group: "userCreation",
    },
    {
      label: "Logo Upload",
      icon: "file-image",
      link: "/uploadlogo",
      roles: ["superadmin", "admin", "seller", "reseller"],
      group:'uploadlogo'
    },
    {
      label: "Brand Management",
      icon: "cloud-upload",
      link: "Brand",
      roles: ["admin", "seller", "reseller"],
      exact:false,
      group: "brand",
    },
    {
      label: "Bot Management",
      icon: "robot",
      link: "/createbot",
      roles: ["admin", "seller", "reseller", "client"],
      exact:false,
      group: "bot",
    },

    {
      label: "Template Management",
      icon: "cloud-upload",
      link: "/template",
      roles: ["client"],
      exact:false,
      group: "template",
    },
    {
      label: "Template Approval",
      icon: "cloud-upload",
      link: "/template-approval",
      roles: ["admin", "seller", "reseller"],
      exact:false,
      group:"template-approval"
    },
    {
      label: "Report",
      icon: "pie-chart",
      link: "/detailed-report",
      roles: ["admin", "seller", "reseller", "client"],
      exact:false,
      group:'detailed-report'
    },

    // { label: "Chatbot", icon: "robot", link: "/drawflow", roles: ["client"], exact:false , group:'drawflow'},
{
    label: "Campaign",
    icon: "notification",
    link: "/quick-campaign",
    roles: ["client"],
    exact: false,
    group: 'campaign'
  },
  {
    label: "Campaign Report",
    icon: "notification",
    link: "/quick-campaign",
    roles: [ "admin", "seller", "reseller", "superadmin"],
    exact: false,
    group: 'campaign'
  },
    {
      label: "Campaign File Manager",
      icon: "file",
      link: "upload-campaign",
      roles: ["client"],
      exact:false,
      group:'uploadFile'
    },
    {
      label: "Capability Tester",
      icon: "check-circle",
      link: "/capablityTest",
      roles: ["admin", "client"],
      exact:false,
      group:'capablityTest'
    },
    {
      label: "Generate Api Key",
      icon: "api",
      link: "/generate-api",
      roles: ["superadmin", "admin", "seller", "reseller"],
      exact:false,
      group:'generate-api'
  },

    // {
    //   label: "Domain Manager",
    //   icon: "global",
    //   link: "/domainManagerComponent",
    //   roles: ["client", "admin", "seller", "reseller", "superadmin"],
    //   exact:false,
    //   group:'domain'

    // }, 
       {
      label: "Group Management",
      icon: "group",
      link: "/phonebook",
      roles: ["client"],
      exact:false,
      group:'domain'

    },

     {
      label: "BLack List",
      icon: "group",
      link: "/blacklist",
      roles: ["client"],
      exact:false,
      group:'black'

    },
     {
      label: "Account Manager",
      icon: "mac-command",
      link: "/account-manager",
      roles: ["admin"],
      exact:false,
      group:'black'

    },


    {
      label: "Billing Plan",
      icon: "account-book",
      link: "/billingPlain",
      roles: ["superadmin", "admin", "seller", "reseller"],
      exact:false,
      group:'billing'

    },
    {
      label: "Wallet",
      icon: "wallet",
      link: "/wallet",
      roles: ["superadmin", "admin", "seller", "reseller"],
      exact:false,
      group:'wallet'
    },
    {
      label: "Credit Management",
      icon: "credit-card",
      link: "/creditmange",
      roles: ["superadmin", "admin", "seller", "reseller"],
      exact:false,
      group:'creditmange'
    },
    

    // 🔒 Disabled / Previously Commented
    {
      label: "Short Link Management",
      icon: "cloud-upload",
      link: "/short-link-management",
      roles: ["admin"],
      enabled: false,
    },
    {
      label: "Team Management",
      icon: "cloud-upload",
      link: "/team-management",
      roles: ["admin"],
      enabled: false,
    },
    {
      label: "Segment's",
      icon: "cloud-upload",
      link: "/segment",
      roles: ["admin"],
      enabled: false,
    },
    {
      label: "Operator Management",
      icon: "cloud-upload",
      link: "/tps",
      roles: ["admin"],
      enabled: true,
    },
  ];

  constructor(
    private authService: AuthService,
    private renderer: Renderer2,
    private reportService: ReportService,
    private walletService: WalletService,
    private route: ActivatedRoute
  ) {
    
    this.themeColor = sessionStorage.getItem("themecolor") || "";
    // console.log("xoxoxoxoxoxoxxoxoxoxoxxoxoxoxoxoxoxoxox"+this.themeColor);

    this.userName = sessionStorage.getItem("USER_NAME");
    // console.log(this.userName)
  }

  ngOnInit(): void {
    this.totalRichcredit();
    this.totalTextcredit();
    this.AvailableBalance();
    this.blockTextcredit();
    this.blockRichcredit();
    

    this.role = sessionStorage.getItem("ROLE") || "";
    const billingType = sessionStorage.getItem("billingType");

    // Add "Credit History" menu item for client with prepaid billing type
    if (this.role === "client" && billingType === "Prepaid") {
      this.menuItems.push({
      label: "Credit History",
      icon: "credit-card",
      link: "/creditmange",
      roles: ["client"],
      exact: false,
      group: "creditmange"
      });
    }
    this.routeLink =  this.route.snapshot.data['link'];
    const storedLogo = sessionStorage.getItem("logoUrl");
    //console.log('Stored logo URL:', storedLogo); // Debugging log

    if (storedLogo && storedLogo.trim()) {
      this.logoUrl = storedLogo;
    }

    //console.log('Final logo URL:', this.logoUrl); // Debugging log

    this.themeColor = sessionStorage.getItem("themeColor") || this.themeColor;
    document.documentElement.style.setProperty(
      "--theme-color",
      this.themeColor
    );
    document.documentElement.style.setProperty(
      "--theme-color-rbga",
      sessionStorage.getItem("theme-rbga") || this.themeColor
    );
  }

  toggleSidebar() {
    this.isCollapsed = !this.isCollapsed;
  }
  logout() {
    //console.log('logout');
    this.authService.logoutUser();
  }
  showUpcomingFeatureModal(): void {
    this.isUpcomingFeatureVisible = true;

    // Automatically close the modal after 3 seconds
    setTimeout(() => {
      this.isUpcomingFeatureVisible = false;
    }, 1000);
  }

  totalRichcredit() {
    const role = sessionStorage.getItem("ROLE");
    const userName = sessionStorage.getItem("USER_NAME");

    if (role === "agent") {
      return;
    }
    const textPayload = {
      loggedInUserName: userName,
      creditType: "rich",
      resellerName: role === "reseller" ? userName : "",
      sellerName: role === "seller" ? userName : "",
      clientName: role === "client" ? userName : "",
      adminName: role === "admin" ? userName : "",
    };

    this.reportService.totalCredit(textPayload).subscribe(
      (res) => {
        // Access the text credit from the correct property
        if (res.result === "Success" && res.data?.userCredit) {
          this.availableRichCredit =
            res.data.userCredit.userRichAvailableCredit;
          //console.log('Available Text Credit:', this.availableRichCredit);
        } else {
          //console.error('Unexpected response structure:', res);
        }
      },
      (error) => {
        console.error("Error fetching text credit:", error);
      }
    );
  }

  totalTextcredit() {
    const role = sessionStorage.getItem("ROLE");
    const userName = sessionStorage.getItem("USER_NAME");

    if (role === "agent") {
      return;
    }
    const textPayload = {
      loggedInUserName: userName,
      creditType: "text",
      resellerName: role === "reseller" ? userName : "",
      sellerName: role === "seller" ? userName : "",
      clientName: role === "client" ? userName : "",
      adminName: role === "admin" ? userName : "",
    };

    this.reportService.totalCredit(textPayload).subscribe(
      (res) => {
        // Access the text credit from the correct property
        if (res.result === "Success" && res.data?.userCredit) {
          this.availableTextCredit =
            res.data.userCredit.userTextAvailableCredit;
          //console.log('Available Text Credit:', this.availableTextCredit);
        } else {
          //console.error('Unexpected response structure:', res);
        }
      },
      (error) => {
        console.error("Error fetching text credit:", error);
      }
    );
  }

  AvailableBalance() {
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
    if (res.result === "Success" && res.data?.responseData?.userAvailableBalance !== undefined) {
      this.userAvailableBalance = res.data.responseData.userAvailableBalance;
    }
      },
  (error) => {
    console.error("Error fetching text credit:", error);
  }

);
  
  }
  getLabel(item: any): string {
  if (!item) return '';
  return this.role === 'client' ? item.label : item.altLabel || item.label;
}


 blockRichcredit() {
    const role = sessionStorage.getItem("ROLE");
    const userName = sessionStorage.getItem("USER_NAME");

    if (role === "agent") {
      return;
    }
    const textPayload = {
      loggedInUserName: userName,
      creditType: "rich_card",
      resellerName: role === "reseller" ? userName : "",
      sellerName: role === "seller" ? userName : "",
      clientName: role === "client" ? userName : "",
      adminName: role === "admin" ? userName : "",
    };

    this.reportService.blockRichCredit(textPayload).subscribe(
      (res) => {
        // Access the text credit from the correct property
        if (res.result === "Success" && res.data?.userCredit) {
          this.availableRichBlockCredit =
            res.data.userCredit.blockedCredit;
          //console.log('Available Text Credit:', this.availableTextCredit);
        } else {
          //console.error('Unexpected response structure:', res);
        }
      },
      (error) => {
        console.error("Error fetching text credit:", error);
      }
    );
  }

 blockTextcredit() {
    const role = sessionStorage.getItem("ROLE");
    const userName = sessionStorage.getItem("USER_NAME");

    if (role === "agent") {
      return;
    }
    const textPayload = {
      loggedInUserName: userName,
      creditType: "text_message",
      resellerName: role === "reseller" ? userName : "",
      sellerName: role === "seller" ? userName : "",
      clientName: role === "client" ? userName : "",
      adminName: role === "admin" ? userName : "",
    };

    this.reportService.blockTextCredit(textPayload).subscribe(
      (res) => {
        // Access the text credit from the correct property
        if (res.result === "Success" && res.data?.userCredit) {
          this.availableTextBlockCredit =
            res.data.userCredit.blockedCredit;
          //console.log('Available Text Credit:', this.availableTextCredit);
        } else {
          //console.error('Unexpected response structure:', res);
        }
      },
      (error) => {
        console.error("Error fetching text credit:", error);
      }
    );
  }

}
