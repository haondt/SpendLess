import { Injectable } from '@angular/core';
import { HttpClient, HttpContext, HttpContextToken } from '@angular/common/http';
import { ApiService } from './api.service';
import { UserAuthenticationModel } from 'src/app/models/authentication/UserAuthenticationModel';
import { UserRegistrationModel } from 'src/app/models/authentication/UserRegistrationModel';
import {tap} from 'rxjs/operators';
import { SKIP_AUTH } from '../http-interceptors/AuthInterceptor';
import { Observable } from 'rxjs';
import { UserService } from './User.service';

@Injectable({
  providedIn: 'root'
})
export class AuthenticationService {


  constructor(private httpClient: HttpClient,
    private apiService: ApiService) {}

  public login(authModel: UserAuthenticationModel){
    return this.httpClient.post<string>(this.apiService.SERVER_URL + "login", authModel, {context: new HttpContext().set(SKIP_AUTH, true)})
      .pipe<string>(tap(s => {
        sessionStorage['sessionToken'] = s;
        localStorage['authenticated'] = true;
      }));
  }

  public register(regModel: UserRegistrationModel){
    return this.httpClient.post<string>(this.apiService.SERVER_URL + "register", regModel, {context: new HttpContext().set(SKIP_AUTH, true)})
      .pipe<string>(tap(s => {
        sessionStorage['sessionToken'] = s;
        localStorage['authenticated'] = true;
      }));
  }

  public GetSessionToken(){
    return sessionStorage['sessionToken'];
  }

  public logout(){
    return this.httpClient.post(this.apiService.SERVER_URL + "logout", null)
      .pipe(tap(() => {
        sessionStorage.removeItem('sessionToken');
        sessionStorage.removeItem('userInfo');
        localStorage.removeItem('authenticated');
      }));
  }

  public refreshToken(): Observable<string> {
    return this.httpClient.get<string>(this.apiService.SERVER_URL + "refresh-token", { context: new HttpContext().set(SKIP_AUTH, true) })
      .pipe<string>(tap(s => {
        sessionStorage['sessionToken'] = s;
        localStorage['authenticated'] = true;
      }));
  }
}
