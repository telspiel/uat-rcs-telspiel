import { Component } from '@angular/core';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  title = 'rcs-admin';
  themeColor = sessionStorage.getItem('themeColor') ;

  ngOnInit(){
    document.documentElement.style.setProperty('--theme-color', this.themeColor);
    document.documentElement.style.setProperty('--theme-color-rbga', sessionStorage.getItem('theme-rbga')|| this.themeColor);
  }
    
}
