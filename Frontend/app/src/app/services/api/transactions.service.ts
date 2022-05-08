import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Observable } from "rxjs";
import { TransactionModel } from "src/app/models/data/Transaction";
import { ApiService } from "./api.service";

@Injectable({
    providedIn: 'root'
})
export class TransactionsService {
    constructor(private httpClient: HttpClient, private apiService: ApiService){}
    public create(accountId: string, transactions: TransactionModel[]): Observable<TransactionModel[]> {
        return this.httpClient.post<TransactionModel[]>(this.apiService.SERVER_URL + "accounts/" + accountId + "/transactions", transactions);
    }
}