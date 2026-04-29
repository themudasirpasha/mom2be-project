import { Injectable } from '@angular/core';
import {
  HttpEvent, HttpHandler, HttpInterceptor, HttpRequest
} from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable()
export class InterceptorService implements HttpInterceptor {

  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {

    const session_id = localStorage.getItem('session_id');

    if (session_id) {
      const cloned = req.clone({
        setHeaders: {
          session_id: session_id
        }
      });
      return next.handle(cloned);
    }

    return next.handle(req);
  }
}