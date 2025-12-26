import { Component, OnInit, ViewChild } from '@angular/core';
import { PhonebookService } from 'src/app/service/phonebook.service';
  // import { NzMessageService } from 'ng-zorro-antd/message';
  import { NzUploadFile } from 'ng-zorro-antd/upload';



import { FormBuilder, FormGroup, Validators, FormArray, FormControl } from '@angular/forms';
import { ToastService } from 'src/app/shared/toast-service.service';
import { TemplateMessageService } from 'src/app/service/template-message.service';
import { TemplateService } from 'src/app/service/template-service.service';
import { SEND_TEMPLATE_MODEL, TEMPLATES, TEMPLATE_RESPONSE } from 'src/app/models/templateModel';
import { NzCarouselComponent } from 'ng-zorro-antd/carousel';
import { ReportService } from 'src/app/service/report.service';
import { BrandService } from 'src/app/service/brand.service';
import { BotServiceService } from 'src/app/service/bot-service.service';
import { debounceTime, distinctUntilChanged } from 'rxjs';

interface Suggestion {
  type: string;
  text: string;
  postback: string;
}

@Component({
  selector: 'app-phonebook',
  templateUrl: './phonebook.component.html',
  styleUrls: ['./phonebook.component.scss']
})
export class PhonebookComponent {
  groupName: string = '';
  groupDescription: string = '';
  groups: any[] = [];
  loadingGroups: boolean = false;
  selectedGroup: string = '';
  contactName: string = '';
  contactNumber: string = '';
  fileList: NzUploadFile[] = [];

  addgroupName : string = '';

  Descripton : string = '';

  groupForm!: FormGroup;










   @ViewChild('carouselRef', { static: false }) carousel!: NzCarouselComponent;
    cards: { id: number; previewUrl: string | null }[] = [
    
    ];
    botid=''
    custom=false
    currentStep: number = 1;
    messageTemplates: any = [];
    bot: any;
    botId: any;
    botName: any;
    botStatus: any;
    testDevices: any[] = [];
    code='+91'
    isVisible = false;
    phNumber=""
    customParams:any
    mobileNumber=""
    err=""
    status=""
    isTestTemplate=false
    templatename=''
    addPage:boolean=true
    ViewPage:boolean=false
    imageHeight = 120;
    orientation = 'vertical';
    selectedCardIndex: number | null = null;
    templateType: string = ''; 
    displayName=""
    templateForm!: FormGroup;
    loggedInUserName: string = '';
    role: string =sessionStorage.getItem('ROLE')||"";
    cardTitle: string = '';
    carouselList:{ id:number,cardTitle: string;cardDescription:string;fileName:string | null; }[] =[
      {
        id:0,
        cardTitle:"",
        cardDescription:"",
        fileName:""
      }
    ];
    carouseldetails:{ cardTitle: string;}[] =[
      
    ];
    form!: FormGroup;
    // suggestions: FormArray = this.fb.array([]);
    type: string = '';
    text: string = '';
    postback: string = '';
    // isFallbackEnabled: boolean = false;
    messageBody: boolean = true;
    TextMessage: boolean = true;
    fallbackSmsContent: string = ''; 
    carddescription: string = '';
    Suggestiontext: string = '';
    messagecontent: string = '';
    previewUrl: string | null = null;
    uploadedFileSize: string | null = null;
    uploadedFileUrl: string | null = null;
    newbot: any;
    edit:boolean=false
    filteredData: any[]= []
    searchControl = new FormControl('');
    logedinuser=sessionStorage.getItem('USER_NAME') 
  
  
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
    getTemplate(temp:any){
      this.template.setTemplate(temp)
    }
    prevSlide(): void {
        this.carousel.pre();
    }
  
    nextSlide(): void {
        this.carousel.next();
    }
    getTemplates(botid:any){
      this.messageTemplates =[]
      this.filteredData=[]
      let dt = {
        "loggedInUserName":sessionStorage.getItem('USER_NAME'),
        "botId":botid
     }
     this.reportService.templatelist(dt).subscribe((res: any) => {
       if (res.data && res.data.templateList) {
         this.messageTemplates = res.data.templateList;
         this.filteredData =[...this.messageTemplates]; 
       } else {
         this.messageTemplates = []; 
       }
     });
    }
  
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
    this.carouselList.splice(index,1)
  }

   







  constructor(
    private phonebookService: PhonebookService, 
  

     private fb: FormBuilder, 
    private toastService: ToastService,
    private templateService: TemplateService,
    private botService:BotServiceService,
    private reportService: ReportService, private template: TemplateMessageService
  )
  
  {

    this.groupForm = this.fb.group({
    addgroupName: ['',Validators.required],
    Descripton: ['', Validators.required]
  });
  
}

  ngOnInit(): void {
    this.loadGroups();
  }
 

  loadGroups(): void {
    this.loadingGroups = true;
    this.phonebookService.getAllGroupsList({ loggedInUserName: sessionStorage.getItem('USER_NAME'), }).subscribe(
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
        loggedInUserName: sessionStorage.getItem('USER_NAME'),
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
    }
  }

  viewGroup(groupId: string): void {
    this.phonebookService.viewGroup({ loggedInUserName: sessionStorage.getItem('USER_NAME'), groupId }).subscribe(
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
    if (this.selectedGroup && this.contactName && this.contactNumber) {
      this.phonebookService.addNumberToGroup({
        loggedInUsername: sessionStorage.getItem('USER_NAME'),
        operation: 'addContactNumber',
        contactNumber: this.contactNumber,
        contactName: this.contactName,
        groupName: this.selectedGroup
      }).subscribe(
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

  handleUpload(): void {
    if (this.fileList.length > 0 && this.selectedGroup) {
      const formData = new FormData();
      const userName = sessionStorage.getItem("USER_NAME");
      const file = this.fileList[0].originFileObj as File;
      formData.append('file', file);
       formData.append('userName', userName || '');
      formData.append('fileType', 'txt');
      formData.append('fileName', 'contacts.txt');
      formData.append('groupId', this.groups.find(g => g.groupName === this.selectedGroup)?.groupId || '');

      this.phonebookService.uploadNumberInUserGroup(formData).subscribe(
        (response) => {
          // this.message.success('Contacts uploaded successfully');
          this.fileList = [];
        },
        (error) => {
          // this.message.error('Failed to upload contacts');
        }
      );
    }
  }

  clearGroupForm(): void {
    this.groupName = '';
    this.groupDescription = '';
  }

  clearUploadForm(): void {
    this.fileList = [];
    this.selectedGroup = '';
  }

  resetContactForm(): void {
    this.selectedGroup = '';
    this.contactName = '';
    this.contactNumber = '';
  }

 

onSumbit() {

  if (this.groupForm.invalid) {
    this.groupForm.markAllAsTouched();
    this.toastService.publishNotification("error", "Please fill all required fields correctly.", "error");
    return;
  }

  const dt1 = {
    loggedInUserName: sessionStorage.getItem('USER_NAME'),
    groupName: this.groupForm.value.addgroupName,
    groupDescription: this.groupForm.value.Descripton
  };

  this.phonebookService.addGroup(dt1).subscribe({
    next: (response) => {
      console.log("Group added:", response);

      if (response.result === "Success") {
        this.loadGroups();
        this.toastService.publishNotification("success", response.message || "Group added successfully");
        this.groupForm.reset();
      } else {
        this.toastService.publishNotification("error", response.message || "Failed to add group");
      }
    },
    error: (err) => {
      console.error("API Error:", err);
      this.toastService.publishNotification("error", "Something went wrong. Please try again later.");
    }
  });
}

removeGroup(groupname : any){

  const payload = {
    "loggedInUserName": sessionStorage.getItem('USER_NAME'),
    "operation" : "removeGroupFromList",
    "groupName" : groupname

  };
  this.phonebookService.deleteGroup(payload).subscribe(
    (response) => {
      if(response.result=="Success"){
      this.toastService.publishNotification('success',  response.message);
      this.loadGroups();
      }
       
      else{
            this.toastService.publishNotification("Error", response.message);
      }
    },
  );

}
cancelGroup(){

}


}