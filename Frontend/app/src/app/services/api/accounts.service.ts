import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { AccountModel } from "src/app/models/data/Account";
import { ApiService } from "./api.service";

@Injectable({
    providedIn: 'root'
})
export class AccountsService {
    constructor(private httpClient: HttpClient, private apiService: ApiService){ }
    public get(){
        return this.httpClient.get<AccountModel[]>(this.apiService.SERVER_URL + "accounts");
    }
    public set(accounts: AccountModel[]){
        return this.httpClient.post<AccountModel[]>(this.apiService.SERVER_URL + "accounts", accounts);
    }
}