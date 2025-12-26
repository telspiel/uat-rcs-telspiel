import { Component, EventEmitter, Input, OnInit, Output, ViewChild } from '@angular/core';
import { NzCarouselComponent } from 'ng-zorro-antd/carousel';
import { FormGroup } from '@angular/forms';
@Component({
  selector: 'app-coursel',
  templateUrl: './coursel.component.html',
  styleUrls: ['./coursel.component.scss']
})
export class CourselComponent {
  @Input() templateForm!: FormGroup;
  @Input() selectedTemplate: any;
  @Input() carouselList: any[] = [];
  @Input() alignment: string = '';
  @Input() index: number = 0;
  

  @ViewChild('carouselRef') carouselRef!: NzCarouselComponent;

  @Output() carouselRefOutput = new EventEmitter<NzCarouselComponent>();

  ngAfterViewInit(): void {
    this.carouselRefOutput.emit(this.carouselRef);
  }

  constructor() {}

  ngOnInit(): void {}

  prevCard(): void {
    this.carouselRef?.pre();
  }

  nextCard(): void {
    this.carouselRef?.next();
  }


  getSuggestionIcon(type: string): string {
    switch (type) {
      case 'view_location_query':
      case 'share_location':
      case 'view_location_latlong':
        return 'environment';
      case 'dialer_action':
        return 'phone';
      case 'url_action':
        return 'global';
      case 'calendar_event':
        return 'calendar';
      default:
        return '';
    }}

   
}
