import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { ApiService } from './api.service';
import { UserAuthenticationModel } from '../models/authentication/UserAuthenticationModel';

@Injectable({
  providedIn: 'root'
})
export class AuthenticationService {

  constructor(private httpClient: HttpClient,
    private apiService: ApiService) {}

  public login(authModel: UserAuthenticationModel){
    return this.httpClient.post<string>(this.apiService.SERVER_URL + "login", authModel,
    )
  }
}
