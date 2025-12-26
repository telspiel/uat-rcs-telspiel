import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, FormArray, FormControl } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { PhonebookService } from 'src/app/service/phonebook.service';
import { ToastService } from 'src/app/shared/toast-service.service';

@Component({
  selector: 'app-viewphonebook',
  templateUrl: './viewphonebook.component.html',
  styleUrls: ['./viewphonebook.component.scss']
})
export class ViewphonebookComponent {
  groupForm!: FormGroup;
      filteredData: any[]= []
        groups: any[] = [];
  constructor(
      private fb: FormBuilder, 
      private route: ActivatedRoute,
      private phonebook: PhonebookService,
      private toaster: ToastService,
  ){
  this.groupForm = this.fb.group({
    contactNumber: [''],
    contactName: [''],
    groupName: ['']
  });
  
  }

 ngOnInit(): void {
    this.table();
  }



  table(){
     this.route.queryParams.subscribe((params: { [key: string]: any }) => {
      const groupId = params['groupId'];
      console.log('Query param groupId:', groupId);
      let data = {
         loggedInUsername: sessionStorage.getItem('USER_NAME'),
         operation: "getAllNumbersInTheGroup",
         groupId: groupId
      }

      this.phonebook.getAllNumbersInGroup(data).subscribe((res: any) => {
           if (res.result === 'Success') {
            this.groups = res.data.phonebookList;
    }
         
        },
        (error) => {
          // this.message.error('Failed to add contact');
        }
      );
    })
  }

    shortByTemplateName=(a: any, b: any) => a.templateTitle.localeCompare(b.templateTitle);
    sortByDate = (a: any, b: any) => {
      return new Date(this.convertDate(a.createadDate)).getTime() - new Date(this.convertDate(b.createadDate)).getTime();
    }
      convertDate(inputDate: string): string {
      
      const months: { [key: string]: number } = {
        Jan: 0, Feb: 1, Mar: 2, Apr: 3, May: 4, Jun: 5,
        Jul: 6, Aug: 7, Sep: 8, Oct: 9, Nov: 10, Dec: 11
      };
    
      // Split the input string
      const parts = inputDate.split(' ');
      
      const day = parts[2]; // Day
      const month = months[parts[1]]; // Convert month name to number
      const year = parts[5]; // Year
      const timeParts = parts[3].split(':'); // Split time into hours, minutes, seconds
    
      // Create a Date object without relying on the incorrect timezone
      const dateObj = new Date(Number(year), month, Number(day), Number(timeParts[0]), Number(timeParts[1]), Number(timeParts[2]));
    
      // Format the date as dd-mm-yyyy hh:mm:ss
      const formattedDay = String(dateObj.getDate()).padStart(2, '0');
      const formattedMonth = String(dateObj.getMonth() + 1).padStart(2, '0'); // Months are 0-based
      const formattedYear = dateObj.getFullYear();
    
      const hours = String(dateObj.getHours()).padStart(2, '0');
      const minutes = String(dateObj.getMinutes()).padStart(2, '0');
      const seconds = String(dateObj.getSeconds()).padStart(2, '0');
    
      return `${formattedDay}-${formattedMonth}-${formattedYear} ${hours}:${minutes}:${seconds}`;
    }




onSumbit(){
let dt = {
  
    loggedInUsername: sessionStorage.getItem('USER_NAME'),
    operation: "searchContactNumber",
   contactNumber: this.groupForm.get('contactNumber')?.value || '',
  contactName: this.groupForm.get('contactName')?.value || '',
  groupName: this.groupForm.get('groupName')?.value || ''
}
 this.phonebook.searchNumberInGroup(dt).subscribe((res: any) => {
  if (res.result === 'Success') {
     this.groups = res.data.phonebookList;
    this.toaster.success(res.message);
  } else {
    this.toaster.error(res.message);
  }
}, error => {
  this.toaster.error('Something went wrong while deleting the contact');
});
}

removeGroup(id: string): void {
  const dt = {
    loggedInUsername: sessionStorage.getItem('USER_NAME'),
    operation: "removeContactNumber",
    contactIdsToRemove: [id]
  };

 this.phonebook.removeNumberFromGroup(dt).subscribe((res: any) => {
  if (res.result === 'Success') {
    //  window.location.reload();
       this.table();
       this.groupForm.reset();
    this.toaster.success(res.message);
   
    
  } else {
    this.toaster.error(res.message);
  }
}, error => {
  this.toaster.error('Something went wrong while deleting the contact');
});

}

cancelGroup(){

}
}
