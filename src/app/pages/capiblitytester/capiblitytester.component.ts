import { Component } from '@angular/core';
import { NzUploadChangeParam, NzUploadFile } from 'ng-zorro-antd/upload';
import { TemplateService } from 'src/app/service/template-service.service';
import { ToastService } from 'src/app/shared/toast-service.service';

@Component({
  selector: 'app-capiblitytester',
  templateUrl: './capiblitytester.component.html',
  styleUrls: ['./capiblitytester.component.scss']
})
export class CapiblitytesterComponent {
  file=""
  uploading = false;
  fileList: NzUploadFile[] = [];
  date =[new Date(),new Date()]
  from:any
  botId: string | null = null; 
  botss: any;
  messageTemplate: any;
  to:any
  listOfData :any []=[]
 constructor(private template:TemplateService, private toastService: ToastService){}
 beforeUpload = (file: NzUploadFile): boolean => {
  this.fileList = this.fileList.concat(file);
  return false;
};

ngOnInit(){
  const currentDate = new Date();
  const year = currentDate.getFullYear();
  const month = ('0' + (currentDate.getMonth() + 1)).slice(-2);
  const day = ('0' + currentDate.getDate()).slice(-2);
  const formattedCurrentDate = `${year}-${month}-${day}`;
  console.log(formattedCurrentDate);

  const previousDate = new Date(currentDate);
  previousDate.setDate(previousDate.getDate() - 1);
  const prevYear = previousDate.getFullYear();
  const prevMonth = ('0' + (previousDate.getMonth() + 1)).slice(-2);
  const prevDay = ('0' + previousDate.getDate()).slice(-2);
  const formattedPreviousDate = `${prevYear}-${prevMonth}-${prevDay}`;
  console.log(formattedPreviousDate);

  let dt={
    "loggedInUserName":sessionStorage.getItem('USER_NAME'),
    "fromDate":formattedPreviousDate,
    "toDate":formattedCurrentDate
   }
   this.template.getBulkCapablityData(dt).subscribe({
    next:(res)=>{console.log(res)
      if(res.code==0){
        //this.toastService.publishNotification("No data found for the selected date","error","error")
      }
      else{
        this.listOfData=res.listOfData
        this.listOfData=this.listOfData.reverse()
      }
    },
  
    error:(err)=>{console.log(err)
      this.toastService.publishNotification("Something went Wrong","error","error")
    }
  
   })

   
  let data = {
    loggedInUserName: sessionStorage.getItem('USER_NAME'),
  }
  this.template.getallbotdetail(data).subscribe(

    (response: any) => {
      this.messageTemplate = []
      if (response.data && response.data.bots) {
        this.botss = response.data.bots;
      } else {
        console.error('Invalid API response:', response);
      }
    },
    (error) => {
      console.error('Failed to fetch bot data:', error);
    }
  );




}



handleSubmit(){
  const dateObj1 = new Date(this.date[0]);
  const fromyear = dateObj1.getFullYear();
  const frommonth = ('0' + (dateObj1.getMonth() + 1)).slice(-2);
  const fromday = ('0' + dateObj1.getDate()).slice(-2);
  const fromformattedDate = `${fromyear}-${frommonth}-${fromday}`;
  this.from = fromformattedDate;
  console.log(this.from)

  const dateObj2 = new Date(this.date[1]);
  const toyear = dateObj2.getFullYear();
  const tomonth = ('0' + (dateObj2.getMonth() + 1)).slice(-2);
  const today = ('0' + dateObj2.getDate()).slice(-2);
  const toformattedDate = `${toyear}-${tomonth}-${today}`;
  this.to = toformattedDate;
  console.log(this.to)
  //console.log(this.date[1])

 let dt={
  "loggedInUserName":sessionStorage.getItem('USER_NAME'),
  "fromDate":this.from,
  "toDate":this.to
 }
 this.template.getBulkCapablityData(dt).subscribe({
  next:(res)=>{console.log(res)
    if(res.code==0){
      this.toastService.publishNotification("No data found for the selected date","error","error")
    }
    else{
      this.listOfData=res.listOfData
      this.listOfData=this.listOfData.reverse()
    }
  },

  error:(err)=>{console.log(err)
    this.toastService.publishNotification("Something went Wrong","error","error")
  }

 })
}

handleUpload(): void {
  const formData = new FormData();
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  this.fileList.forEach((file: any) => {
    formData.append("file",file)
    formData.append("fileName",file.name)
    formData.append("fileType","BulkCapibatity")
    formData.append("loggedInUserName",sessionStorage.getItem('USER_NAME')!)
  });
  this.uploading = true;
  // You can use any AJAX library you like

  this.template.uploadCsvFlie(formData).subscribe(
    {
      next:(res)=>{
       
        console.log(res)
        this.file=res.data.originalFileName 
        const dt1 ={
          "loggedInUserName":sessionStorage.getItem('USER_NAME'),
          "fileName":this.file,
          "botId" : this.botId 
      }
        this.template.capblityBulk(dt1).subscribe({
          
          next:(res)=>{console.log(res)
            this.uploading = false;
            if(res.code == 2000 && res.result == 'success') {
              this.toastService.publishNotification("File Uploaded Successfully", "success", "success");
              const currentDate = new Date();
              const year = currentDate.getFullYear();
              const month = ('0' + (currentDate.getMonth() + 1)).slice(-2);
              const day = ('0' + currentDate.getDate()).slice(-2);
              const formattedCurrentDate = `${year}-${month}-${day}`;
              console.log(formattedCurrentDate);
            
              const previousDate = new Date(currentDate);
              previousDate.setDate(previousDate.getDate() - 1);
              const prevYear = previousDate.getFullYear();
              const prevMonth = ('0' + (previousDate.getMonth() + 1)).slice(-2);
              const prevDay = ('0' + previousDate.getDate()).slice(-2);
              const formattedPreviousDate = `${prevYear}-${prevMonth}-${prevDay}`;
              console.log(formattedPreviousDate);
            
              let dt={
                "loggedInUserName":sessionStorage.getItem('USER_NAME'),
                "fromDate":formattedPreviousDate,
                "toDate":formattedCurrentDate
               }
               this.template.getBulkCapablityData(dt).subscribe({
                next:(res)=>{console.log(res)
                  if(res.code==0){
                    //this.toastService.publishNotification("No data found for the selected date","error","error")
                  }
                  else{
                    this.listOfData=res.listOfData
                    this.listOfData=this.listOfData.reverse()
                    this.fileList = []
                  }
                },
              
                error:(err)=>{console.log(err)
                  this.toastService.publishNotification("Something went Wrong","error","error")
                }
              
               })
            }
          },
          error:(err)=>{
            this.uploading = false;
            this.toastService.publishNotification("Something went Wrong","error","error")
          }
        })
      },
      error:(err)=>{
        this.uploading = false;
        this.toastService.publishNotification("Something went Wrong","error","error")
      }
    }
  )
  
}




}
