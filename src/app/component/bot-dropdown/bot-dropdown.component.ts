import { Component, EventEmitter, Output } from '@angular/core';
import { TemplateService } from 'src/app/service/template-service.service';

@Component({
  selector: 'app-bot-dropdown',
  templateUrl: './bot-dropdown.component.html',
  styleUrls: ['./bot-dropdown.component.scss']
})
export class BotDropdownComponent {
  bots:any
  botSelected:any
  @Output() dataEvent: EventEmitter<string> = new EventEmitter();  constructor(private templateService: TemplateService) { }

  onChange() {
    this.dataEvent.emit(this.botSelected)
  }
  ngOnInit() {
    this.templateService.getallbotdetail({ "loggedInUserName": sessionStorage.getItem('USER_NAME') }).subscribe((res: any) => {
    this.bots = res.data.bots
    
  })
  }
  
}
