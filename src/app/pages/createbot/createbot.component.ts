import { Component, OnInit } from '@angular/core';
import { TemplateMessageService } from 'src/app/service/template-message.service';
import { TemplateService } from 'src/app/service/template-service.service';
import { ToastService } from 'src/app/shared/toast-service.service';
import { BotServiceService } from 'src/app/service/bot-service.service';
import { Router } from '@angular/router';
import { FormControl } from '@angular/forms';
import { debounceTime, distinctUntilChanged } from 'rxjs';
import { NzIconService } from 'ng-zorro-antd/icon';
@Component({
  selector: 'app-createbot',
  templateUrl: './createbot.component.html',
  styleUrls: ['./createbot.component.scss']
})
export class CreatebotComponent {
  dt:any;
  bots: any[] = [];
  role: string =sessionStorage.getItem('ROLE')||"";
  loggedInUserName: string = '';
  searchControl = new FormControl('');
  filteredData: any[] = [];
  constructor(private templateService: TemplateService, private toastService: ToastService, private botService:BotServiceService, private router: Router, private iconService: NzIconService ) {

    this.iconService.addIconLiteral(
      'custom:roket',
      `<svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill="#000000"><path d="m226-559 78 33q14-28 29-54t33-52l-56-11-84 84Zm142 83 114 113q42-16 90-49t90-75q70-70 109.5-155.5T806-800q-72-5-158 34.5T492-656q-42 42-75 90t-49 90Zm178-65q-23-23-23-56.5t23-56.5q23-23 57-23t57 23q23 23 23 56.5T660-541q-23 23-57 23t-57-23Zm19 321 84-84-11-56q-26 18-52 32.5T532-299l33 79Zm313-653q19 121-23.5 235.5T708-419l20 99q4 20-2 39t-20 33L538-80l-84-197-171-171-197-84 167-168q14-14 33.5-20t39.5-2l99 20q104-104 218-147t235-24ZM157-321q35-35 85.5-35.5T328-322q35 35 34.5 85.5T327-151q-25 25-83.5 43T82-76q14-103 32-161.5t43-83.5Zm57 56q-10 10-20 36.5T180-175q27-4 53.5-13.5T270-208q12-12 13-29t-11-29q-12-12-29-11.5T214-265Z"/></svg>`
    );
  }

  editBot(bot: any) {
    console.log('Selected bot:', bot); 
    this.botService.setBotDetails(bot);
  }
  getBotLink(): string {
    return this.role === 'client' ? '/viewbot' : '/configbot';
  }
  ngOnInit() {
    this.loggedInUserName = sessionStorage.getItem('USER_NAME') || 'User';
    let dt = {
      loggedInUserName: sessionStorage.getItem('USER_NAME') || 'Guest',
    }
    this.templateService.getallbotdetail(dt).subscribe(
      (response: any) => {
        if (response.data && response.data.fullBotList) {
          console.log('Full API Data:', response.data.fullBotList); 
          console.log('Response:', response.data); 
          const botId= response.data.bots.map((bot: any) => bot.botId);
            this.bots = response.data.fullBotList.map((bot: any, index: number) => ({
              botId: botId[index] || '-',
              botName: bot.botName || '-',
              botType: bot.botType || '-',
              brandName: bot.creationData?.data?.brandDetails?.brandName || '-',
              status: bot.operatorData ? bot.operatorData.map((op: any) => op.operatorBotStatus) : '-',
              operatorNames: bot.operatorData ? bot.operatorData.map((op: any) => op.operatorName).join(', ') : '-'
            }));
            response.mappedBots = this.bots; 
    
          console.log('Mapped Bots:', this.bots); 
    
          this.filteredData = [...this.bots];
        } else {
          console.error('Invalid API response:', response);
        }
      },
      (error) => {
        console.error('Failed to fetch bot data:', error);
      }
    );
    
    

    this.searchControl.valueChanges
      .pipe(debounceTime(300), distinctUntilChanged()) // Prevents unnecessary API calls
      .subscribe((value:any) => this.applyFilter(value));
  }
  applyFilter(searchTerm: string) {
    if (!searchTerm) {
      this.filteredData = [...this.bots]; // Reset filtered data
      return;
    }
  
    const lowerCaseTerm = searchTerm.toLowerCase();
  
    this.filteredData = this.bots.filter(item =>
      Object.values(item).some((value: any) =>
        value?.toString().toLowerCase().includes(lowerCaseTerm)
      )
    );
  }

  clearBotAndNavigate(): void {
    sessionStorage.removeItem('selectedBot'); 
    console.log('selectedBot removed:', sessionStorage.getItem('selectedBot'));
    this.router.navigate(['/botcreation']);
  }
  
}
        
  
