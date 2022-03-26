import { HttpContextToken, HttpEvent, HttpHandler, HttpInterceptor, HttpRequest, HttpResponse, HTTP_INTERCEPTORS } from "@angular/common/http";
import { Injectable, Injector } from "@angular/core";
import { Router } from "@angular/router";
import { catchError, Observable, Subject, switchMap, tap, throwError } from "rxjs";
import { AuthenticationService } from "../api/authentication.service";
import { Logger } from "../logger.service";

export const SKIP_AUTH = new HttpContextToken<boolean>(() => false);

@Injectable()
export class AuthInterceptor implements HttpInterceptor{
    refreshTokenInProgress = false;
    tokenRefreshedSource = new Subject<string>();
    tokenRefreshed$ = this.tokenRefreshedSource.asObservable();

    constructor(private injector: Injector, private router: Router, private authService: AuthenticationService, private logger: Logger){}

    addAuthHeader(request: HttpRequest<any>): HttpRequest<any> {
        const sessionToken = this.authService.GetSessionToken();
        this.logger.trace("added sessionToken " + sessionToken + "to req " + request.url);
        if (sessionToken){
            return request.clone({setHeaders: {"Authorization": "Bearer " + sessionToken, 'Content-type' : 'application/json'}});
        }
        return request;
    }

    refreshToken(): Observable<any> {
        if (this.refreshTokenInProgress){
            return new Observable(ob => {
                this.tokenRefreshed$.subscribe(() => {
                    ob.next();
                    ob.complete();
                })
            });
        } else {
            this.refreshTokenInProgress = true;
            return this.authService.refreshToken().pipe(tap((s) => {
                this.refreshTokenInProgress = false;
                this.tokenRefreshedSource.next(s);
            }),
            catchError((e,s) => {
                this.refreshTokenInProgress = false;
                this.logout();
                return throwError(() => new Error(e));
            }));
        }
    }

    logout() {
        this.authService.logout();
        this.router.navigate(['login']);
    }

    handleResponseError(err: any, req: HttpRequest<any>, next: HttpHandler){
        if(err.status === 401){
            return this.refreshToken().pipe(switchMap((s)=>{
                req = this.addAuthHeader(req);
                return next.handle(req);
            }),
            catchError((e,s) => {
                if (e.status !== 401){
                    return this.innerHandleResponseError(e)
                } else {
                    this.logout();
                }
                return s;
            }))
        }

        return this.innerHandleResponseError(err);
    }

    innerHandleResponseError(err: any){
        if (err.status === 403){
            this.logout();
        }
        return throwError(() => {this.logger.debug(err); });
    }

    intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
        req = req.clone({withCredentials: true});
        this.logger.trace(req);

        if(req.context.get(SKIP_AUTH) === true){
            return next.handle(req);
        }
        req = this.addAuthHeader(req);
        return next.handle(req).pipe(catchError(e => {
            return this.handleResponseError(e, req, next);
        }));
    }
}