import { Component, OnInit } from '@angular/core';
import { AccountModel } from '../models/data/Account';
import { AccountsService } from '../services/api/accounts.service';

@Component({
  selector: 'app-accounts',
  templateUrl: './accounts.component.html',
  styleUrls: ['./accounts.component.scss']
})
export class AccountsComponent implements OnInit {
  old_accounts: string = '[]';
  accounts: AccountModel[] = [];
  dirty: boolean = false;
  waiting: boolean = false;
  collapsed_accounts: Set<string> = new Set<string>();

  constructor(private accountsService: AccountsService) { }

  ngOnInit(): void {
    this.waiting = true;
    this.accountsService.get().subscribe({
      next: a => {
        this.accounts = a;
        this.old_accounts = JSON.stringify(a);
        for(let a of this.accounts){
          this.collapsed_accounts.add(a.id);
        }
        this.waiting = false;
      }
    });
  }

  getAccounts() {
    this.waiting = true;
    this.accountsService.get().subscribe({
      next: a => {
        this.dirty = false;
        this.accounts = a;
        this.old_accounts = JSON.stringify(a);
        this.updateCollapsedAccounts();
        this.waiting = false;
      }
    });
  }

  setAccounts() {
    this.waiting = true;
    this.accountsService.set(this.accounts).subscribe({
      next: a => {
        this.dirty = false;
        this.accounts = a;
        this.old_accounts = JSON.stringify(a);
        this.updateCollapsedAccounts();
        this.waiting = false;
      }
    });
  }

  updateCollapsedAccounts() {
    let ex = Array.from(this.collapsed_accounts);
    this.collapsed_accounts = new Set<string>();
    for (let aid of ex) {
      let i = this.accounts.findIndex(am => am.id === aid);
      if (i > -1) {
        this.collapsed_accounts.add(aid)
      }
    }
  }

  resetAccounts() {
    this.accounts = JSON.parse(this.old_accounts);
    this.dirty = false;
  }

  touch() {
    this.dirty = true;
  }

  addAccount() {
    this.touch();
    var newAccountModel = new AccountModel();
    newAccountModel.name = "This is a placeholder";
    newAccountModel.balance = 0;
    this.accounts.unshift(newAccountModel);
  }

  remove(account: AccountModel) {
    this.touch();
    this.accounts.splice(this.accounts.indexOf(account), 1);
  }

  expandAccount(id: string){
    this.collapsed_accounts.delete(id);
  }

  collapseAccount(id: string){
    if(id){
      this.collapsed_accounts.add(id);
    }
  }
}
