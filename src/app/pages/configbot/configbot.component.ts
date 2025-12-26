import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { BotServiceService } from 'src/app/service/bot-service.service';
import { BrandService } from 'src/app/service/brand.service';
import { ReportService } from 'src/app/service/report.service';
import { TemplateMessageService } from 'src/app/service/template-message.service';
import { TemplateService } from 'src/app/service/template-service.service';
import { ToastService } from 'src/app/shared/toast-service.service';


@Component({
  selector: 'app-configbot',
  templateUrl: './configbot.component.html',
  styleUrls: ['./configbot.component.scss']
})
export class ConfigbotComponent {
  
  currentStep: number = 1;
  messageTemplates: any = [];
  bot: any;
  botId:any
  botName: any;
  botStatus: any;
  testDevices: any[] = [];
  code='+91'
  isVisible = false;
  phNumber=""
  mobileNumber=""
  err=""
  status=""
  isTestTemplate=false
  templatename=''
  isOkLoading :any


  // selectAllOptions(){
  //   this.mobileNumber = this.testDevices.map(item => item.phoneNumber);
  // }
  showTestTemplate(template:any){
    this.isTestTemplate=true;
    this.templatename=template
  }

  getTemplates(botid:any){
    console.log(botid)
    this.messageTemplates =[]
    let dt = {
      "loggedInUserName":sessionStorage.getItem('USER_NAME'),
      "botId":botid
   }
   this.reportService.templatelist(dt).subscribe((res: any) => {
     console.log(res);
     if (res.data && res.data.templateList) {
       this.messageTemplates = res.data.templateList;
       
     } else {
       this.messageTemplates = []; 
     }
   });
  }
  
  addNumber(){
    if(this.phNumber!="" && this.phNumber.length == 10){
      let dt = {
        "loggedInUserName":sessionStorage.getItem('USER_NAME'),
        "testNumbers" : [{"phoneNumber" : this.code+this.phNumber}],
        "botId":this.botId,
        "botName":this.botName
      }
      this.templateService.test(dt).subscribe(
        {
          next:(res)=>{console.log(res);
             this.toastService.publishNotification('success', res.message, 'success')},
             
          error:(err)=>{console.log(err)}
        }
      )
      this.phNumber=""
      this.handleClose()
    }
    else{
      if(this.phNumber.length != 10){
        this.err="*enter a valid number"
  
      }
      if(this.phNumber==""){
        this.err="*field can't be blank"
      }
    }
    this.getBotDetails()
  }

  handleSubmit(){
    this.isTestTemplate=false
  }

  handleClose(){
    this.isTestTemplate=false
  }


  showModal(): void {
    this.isVisible = true;
  }

  handleOk(): void {
    this.isOkLoading = true;
    console.log('Button ok clicked!');
    setTimeout(() => {

    }, 5000);
    let botDetails=sessionStorage.getItem('botId') || ""
    let bot=JSON.parse(botDetails)

    if(this.phNumber!="" && this.phNumber.length == 10){
    let dt = {
      "loggedInUserName":sessionStorage.getItem('USER_NAME'),
      "testNumbers" : [{"phoneNumber" : this.code+this.phNumber}],
      "botId":bot.botId,
      "botName":bot.botName
    }
    this.templateService.test(dt).subscribe(
      {
        next:(res)=>{console.log(res);
            if (res){
              this.isOkLoading = false;
              this.isVisible = false;
              this.toastService.publishNotification('success', res.message, 'success')
              this.phNumber=""
              this.getBotDetails()
          }
          },
           
        error:(err)=>{console.log(err)
          this.toastService.publishNotification('error', "Internal Server Error",'error')
          this.isOkLoading = false;
          this.isVisible = false;
        }
      }
    )
    
    
  }
  else{
    if(this.phNumber.length != 10){
      this.err="*enter a valid number"

    }
    if(this.phNumber==""){
      this.err="*field can't be blank"
    }
   this.isVisible=true
  }
  this.getBotDetails()
  }

  handleCancel(): void {
    console.log('Button cancel clicked!');
    this.isVisible = false;
  }
  constructor( private route: ActivatedRoute,private toastService: ToastService, private reportService: ReportService, private template: TemplateMessageService , private brandservice : BrandService, private templateService:TemplateService, private botService:BotServiceService)  {

   }

  getTemplate(temp:any){
    this.template.setTemplate(temp)
    }
  ngOnInit() {
    this.botId = this.route.snapshot.paramMap.get('id');
    
    
    // let botDetails=sessionStorage.getItem('botId') || ""
    // let bot=JSON.parse(botDetails)
    //console.log(this.botService.getBotDetails())

    // this.botId=bot.botId;
    // this.botName=bot.botName;
    // this.botStatus=bot.status;
    this.getTemplates(this.botId)
    // let dt = {
    //      "loggedInUserName":sessionStorage.getItem('USER_NAME'),
    //   }
    //   this.reportService.templatelist(dt).subscribe((res: any) => {
    //     console.log(res);
    //     if (res.data && res.data.templateList) {
    //       this.messageTemplates = res.data.templateList; 
    //     } else {
    //       this.messageTemplates = []; 
    //     }
    //   });
      
      this.getBotDetails()
      

      }

    getBotDetails(){
      let dt2={
        "loggedInUserName":sessionStorage.getItem('USER_NAME'),
        "botId":this.botId
      }
      this.templateService.editbotdetail(dt2).subscribe({
        next:(res)=>{
          console.log(res)
           this.botName=res.data.botData.botName;
           this.botStatus=res.data.botData.status;
          this.testDevices = res.data.botData.testNumbers
        },
        error:(err)=>{
          console.log(err)
        }
      })
    }

    sendTestMessage(){
      let dt ={
        "loggedInUserName": sessionStorage.getItem('USER_NAME'),
        "mobileNumber": this.mobileNumber,
        "botId": this.botId,
        "msgType": "text",
        "templateCode": this.templatename,
    }
      this.templateService.testTemplate(dt).subscribe(
        {
          next:(res)=>console.log(res),
          error:(err)=>console.log(err)
        }
      )
    }

    formatTimestamp(timestamp:any) {
      const date = new Date(timestamp);
      const day = String(date.getDate()).padStart(2, '0');
      const month = String(date.getMonth() + 1).padStart(2, '0'); // Months are zero-based
      const year = date.getFullYear();
      const hours = String(date.getHours()).padStart(2, '0');
      const minutes = String(date.getMinutes()).padStart(2, '0');
      const seconds = String(date.getSeconds()).padStart(2, '0');
  
      return `${day}/${month}/${year} ${hours}:${minutes}:${seconds}`;
  }
    refreshOK(phoneNumber:string){
      let dt = {
        loggedInUserName: sessionStorage.getItem('USER_NAME'),
        // number:this.checkcapabilityform.value.Mobile_Number,
        number :  phoneNumber,
        // botId :"1x0kiKmR0Sd1WJuU"
        botId : this.botId
    
      }
      this.templateService.refresh(dt).subscribe({
        next: (res) => {
          // this.toastService.publishNotification("success", res.message, "success");

          if  (res.result === "failure") {
            this.toastService.publishNotification("Error", res.message, "error");
            return;
        }

        this.toastService.publishNotification("Success", res.message, "success");
          // this.quickCampaign.reset();
    
          // Initialize capabilities array
          // this.capabilities = [];
    
          // Check if response contains data
          if (res.data && res.data.response) {
            try {
              // Fix the incorrectly formatted JSON string
              let fixedJsonString = res.data.response.replace(/"{/g, '{').replace(/}"/g, '}').replace(/\\"/g, '"');
    
              // Parse JSON correctly
              let parsedResponse = JSON.parse(fixedJsonString);
    
              // Extract features array
              // this.capabilities = parsedResponse.features || [];
            } catch (e) {
              console.error("Error parsing response:", e);
            }
          }
        },
        error: (err) =>
          this.toastService.publishNotification("error", err.error.error, "error")
      });
    }
  }