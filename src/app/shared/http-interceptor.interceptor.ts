import { Injectable } from '@angular/core';
import {
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpInterceptor,
  HttpErrorResponse
} from '@angular/common/http';
import { catchError, Observable, throwError } from 'rxjs';
import { AuthService } from './auth.service';
import { StorageService } from './storage.service';

@Injectable()
export class HttpInterceptorInterceptor implements HttpInterceptor {

  constructor(
    private authService: AuthService,
    private storageService: StorageService,
  ) { }

  intercept(request: HttpRequest<unknown>, next: HttpHandler): Observable<HttpEvent<unknown>> {
    // if (request.headers.has('Content-Type')){

    // }
    // const contentType = request.headers.has('Content-Type') ? request.headers.get('Content-Type') : 'application/json';
    // console.log(contentType)
    // request = request.clone({
    //   setHeaders: {
    //     'Authorization': `Bearer ${this.storageService.getToken()}`,
    //     'Content-Type': 'application/json'
    //   }
    // });

    // console.log(request)
    // return next.handle(request);
    return next.handle(request).pipe(
      catchError((error: HttpErrorResponse) => {

        const err=error?.error?.Response?.result || ""
        if (err==='Token Expired') { 
          
          this.authService.logoutUser(); 
           
        }
        return throwError(() => error);
      })
    );
  }
}
