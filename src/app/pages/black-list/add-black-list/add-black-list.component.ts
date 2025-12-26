import { Component, OnInit } from "@angular/core";
import { BlackListServiceService } from "src/app/service/black-list-service.service";
// import { NzMessageService } from 'ng-zorro-antd/message';
import { NzUploadChangeParam, NzUploadFile } from "ng-zorro-antd/upload";
import { ToastService } from "src/app/shared/toast-service.service";

import {
  FormBuilder,
  FormGroup,
  Validators,
  FormArray,
  FormControl,
} from "@angular/forms";
@Component({
  selector: "app-add-black-list",
  templateUrl: "./add-black-list.component.html",
  styleUrls: ["./add-black-list.component.scss"],
})
export class AddBlackListComponent {
  uploadForm!: FormGroup;
  groups: any[] = [];
  loadingGroups: boolean = false;
  groupName: string = "";
  selectedGroupId: any;
  toastShown: boolean = false;
  description: string = "";
  selectedGroupForUpload: string = "";
  selectedGroupForAddContact: string = "";
  contactName: string = "";
  contactNumber: string = "";
  fileList: NzUploadFile[] = [];
  searchContactNumber: string = "";
  searchContactName: string = "";

  groupForm!: FormGroup;
  selectedGroup: any;
  beforeUpload = (file: NzUploadFile): boolean => {
    console.log(file)
    this.fileList = this.fileList.concat(file);
    return false;
  };
  uploadbutton: boolean = false;
  constructor(
    private blackListService: BlackListServiceService,
    private toastService: ToastService,
    private fb: FormBuilder
  ) // private message: NzMessageService
  {
    this.uploadForm = this.fb.group({
      description: [""],
    });

    this.groupForm = this.fb.group({
      addmobileNumber: [
      "",
      [
        Validators.required,
        Validators.pattern(/^(?:\+91|91)?[6-9]\d{9}$/)
      ]
      ],
      Descripton: ["", Validators.required],
    });
  }

  ngOnInit(): void {
    // this.loadGroups();
  }

  // loadGroups(): void {
  //   this.loadingGroups = true;
  //   const loggedInUserName =  sessionStorage.getItem('USER_NAME')
  //   this.blackListService.getAllGroupsList({ loggedInUserName }).subscribe(
  //     (response) => {
  //       this.groups = response.data.groupList;
  //       this.loadingGroups = false;
  //     },
  //     (error) => {
  //       // this.message.error('Failed to load groups');
  //       this.loadingGroups = false;
  //     }
  //   );
  // }

  // addGroup(): void {
  //   if (this.groupName && this.groupDescription) {
  //     this.phonebookService.addGroup({
  //       loggedInUserName :  sessionStorage.getItem('USER_NAME'),
  //       groupName: this.groupName,
  //       groupDescription: this.description
  //     }).subscribe(
  //       (response) => {
  //         // this.message.success('Group added successfully');
  //         this.clearGroupForm();
  //         this.loadGroups();
  //       },
  //       (error) => {
  //         // this.message.error('Failed to add group');
  //       }
  //     );
  //   } else {
  //     // this.message.error('Please fill in all required fields');
  //   }
  // }

  // viewGroup(groupId: string): void {
  //    const loggedInUserName =  sessionStorage.getItem('USER_NAME')
  //   this.blackListService.viewGroup({ loggedInUserName, groupId }).subscribe(
  //     (response) => {
  //       // this.message.info('Group details: ' + JSON.stringify(response));
  //     },
  //     (error) => {
  //       // this.message.error('Failed to view group');
  //     }
  //   );
  // }

  // deleteGroup(groupName: string): void {

  //   this.phonebookService.deleteGroup({
  //   loggedInUserName: sessionStorage.getItem('USER_NAME'),
  //     operation: 'removeGroupFromList',
  //     groupName
  //   }).subscribe(
  //     (response) => {
  //       // this.message.success('Group deleted successfully');
  //       this.loadGroups();
  //     },
  //     (error) => {
  //       // this.message.error('Failed to delete group');
  //     }
  //   );
  // }

  // addNumberToGroup(): void {
  //   if (this.selectedGroupForAddContact && this.contactName && this.contactNumber) {
  //     this.phonebookService.addNumberToGroup({
  //       loggedInUsername: sessionStorage.getItem('USER_NAME'),
  //       operation: 'addContactNumber',
  //       contactNumber: this.contactNumber,
  //       contactName: this.contactName,
  //       groupName: this.selectedGroupForAddContact
  //     }).subscribe(
  //       (response) => {

  //         if(response.result=="Success"){
  //           this.toastService.publishNotification("Success", response.message);
  //                     this.resetContactForm();

  //         }
  //         // this.message.success('Contact added successfully');

  //         else{
  //           this.toastService.publishNotification("Error", response.message, "error");

  //         }
  //       },
  //       (error) => {
  //         // this.message.error('Failed to add contact');
  //       }
  //     );
  //   } else {
  //     // this.message.error('Please fill in all required fields');
  //   }
  // }

  // onFileChange(event: NzUploadChangeParam): void {
  //   const status = event.file.status;

  //   if (status === "done" && this.fileList.length > 0 && !this.toastShown) {
  //     this.toastService.publishNotification(
  //       "Success",
  //       "File uploaded successfully !!!"
  //     );
  //     this.toastShown = true;
  //   }
  // }

 handleUpload(): void {
    console.log('Upload function called');
    if (this.fileList.length === 0) {
      this.toastService.publishNotification(
        'error',
        'Please select a .csv file to upload',
        'error'
      );
      return;
    }

    this.uploadbutton = true;
    const formData = new FormData();
    const file = this.fileList[0].originFileObj as File;
    const username = sessionStorage.getItem('USER_NAME') ?? '';
    const description = this.uploadForm.get('description')?.value || '';

    formData.append("file", file);
    formData.append("userName", username);
    formData.append("fileType", file.type);
    formData.append("description", this.uploadForm.get("description")?.value);

    // formData.append('groupId', this.groups.get('groupName')?.value);

    this.blackListService.uploadNumber(formData).subscribe(
      (response) => {
        console.log(response)
        if (response.result === "Failure") {
          this.uploadbutton = false;
          this.toastService.publishNotification(
            "error",
            response.message,
            "error"
          );
        }
        if (response.result === "Success") {
          this.toastService.publishNotification("success", response.message, "success");
          this.uploadbutton = false;
          this.uploadForm.reset();
          this.fileList = [];
        }
      },
      (error) => {
        this.uploadbutton = false;
        this.toastService.publishNotification(
          "error",
          "Internal Server Error",
          "error"
        );
      }
    );
    // } else {
    //   // this.message.error('Please select a group and upload a file');
    // }
  }
  validateNumberInput(event: KeyboardEvent): void {
    const charCode = event.which ? event.which : event.keyCode;
    // Allow only digits (0-9)
    if (charCode < 48 || charCode > 57) {
      event.preventDefault();
    }
  }

  // searchNumberInGroup(): void {
  //   if (this.selectedGroupForAddContact && this.searchContactNumber && this.searchContactName) {
  //     this.phonebookService.searchNumberInGroup({
  //       loggedInUsername:  sessionStorage.getItem('USER_NAME'),
  //       operation: 'searchContactNumber',
  //       contactNumber: this.searchContactNumber,
  //       contactName: this.searchContactName,
  //       groupName: this.selectedGroupForAddContact
  //     }).subscribe(
  //       (response) => {
  //         // this.message.info('Search result: ' + JSON.stringify(response));
  //       },
  //       (error) => {
  //         // this.message.error('Failed to search contact');
  //       }
  //     );
  //   } else {
  //     // this.message.error('Please fill in all required fields for search');
  //   }
  // }

  // removeNumberFromGroup(contactId: string): void {
  //   this.phonebookService.removeNumberFromGroup({
  //     loggedInUsername:  sessionStorage.getItem('USER_NAME'),
  //     operation: 'removeContactNumber',
  //     contactIdsToRemove: [contactId]
  //   }).subscribe(
  //     (response) => {
  //       // this.message.success('Contact removed successfully');
  //     },
  //     (error) => {
  //       // this.message.error('Failed to remove contact');
  //     }
  //   );
  // }

  // getAllNumbersInGroup(): void {
  //   if (this.selectedGroupForAddContact) {
  //     const groupId = this.groups.find(g => g.groupName === this.selectedGroupForAddContact)?.groupId;
  //     if (groupId) {
  //       this.phonebookService.getAllNumbersInGroup({
  //         loggedInUsername:  sessionStorage.getItem('USER_NAME'),
  //         operation: 'getAllNumbersInTheGroup',
  //         groupId
  //       }).subscribe(
  //         (response) => {
  //           // this.message.info('All contacts: ' + JSON.stringify(response));
  //         },
  //         (error) => {
  //           // this.message.error('Failed to get all contacts');
  //         }
  //       );
  //     } else {
  //       // this.message.error('Group ID not found');
  //     }
  //   } else {
  //     // this.message.error('Please select a group');
  //   }
  // }

  clearGroupForm(): void {
    this.groupName = "";
    this.description = "";
  }

  clearUploadForm(): void {
    this.fileList = [];
    this.selectedGroupForUpload = "";
    this.toastShown = false;
  }

  resetContactForm(): void {
    this.selectedGroupForAddContact = "";
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

    let mobileNumber = this.groupForm.value.addmobileNumber.trim();

    if (!mobileNumber.startsWith("+91")) {
      if (mobileNumber.startsWith("91")) {
      mobileNumber = "+" + mobileNumber;
      } else {
      mobileNumber = "+91" + mobileNumber;
      }
    }

    const dt1 = {
      loggedInUserName: sessionStorage.getItem("USER_NAME"),
      mobileNumber: mobileNumber,
      description: this.groupForm.value.Descripton,
      operation: "addUserBlackListNumber",
    };

    this.blackListService.addGroup(dt1).subscribe({
      next: (response) => {
        console.log("Number added Blacklist:", response);

        if (response.result === "Success") {
          // this.loadGroups();
          //  this.loadList();
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

 
  handleChange(info: NzUploadChangeParam): void {
  if (info.file.status === 'done') {
    // File uploaded successfully
    this.toastService.publishNotification("success", "File selected successfully");
  } else if (info.file.status === 'error') {
    // File upload failed
    this.toastService.publishNotification("error", "File selection failed");
  }
}
  

}
