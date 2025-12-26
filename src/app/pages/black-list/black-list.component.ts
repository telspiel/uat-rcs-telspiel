import { Component, OnInit, ViewChild } from "@angular/core";
// import { PhonebookService } from 'src/app/service/phonebook.service';

import { BlackListServiceService } from "src/app/service/black-list-service.service";
// import { NzMessageService } from 'ng-zorro-antd/message';
import { NzUploadFile } from "ng-zorro-antd/upload";

import {
  FormBuilder,
  FormGroup,
  Validators,
  FormArray,
  FormControl,
} from "@angular/forms";
import { ToastService } from "src/app/shared/toast-service.service";
import { TemplateMessageService } from "src/app/service/template-message.service";
import { TemplateService } from "src/app/service/template-service.service";
import {
  SEND_TEMPLATE_MODEL,
  TEMPLATES,
  TEMPLATE_RESPONSE,
} from "src/app/models/templateModel";
import { NzCarouselComponent } from "ng-zorro-antd/carousel";
import { ReportService } from "src/app/service/report.service";
import { BrandService } from "src/app/service/brand.service";
import { BotServiceService } from "src/app/service/bot-service.service";
import { debounceTime, distinctUntilChanged } from "rxjs";

import { BASE_URL } from "src/app/config/app-config";

@Component({
  selector: "app-black-list",
  templateUrl: "./black-list.component.html",
  styleUrls: ["./black-list.component.scss"],
})
export class BlackListComponent {
  groupName: string = "";
  groupDescription: string = "";
  groups: any[] = [];

  searchNumber: any = "";
  loadingGroups: boolean = false;
  selectedGroup: string = "";
  contactName: string = "";
  contactNumber: string = "";
  fileList: NzUploadFile[] = [];

  addgroupName: string = "";

  Descripton: string = "";

  groupForm!: FormGroup;

  @ViewChild("carouselRef", { static: false }) carousel!: NzCarouselComponent;
  cards: { id: number; previewUrl: string | null }[] = [];
  botid = "";
  custom = false;
  currentStep: number = 1;
  messageTemplates: any = [];
  bot: any;
  botId: any;
  botName: any;
  setOfCheckedId = new Set<number>();
  botStatus: any;
  testDevices: any[] = [];
  code = "+91";
  isVisible = false;
  phNumber = "";
  customParams: any;
  listOfCurrentPageData : any = [];
  mobileNumber = "";
  err = "";
  status = "";
  isTestTemplate = false;
  templatename = "";
  addPage: boolean = true;
  ViewPage: boolean = false;
  imageHeight = 120;
  orientation = "vertical";
  selectedCardIndex: number | null = null;
  templateType: string = "";
  displayName = "";
  templateForm!: FormGroup;
  loggedInUserName: string = "";
  role: string = sessionStorage.getItem("ROLE") || "";
  cardTitle: string = "";
  carouselList: {
    id: number;
    cardTitle: string;
    cardDescription: string;
    fileName: string | null;
  }[] = [
    {
      id: 0,
      cardTitle: "",
      cardDescription: "",
      fileName: "",
    },
  ];
  carouseldetails: { cardTitle: string }[] = [];
  form!: FormGroup;
  // suggestions: FormArray = this.fb.array([]);
  type: string = "";
  text: string = "";
  postback: string = "";
  // isFallbackEnabled: boolean = false;
  messageBody: boolean = true;
  TextMessage: boolean = true;
  fallbackSmsContent: string = "";
  carddescription: string = "";
  Suggestiontext: string = "";
  messagecontent: string = "";
  previewUrl: string | null = null;
  uploadedFileSize: string | null = null;
  uploadedFileUrl: string | null = null;
  newbot: any;
  edit: boolean = false;
  filteredData: any[] = [];
  searchControl = new FormControl("");
  logedinuser = sessionStorage.getItem("USER_NAME");
  numberList: any[] = [];
  
  searchControlNew = new FormControl("");
  checked = false;
  indeterminate = false;
  templateTable: { data: any[] } = { data: [] };

  shortByTemplateName = (a: any, b: any) =>
    a.templateTitle.localeCompare(b.templateTitle);
  sortByDate = (a: any, b: any) => {
    return (
      new Date(this.convertDate(a.createadDate)).getTime() -
      new Date(this.convertDate(b.createadDate)).getTime()
    );
  };
listOfSelection=[];
data: any;


// onAllChecked($event){

// }

  convertDate(inputDate: string): string {
    const months: { [key: string]: number } = {
      Jan: 0,
      Feb: 1,
      Mar: 2,
      Apr: 3,
      May: 4,
      Jun: 5,
      Jul: 6,
      Aug: 7,
      Sep: 8,
      Oct: 9,
      Nov: 10,
      Dec: 11,
    };

    // Split the input string
    const parts = inputDate.split(" ");

    const day = parts[2]; // Day
    const month = months[parts[1]]; // Convert month name to number
    const year = parts[5]; // Year
    const timeParts = parts[3].split(":"); // Split time into hours, minutes, seconds

    // Create a Date object without relying on the incorrect timezone
    const dateObj = new Date(
      Number(year),
      month,
      Number(day),
      Number(timeParts[0]),
      Number(timeParts[1]),
      Number(timeParts[2])
    );

    // Format the date as dd-mm-yyyy hh:mm:ss
    const formattedDay = String(dateObj.getDate()).padStart(2, "0");
    const formattedMonth = String(dateObj.getMonth() + 1).padStart(2, "0"); // Months are 0-based
    const formattedYear = dateObj.getFullYear();

    const hours = String(dateObj.getHours()).padStart(2, "0");
    const minutes = String(dateObj.getMinutes()).padStart(2, "0");
    const seconds = String(dateObj.getSeconds()).padStart(2, "0");

    return `${formattedDay}-${formattedMonth}-${formattedYear} ${hours}:${minutes}:${seconds}`;
  }
  getTemplate(temp: any) {
    this.template.setTemplate(temp);
  }
  prevSlide(): void {
    this.carousel.pre();
  }

  nextSlide(): void {
    this.carousel.next();
  }
  // getTemplates(botid:any){
  //   this.messageTemplates =[]
  //   this.filteredData=[]
  //   let dt = {
  //     "loggedInUserName":sessionStorage.getItem('USER_NAME'),
  //     "botId":botid
  //  }
  //  this.reportService.templatelist(dt).subscribe((res: any) => {
  //    if (res.data && res.data.templateList) {
  //      this.messageTemplates = res.data.templateList;
  //      this.filteredData =[...this.messageTemplates];
  //    } else {
  //      this.messageTemplates = [];
  //    }
  //  });
  // }

  applyFilter(searchTerm: string) {
    if (!searchTerm) {
      this.filteredData = [...this.messageTemplates];
      return;
    }

    const lowerCaseTerm = searchTerm.toLowerCase();

    this.filteredData = this.messageTemplates.filter((item: any) =>
      Object.values(item).some((value: any) =>
        value?.toString().toLowerCase().includes(lowerCaseTerm)
      )
    );
  }
  deleteCard(index: number) {
    this.cards.splice(index, 1);
    this.carouselList.splice(index, 1);
  }

  constructor(
    private blackListService: BlackListServiceService,

    private fb: FormBuilder,
    private toastService: ToastService,
    private templateService: TemplateService,
    private botService: BotServiceService,
    private reportService: ReportService,
    private template: TemplateMessageService
  ) {
    this.groupForm = this.fb.group({
      searchNumber: ["", Validators.required],
    });
  }

  ngOnInit(): void {
    this.loadList();

    this.searchControlNew.valueChanges
      .pipe(debounceTime(300), distinctUntilChanged())
      .subscribe((value: any) => this.applyFilter1(value));
  }

  applyFilter1(searchTerm: string) {
    if (!searchTerm) {
      this.filteredData = [...this.numberList];
      return;
    }

    const lowerCaseTerm = searchTerm.toLowerCase();

    this.filteredData = this.numberList.filter((item: any) =>
      item.userBlackListNumber?.toLowerCase().includes(lowerCaseTerm)
    );
  }

  loadList() {
    let data = {
      loggedInUserName: sessionStorage.getItem("USER_NAME"),
      operation: "getAllBlackListNumbersForUser",
    };

    this.blackListService.viewNumber(data).subscribe((res: any) => {
      if (res.result === "Success") {
        this.numberList = res.data.userBlackListNumberList;
      } else {
        this.toastService.publishNotification("error", "Failed to add group");
      }
    });
  }

  searchNumbers() {

     if (this.groupForm.invalid) {
      this.groupForm.markAllAsTouched();
      
      this.toastService.publishNotification(
        "error",
        "Please fill all required fields correctly.",
        "error"
      );
      return;
    }
    let data = {
      loggedInUserName: sessionStorage.getItem("USER_NAME"),
      operation: "searchUserBlackListNumber",
      mobileNumber: this.groupForm.value.searchNumber,
    };

    this.blackListService.Search(data).subscribe(
      (res: any) => {
        const result = (res.result || "").toLowerCase().trim();

        if (
          result === "success" &&
          res.data?.userBlackListNumberList?.length > 0
        ) {
          this.numberList = res.data.userBlackListNumberList;
          this.toastService.publishNotification(
            "Success",
            res.message,
            "success"
          );
        } else {
          this.numberList = [];
          this.toastService.publishNotification(
            "error",
            res.message,
            "error"
          );
        }
      },
      (error) => {
        this.toastService.publishNotification("error", "API error occurred","error");
      }
    );
  }

  // loadGroups(): void {
  //   this.loadingGroups = true;
  //   this. blackListService.getAllGroupsList({ loggedInUserName: sessionStorage.getItem('USER_NAME'), }).subscribe(
  //     (response) => {
  //       this.groups = response.data.groupList;
  //       this.loadingGroups = false;
  //     },
  //     (error) => {

  //       this.loadingGroups = false;
  //     }
  //   );

  addNumberToGroup(): void {
    if (this.selectedGroup && this.contactName && this.contactNumber) {
      this.blackListService
        .addNumberToGroup({
          loggedInUsername: sessionStorage.getItem("USER_NAME"),
          operation: "addContactNumber",
          contactNumber: this.contactNumber,
          contactName: this.contactName,
          groupName: this.selectedGroup,
        })
        .subscribe(
          (response) => {
            // this.message.success('Contact added successfully');
            this.resetContactForm();
          },
          (error) => {
            // this.message.error('Failed to add contact');
          }
        );
    }
  }

  clearGroupForm(): void {
    this.groupName = "";
    this.groupDescription = "";
  }

  clearUploadForm(): void {
    this.fileList = [];
    this.selectedGroup = "";
  }

  resetContactForm(): void {
    this.selectedGroup = "";
    this.contactName = "";
    this.contactNumber = "";
  }

  onSumbit() {
    if (this.groupForm.invalid) {
      this.groupForm.markAllAsTouched();
      this.toastService.publishNotification(
        "error",
        "Please fill all required fields correctly.",
        "error"
      );
      return;
    }

    const dt1 = {
      loggedInUserName: sessionStorage.getItem("USER_NAME"),
      mobileNumber: this.groupForm.value.addmobileNumber,
      description: this.groupForm.value.Descripton,
      operation: "addUserBlackListNumber",
    };

    this.blackListService.addGroup(dt1).subscribe({
      next: (response) => {
        console.log("Number added Blacklist:", response);

        if (response.result === "Success") {
          // this.loadGroups();
          this.loadList();
          this.toastService.publishNotification(
            "success",
            response.message || "Number added successfully"
          );
          this.groupForm.reset();
        } else {
          this.toastService.publishNotification(
            "error",
            response.message || "Failed to add number"
          );
        }
      },
      error: (err) => {
        console.error("API Error:", err);
        this.toastService.publishNotification(
          "error",
          "Something went wrong. Please try again later."
        );
      },
    });
  }

  cancelGroup() {}

  removeGroup(number: any) {
    const payload = {
      loggedInUserName: sessionStorage.getItem("USER_NAME"),
      operation: "removeUserBlackListNumber",
      numberToBeRemoved: [number],
    };
    this.blackListService.deleteNumber(payload).subscribe((response) => {
      if (response.result == "Success") {
        this.toastService.publishNotification("success", response.message);
        // this.loadGroups();
        this.loadList();
      } else {
        this.toastService.publishNotification("Error", response.message);
      }
    });
  }

  

  downloadCSV(): void {
    const loggedInUserName = sessionStorage.getItem("USER_NAME");
    const token = sessionStorage.getItem("TOKEN");

    // Validate token
    if (!token) {
      console.error("No authentication token found in sessionStorage");
      return;
    }

    // Format dates to YYYY-MM-DD

    // Construct URL with encoded parameters
    const url = `${BASE_URL}/rcs-reseller-service/userBlackListService/downloadAllBlacklistNumbersForUser?loggedInUserName=${loggedInUserName}&operation=getAllBlackListNumbersForUser`;

    fetch(url, {
      method: "GET",
      headers: {
        Accept: "text/csv",
        Authorization: `${token}`,
      },
    })
      .then((response) => {
        // Log headers using forEach (TypeScript-safe)
        console.log("Response Headers:");
        response.headers.forEach((value, key) => {
          console.log(`${key}: ${value}`);
        });

        // Log status and check if response is OK
        console.log("Response Status:", response.status, response.statusText);
        if (!response.ok) {
          throw new Error(`HTTP error! Status: ${response.status}`);
        }

        // Get the filename from Content-Disposition header, if available
        let filename = "Blacklistnumber.csv";
        const disposition = response.headers.get("Content-Disposition");
        if (disposition && disposition.includes("attachment")) {
          const matches = disposition.match(/filename="([^"]+)"/);
          if (matches && matches[1]) {
            filename = matches[1];
          }
        }

        // Return the response body as a blob and the filename
        return response.blob().then((blob) => ({ blob, filename }));
      })
      .then(({ blob, filename }) => {
        console.log("Response Blob:", blob);
        const blobUrl = window.URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.href = blobUrl;
        a.download = filename;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        window.URL.revokeObjectURL(blobUrl);
      })
      .catch((error) => {
        console.error("Error downloading CSV:", error);
      });
  }

//   onCurrentPageDataChange($event: any[]): void {
//   this.listOfCurrentPageData = $event;
//   this.refreshCheckedStatus();
// }

updateCheckedSet(id: number, checked: boolean): void {
  if (checked) {
    this.setOfCheckedId.add(id);
  } else {
    this.setOfCheckedId.delete(id);
  }
}

 removeGroup1(numbersToRemove: any[]) {
    const payload = {
      loggedInUserName: sessionStorage.getItem("USER_NAME"),
      operation: "removeUserBlackListNumber",
      numberToBeRemoved: numbersToRemove,
    };
    this.blackListService.deleteNumber(payload).subscribe((response) => {
      if (response.result == "Success") {
        this.toastService.publishNotification("success", response.message);
        // this.loadGroups();
          this.setOfCheckedId.clear();
          this.refreshCheckedStatus();
          this.loadList();
      } else {
        this.toastService.publishNotification("Error", response.message);
      }
    });
  }

onItemChecked(id: number, checked: boolean): void {
  this.updateCheckedSet(id, checked);
  this.refreshCheckedStatus();
}

onAllChecked(checked: boolean): void {
  this.listOfCurrentPageData.forEach((item :any) =>
    this.updateCheckedSet(item.userBlackListNumber, checked)
  );
  this.refreshCheckedStatus();
}

refreshCheckedStatus(): void {
  const total = this.templateTable.data.length;
  const selected = this.templateTable.data.filter((item: any) =>
    this.setOfCheckedId.has(item.userBlackListNumber)
  ).length;
  this.checked = selected === total;
  this.indeterminate = selected > 0 && selected < total;
}

listOfSelections = [
    {
      text: 'Select All Row',
      onSelect: () => {
        this.onAllChecked(true);
      }
    },
]

deleteSelectedGroups(): void {
  const selectedIds: any[] = Array.from(this.setOfCheckedId);
  if (selectedIds.length === 0) {
    this.toastService.publishNotification("warning", "No numbers selected.");
    return;
  }

  this.removeGroup1(selectedIds); // <-- passing selectedIds correctly
}



onCurrentPageDataChange($event: readonly any[]): void {
  this.listOfCurrentPageData = [...$event];  // Use spread to create a mutable copy
  this.refreshCheckedStatus();
}


}
