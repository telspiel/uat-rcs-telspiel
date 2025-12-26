import { Component, EventEmitter, Input, Output } from "@angular/core";
import { UserCreationService } from "src/app/service/user-creation.service";

@Component({
  selector: "app-filter-dropdown",
  templateUrl: "./filter-dropdown.component.html",
  styleUrls: ["./filter-dropdown.component.scss"],
})
export class FilterDropdownComponent {
  @Input() role: string = "";
  @Output() selectionChange = new EventEmitter<any>();
  @Input() span?: any= 8;
  @Input()requierd: boolean = false;
  adminList: any[] = [];
  resellerList: any[] = [];
  sellerList: any[] = [];
  clientList: any[] = [];

  selectedAdmin: any
  selectedReseller: any
  selectedSeller: any
  selectedClient: any
  id=sessionStorage.getItem("USER_ID") || "";

  constructor(private userCreation: UserCreationService) {}

  ngOnInit(): void {
    this.getAllChildUsers(this.id);
  }
  getRoleClass(role: string): string {
  switch (role) {
    case 'admin':
      return 'custom-max-width-admin';
    case 'reseller':
      return 'custom-max-width-reseller';
    case 'seller':
      return 'custom-max-width-seller';
    default:
      return '';
  }
}

  getAllChildUsers(id: string): void {
    const userData = {
      loggedInUsername: sessionStorage.getItem("USER_NAME"),
      userId: id,
    };

    this.userCreation.getAllChildForUser(userData).subscribe((res) => {
      const userMap = res?.data?.userAllChildMap || {};
      this.adminList = this.mapUserList(userMap.ADMIN);
      this.resellerList = this.mapUserList(userMap.RESELLER);
      this.sellerList = this.mapUserList(userMap.SELLER);
      this.clientList = this.mapUserList(userMap.CLIENT);
    });
  }

  mapUserList(userMap: any): any[] {
    return [userMap].flatMap((obj: any) => {
      return Object.entries(obj).map(([key, value]:any) => ({
        label: key,
        value: value.split('#')[0],
      }));
    });
  }

  emitChange(): void {
    this.selectionChange.emit({
      admin: this.selectedAdmin.label,
      reseller: this.selectedReseller.label,
      seller: this.selectedSeller.label,
      client: this.selectedClient.label,
    });
  }
  onClear(): void {
    console.log('Cleared selection, reloading user list...');
    this.getAllChildUsers(this.id);
  }
  onAdminChange(value: any): void {
    this.selectedAdmin = value;
    if(value!==null){this.getAllChildUsers(value.value);}
    if(value===null){this.getAllChildUsers(this.id);}
    this.selectedReseller = "";
    this.selectedSeller = "";
    this.selectedClient = "";
    this.emitChange();
  }

  onResellerChange(value: any): void {
    this.selectedReseller = value;
    if(value!==null){this.getAllChildUsers(value.value);}
    if(value===null){this.getAllChildUsers(this.id);}
    this.selectedAdmin = "";
    this.selectedSeller = "";
    this.selectedClient = "";
    this.emitChange();
  }

  onSellerChange(value: any): void {
    this.selectedSeller = value;
    if(value!==null){this.getAllChildUsers(value.value);}
    if(value===null){this.getAllChildUsers(this.id);}
    this.selectedAdmin = "";
    this.selectedReseller = "";
    this.selectedClient = "";
    this.emitChange();
  }

  onClientChange(value: string): void {
    this.selectedClient = value;
    this.selectedAdmin = "";
    this.getAllChildUsers(this.id)
    this.selectedReseller = "";
    this.selectedSeller = "";
    this.emitChange();
  }
}
