import { HttpErrorResponse, HttpEvent, HttpHandler, HttpInterceptor, HttpRequest } from '@angular/common/http';
import { Injectable } from "@angular/core";
import { Observable } from 'rxjs';
import { catchError } from 'rxjs/internal/operators';

@Injectable()
export class CommonInterceptor implements HttpInterceptor {
    //拦截http请求，携带cookie给第三方请求
    intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
        return next.handle(req.clone({
            withCredentials: true,
        })).pipe(catchError(this.handleError))
    }
    private handleError(error: HttpErrorResponse): never {
        throw error.error;
    }
}