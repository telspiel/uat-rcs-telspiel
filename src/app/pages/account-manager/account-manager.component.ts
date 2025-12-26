import { Component } from '@angular/core';

import { AccountManagerService } from 'src/app/service/account-manager.service';



@Component({
  selector: 'app-account-manager',
  templateUrl: './account-manager.component.html',
  styleUrls: ['./account-manager.component.scss']
})
export class AccountManagerComponent {

    userName=sessionStorage.getItem('USER_NAME')
    reportList : any;

    listOfData: any;
  
   


      constructor(private accountService : AccountManagerService){}

      ngOnInit():void{

      }




    

    Routes = [
        {
            path:"", component:AccountManagerComponent
        },
        {path:"addAccount", loadComponent: ()=> import('./add-account/add-account.component').then((c)=>c.AddAccountComponent)},
        {path:"edit-account" ,loadComponent: ()=> import('./edit-account/edit-account.component').then((c)=>c.EditAccountComponent)},
        {path:"view-account" ,loadComponent : ()=>import('./view-account/view-account.component').then((c)=>c.ViewAccountComponent)}
        // {path:"update" ,loadComponent: ()=> import('./edit/edit.component').then((c)=>c.EditComponent)}
      ]
      


  
}
