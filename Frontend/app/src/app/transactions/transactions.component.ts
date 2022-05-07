import { Component } from "@angular/core";
import { AccountModel } from "../models/data/Account";
import { TransactionModel } from "../models/data/Transaction";
import { AccountsService } from "../services/api/accounts.service";
import { TransactionsModificationState } from "./transactions-modification-state";

@Component({
    selector: "app-transactions",
    templateUrl: './transactions.component.html',
    styleUrls: ['./transactions.component.scss']
})
export class TransactionsComponent {

  accounts: AccountModel[] = [];
  dirty: boolean = true;
  state: TransactionsModificationState;
  oldState: string;

  constructor(private accountsService: AccountsService) {
        this.accountsService.get().subscribe({
            next: a => this.accounts = a
        });

        this.state = new TransactionsModificationState();
        this.state.newTransactions.push(new TransactionModel());
        this.state.newTransactions[0].description = 'banananas';
        this.oldState = JSON.stringify(this.state);
  }

  discard() {
    this.state = JSON.parse(this.oldState);
  }

  save() {
    this.oldState = JSON.stringify(this.state);
  }

}