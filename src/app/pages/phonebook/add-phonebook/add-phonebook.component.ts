import { Component, OnInit } from '@angular/core';
import { PhonebookService } from 'src/app/service/phonebook.service';
// import { NzMessageService } from 'ng-zorro-antd/message';
import { NzUploadChangeParam, NzUploadFile } from 'ng-zorro-antd/upload';
import { ToastService } from 'src/app/shared/toast-service.service';

@Component({
  selector: 'app-add-phonebook',
  templateUrl: './add-phonebook.component.html',
  styleUrls: ['./add-phonebook.component.scss']
})
export class AddPhonebookComponent {
groups: any[] = [];
  loadingGroups: boolean = false;
  groupName: string = '';
  selectedGroupId: any;  
  toastShown: boolean = false;
  groupDescription: string = '';
  selectedGroupForUpload: string = '';
  selectedGroupForAddContact: string = '';
  contactName: string = '';
  contactNumber: string = '';
  fileList: NzUploadFile[] = [];
  searchContactNumber: string = '';
  searchContactName: string = '';
selectedGroup: any;

  constructor(
    private phonebookService: PhonebookService,
    private toastService: ToastService,
    // private message: NzMessageService
  ) {}

  ngOnInit(): void {
    this.loadGroups();
  }

  loadGroups(): void {
    this.loadingGroups = true;
    const loggedInUserName =  sessionStorage.getItem('USER_NAME')
    this.phonebookService.getAllGroupsList({ loggedInUserName }).subscribe(
      (response) => {
        this.groups = response.data.groupList;
        this.loadingGroups = false;
      },
      (error) => {
        // this.message.error('Failed to load groups');
        this.loadingGroups = false;
      }
    );
  }

  addGroup(): void {
    if (this.groupName && this.groupDescription) {
      this.phonebookService.addGroup({
        loggedInUserName :  sessionStorage.getItem('USER_NAME'),
        groupName: this.groupName,
        groupDescription: this.groupDescription
      }).subscribe(
        (response) => {
          // this.message.success('Group added successfully');
          this.clearGroupForm();
          this.loadGroups();
        },
        (error) => {
          // this.message.error('Failed to add group');
        }
      );
    } else {
      // this.message.error('Please fill in all required fields');
    }
  }

  viewGroup(groupId: string): void {
     const loggedInUserName =  sessionStorage.getItem('USER_NAME')
    this.phonebookService.viewGroup({ loggedInUserName, groupId }).subscribe(
      (response) => {
        // this.message.info('Group details: ' + JSON.stringify(response));
      },
      (error) => {
        // this.message.error('Failed to view group');
      }
    );
  }

  deleteGroup(groupName: string): void {
  
    this.phonebookService.deleteGroup({
    loggedInUserName: sessionStorage.getItem('USER_NAME'),
      operation: 'removeGroupFromList',
      groupName
    }).subscribe(
      (response) => {
        // this.message.success('Group deleted successfully');
        this.loadGroups();
      },
      (error) => {
        // this.message.error('Failed to delete group');
      }
    );
  }

  addNumberToGroup(): void {
    if (this.selectedGroupForAddContact && this.contactName && this.contactNumber) {
      this.phonebookService.addNumberToGroup({
        loggedInUsername: sessionStorage.getItem('USER_NAME'),
        operation: 'addContactNumber',
        contactNumber: this.contactNumber,
        contactName: this.contactName,
        groupName: this.selectedGroupForAddContact
      }).subscribe(
        (response) => {

          if(response.result=="Success"){
            this.toastService.publishNotification("Success", response.message);
                      this.resetContactForm();


          }
          // this.message.success('Contact added successfully');

          else{
            this.toastService.publishNotification("Error", response.message, "error");

          }
        },
        (error) => {
          // this.message.error('Failed to add contact');
        }
      );
    } else {
      // this.message.error('Please fill in all required fields');
    }
  }

onFileChange(event: NzUploadChangeParam): void {
  const status = event.file.status;

  if (status === 'done' && this.fileList.length > 0 && !this.toastShown) {
    this.toastService.publishNotification('Success', 'File uploaded successfully !!!');
    this.toastShown = true;
  }
}




  handleUpload(groupid: any): void {

    
    console.log("clickrd");


    const formData = new FormData();
    console.log(this.fileList);

    const username = sessionStorage.getItem('USER_NAME') ?? '';

    const file = this.fileList[0].originFileObj as File;
    

    console.log(file);
    formData.append('file', file);
    formData.append('userName',username);
    formData.append('fileType', file.type);
    formData.append('fileName', file.name);
    formData.append('groupId',groupid );


    // formData.append('groupId', this.groups.get('groupName')?.value);  



      this.phonebookService.uploadNumberInUserGroup(formData).subscribe(
        (response) => {

          if(response.result="Success"){
         this.toastService.publishNotification('Success',  response.message);
          this.clearUploadForm();
          }
          else{
            this.toastService.publishNotification('Error',  response.message);
          }
        },
        (error) => {
          // this.message.error('Failed to upload contacts');
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


  searchNumberInGroup(): void {
    if (this.selectedGroupForAddContact && this.searchContactNumber && this.searchContactName) {
      this.phonebookService.searchNumberInGroup({
        loggedInUsername:  sessionStorage.getItem('USER_NAME'),
        operation: 'searchContactNumber',
        contactNumber: this.searchContactNumber,
        contactName: this.searchContactName,
        groupName: this.selectedGroupForAddContact
      }).subscribe(
        (response) => {
          // this.message.info('Search result: ' + JSON.stringify(response));
        },
        (error) => {
          // this.message.error('Failed to search contact');
        }
      );
    } else {
      // this.message.error('Please fill in all required fields for search');
    }
  }

  removeNumberFromGroup(contactId: string): void {
    this.phonebookService.removeNumberFromGroup({
      loggedInUsername:  sessionStorage.getItem('USER_NAME'),
      operation: 'removeContactNumber',
      contactIdsToRemove: [contactId]
    }).subscribe(
      (response) => {
        // this.message.success('Contact removed successfully');
      },
      (error) => {
        // this.message.error('Failed to remove contact');
      }
    );
  }

  getAllNumbersInGroup(): void {
    if (this.selectedGroupForAddContact) {
      const groupId = this.groups.find(g => g.groupName === this.selectedGroupForAddContact)?.groupId;
      if (groupId) {
        this.phonebookService.getAllNumbersInGroup({
          loggedInUsername:  sessionStorage.getItem('USER_NAME'),
          operation: 'getAllNumbersInTheGroup',
          groupId
        }).subscribe(
          (response) => {
            // this.message.info('All contacts: ' + JSON.stringify(response));
          },
          (error) => {
            // this.message.error('Failed to get all contacts');
          }
        );
      } else {
        // this.message.error('Group ID not found');
      }
    } else {
      // this.message.error('Please select a group');
    }
  }

  clearGroupForm(): void {
    this.groupName = '';
    this.groupDescription = '';
  }

  clearUploadForm(): void {
    this.fileList = [];
    this.selectedGroupForUpload = '';
      this.toastShown = false;
  }

  resetContactForm(): void {
    this.selectedGroupForAddContact = '';
    this.contactName = '';
    this.contactNumber = '';
  }
}