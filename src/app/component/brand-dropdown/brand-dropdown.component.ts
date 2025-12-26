import { Component, EventEmitter, Output } from '@angular/core';
import { BrandService } from 'src/app/service/brand.service';

@Component({
  selector: 'app-brand-dropdown',
  templateUrl: './brand-dropdown.component.html',
  styleUrls: ['./brand-dropdown.component.scss']
})
export class BrandDropdownComponent {
  brand:any
  brandSelected:any

  @Output() dataEvent: EventEmitter<string> = new EventEmitter();
  
    onChange() {
      this.dataEvent.emit(this.brandSelected)
    }
  constructor(private brandservice:  BrandService) { }

  ngOnInit(){
    this.brandservice.getAllbrandname({ "loggedInUserName": sessionStorage.getItem('USER_NAME') }).subscribe((res: any) => {
    this.brand = res.data.dataList
  })
  }
  
}
