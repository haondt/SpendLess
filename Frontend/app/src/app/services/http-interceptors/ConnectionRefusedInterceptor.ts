import { HttpEvent, HttpHandler, HttpInterceptor, HttpRequest } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { catchError, Observable, of, throwError } from "rxjs";
import { Logger } from "../logger.service";

@Injectable()
export class ConnectionRefusedInterceptor implements HttpInterceptor {

    constructor(private logger: Logger) {
    }

    intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
        return next.handle(req).pipe(catchError((e,s) => {
            if (e.status === 0){
                this.logger.error(s);
            }
            throw e;
        }))
    }
}