import { Injectable } from '@angular/core';
import { HttpClient, HttpContext, HttpContextToken } from '@angular/common/http';
import { ApiService } from './api.service';
import { UserAuthenticationModel } from 'src/app/models/authentication/UserAuthenticationModel';
import { UserRegistrationModel } from 'src/app/models/authentication/UserRegistrationModel';
import { tap } from 'rxjs/operators';
import { SKIP_AUTH } from '../http-interceptors/AuthInterceptor';
import { Observable, throwError, catchError } from 'rxjs';
import { UserService } from './User.service';

@Injectable({
  providedIn: 'root'
})
export class AuthenticationService {


  constructor(private httpClient: HttpClient,
    private apiService: ApiService,
    private userService: UserService) { }

  public login(authModel: UserAuthenticationModel) {
    return this.httpClient.post<string>(this.apiService.SERVER_URL + "login", authModel, { context: new HttpContext().set(SKIP_AUTH, true) })
      .pipe<string>(tap(s => {
        sessionStorage['sessionToken'] = s;
        localStorage['authenticated'] = true;
        this.userService.updateUserInfo();
      }));
  }

  public register(regModel: UserRegistrationModel) {
    return this.httpClient.post<string>(this.apiService.SERVER_URL + "register", regModel, { context: new HttpContext().set(SKIP_AUTH, true) })
      .pipe<string>(tap(s => {
        sessionStorage['sessionToken'] = s;
        localStorage['authenticated'] = true;
        this.userService.updateUserInfo();
      }));
  }

  public GetSessionToken() {
    return sessionStorage['sessionToken'];
  }

  public logout() {
    this.clearData();
    return this.httpClient.post(this.apiService.SERVER_URL + "logout", null)
      .pipe(tap(() => this.clearData()), catchError(e => { return throwError(() => e); }));
  }

  public clearData() {
    sessionStorage.removeItem('sessionToken');
    localStorage.removeItem('authenticated');
    this.userService.clearUserInfo();
  }

  public refreshToken(): Observable<string> {
    return this.httpClient.get<string>(this.apiService.SERVER_URL + "refresh-token", { context: new HttpContext().set(SKIP_AUTH, true) })
      .pipe<string>(tap(s => {
        sessionStorage['sessionToken'] = s;
        localStorage['authenticated'] = true;
      }));
  }

  public isAuthenticated(): boolean {
    if(localStorage.getItem('authenticated')){
      return true;
    }
    return false;
  }
}
