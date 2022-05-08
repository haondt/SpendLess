import { Component, ViewChild } from "@angular/core";
import { startWith } from "rxjs";
import { AccountModel } from "../models/data/Account";
import { TransactionModel } from "../models/data/Transaction";
import { AccountsService } from "../services/api/accounts.service";
import { TransactionsService } from "../services/api/transactions.service";
import { TransactionsAddComponent } from "./transactions-add/transactions-add.component";

@Component({
    selector: "app-transactions",
    templateUrl: './transactions.component.html',
    styleUrls: ['./transactions.component.scss']
})
export class TransactionsComponent {

  accounts: AccountModel[] = [];
  selectedAccount: AccountModel;
  mode: string;
  modes: Modes = new Modes();

  @ViewChild(TransactionsAddComponent)
  addComponent: TransactionsAddComponent;

  constructor(private accountsService: AccountsService, private transactionsService: TransactionsService) {
        this.accountsService.get().subscribe({
            next: a => this.accounts = a
        });
        this.mode = this.modes.none;
  }

  discard() {
    switch(this.mode){
      case this.modes.add:
        this.addComponent.data = [];
        break;
    }

    this.mode = this.modes.none;
  }

  save() {
    if (this.selectedAccount){
      switch(this.mode){
        case this.modes.add:
          this.transactionsService.create(this.selectedAccount.id, this.addComponent.data || [])
          break;
      }
    }

    this.mode = this.modes.none;
  }

}

class Modes {
  none: string = "none";
  add: string = "add";
  edit: string = "edit";
  import: string = "import";
}