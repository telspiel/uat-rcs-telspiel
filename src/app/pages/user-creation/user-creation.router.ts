import { Routes } from '@angular/router';
import { UserCreationComponent } from './user-creation.component';

export const UserAddRoutes: Routes = [
    {
        path:"", component:UserCreationComponent
    },
    {path:"add", loadComponent: ()=> import('./add-user/add-user.component').then((c)=>c.AddUserComponent)},
    {path:"view" ,loadComponent: ()=> import('./view/view.component').then((c)=>c.ViewComponent)},
    {path:"update" ,loadComponent: ()=> import('./edit/edit.component').then((c)=>c.EditComponent)}
]
