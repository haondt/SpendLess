import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Observable } from "rxjs";
import { AccountModel } from "src/app/models/data/Account";
import { TransactionDatapointMappingModel } from "src/app/models/data/TransactionDatapointMapping";
import { ApiService } from "./api.service";

@Injectable({
    providedIn: 'root'
})
export class AccountsService {
    constructor(private httpClient: HttpClient, private apiService: ApiService){ }
    public get(): Observable<AccountModel[]>{
        return this.httpClient.get<AccountModel[]>(this.apiService.SERVER_URL + "accounts");
    }
    public set(accounts: AccountModel[]): Observable<AccountModel[]> {
        return this.httpClient.post<AccountModel[]>(this.apiService.SERVER_URL + "accounts", accounts);
    }
    public getMappings(accountId: string) : Observable<TransactionDatapointMappingModel[]> {
        return this.httpClient.get<TransactionDatapointMappingModel[]>(this.apiService.SERVER_URL + "accounts/" + accountId + "/mappings");
    }
    public setMappings(accountId: string, mappings: TransactionDatapointMappingModel[]) : Observable<TransactionDatapointMappingModel[]> {
        return this.httpClient.post<TransactionDatapointMappingModel[]>(this.apiService.SERVER_URL + "accounts/" + accountId + "/mappings", mappings);
    }
}