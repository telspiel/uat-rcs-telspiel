 
 
  
  import { Component } from '@angular/core';
  import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
// import { UploadcampaignComponent } from './uploadcampaign.component';
import { NzIconModule } from 'ng-zorro-antd/icon';
  import { NzUploadChangeParam, NzUploadFile } from 'ng-zorro-antd/upload';
  import { TemplateService } from 'src/app/service/template-service.service';
  import { ToastService } from 'src/app/shared/toast-service.service';
import { CampaignService } from 'src/app/service/campaign.service';
import { FormControl } from '@angular/forms';
import { debounceTime, distinctUntilChanged } from 'rxjs';
import { BASE_URL } from 'src/app/config/app-config';
  
  @Component({
    selector: 'app-uploadcampaign',
    templateUrl: './uploadcampaign.component.html',
    styleUrls: ['./uploadcampaign.component.scss']
  })
  export class UploadcampaignComponent {
    searchValue=''
    file=""
    uploading = false;
    fileList: NzUploadFile[] = [];
    date: any
    from:any
    botId: string | null = null; 
    botss: any;
    messageTemplate: any;
    to:any
    data: any;
    listOfData :any []=[]
    searchControl = new FormControl('');
    filteredData: any[] = [];
    userName=sessionStorage.getItem('USER_NAME')!;
    token=sessionStorage.getItem('TOKEN')!;
    apiUrl=`${BASE_URL}/rcs-reseller-service/uploadCampaignFile`;
   constructor(private template:TemplateService, private toastService: ToastService, private caampain: CampaignService ){}
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
    //console.log(formattedCurrentDate);
  
    const previousDate = new Date(currentDate);
    previousDate.setDate(previousDate.getDate() - 1);
    const prevYear = previousDate.getFullYear();
    const prevMonth = ('0' + (previousDate.getMonth() + 1)).slice(-2);
    const prevDay = ('0' + previousDate.getDate()).slice(-2);
    const formattedPreviousDate = `${prevYear}-${prevMonth}-${prevDay}`;
    //console.log(formattedPreviousDate);
 
  this.caampain.getAllFiles().subscribe({
    next:(res)=>{
      //console.log(res)
      this.listOfData=res
      this.filteredData = [...this.listOfData.reverse()];
      //console.log(this.filteredData)
    }
   
   })
     
   this.searchControl.valueChanges
         .pipe(debounceTime(300), distinctUntilChanged())
         .subscribe((value: any) => this.applyFilter(value));
  
  
  
  
  }
  applyFilter(searchTerm: string) {
    if (!searchTerm) {
      this.filteredData = [...this.listOfData]; 
      return;
    }
  
    const lowerCaseTerm = searchTerm.toLowerCase();
  
    this.filteredData = this.listOfData.filter((item: any) =>
      Object.values(item).some((value: any) =>
        value?.toString().toLowerCase().includes(lowerCaseTerm)
      )
    );
  }
  
  
  handleUpload(): void {
    const formData = new FormData();
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    this.fileList.forEach((file: any) => {
      formData.append("file",file)
      formData.append("userName",sessionStorage.getItem('USER_NAME')!)
    });
    this.uploading = true;
    // You can use any AJAX library you like
  
    this.caampain.uploadFlile(formData).subscribe(
      {
        next:(res)=>{
          this.toastService.publishNotification("File Uploaded Successfully", "success", "success");
          this.uploading = false;
          //console.log(res)
          this.fileList = [];
          this.caampain.getAllFiles().subscribe({
            next:(res)=>{
              ////console.log(res)
              this.listOfData=res
      
              
              this.filteredData = [...this.listOfData.reverse()];
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
  deleteFile(data: any){
    this.caampain.deleteFile(data).subscribe({
      next:(res)=>{
        
        if(res.message=="File deleted successfully."){
          this.toastService.publishNotification("File Deleted Successfully","success","success")

          this.caampain.getAllFiles().subscribe({
            next:(res)=>{
              //console.log(res)
              this.listOfData=res
              
              this.filteredData = [...this.listOfData.reverse()];
            }
             
           })
        }
        else{
          this.toastService.publishNotification("Something went Wrong","error","error")
        }
      },
      error:(err)=>{
        //console.log(err)
        this.toastService.publishNotification("Something went Wrong","error","error")
      }
    })
  }


  
  
  
  }
  
  

  