import { Component, OnInit } from '@angular/core';
import { AccountModel } from '../models/data/Account';
import { AccountsService } from '../services/api/accounts.service';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ImportSettingsConfigurationDialogComponent } from '../import-settings-configuration-dialog/import-settings-configuration-dialog.component';
import { MatDialog } from '@angular/material/dialog';
import { ImportSettingsModel } from '../models/data/ImportSettings';

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
  accountFormGroups: FormGroup[] = [];

  constructor(private accountsService: AccountsService, private dialog: MatDialog) { }

  ngOnInit(): void {
    this.waiting = true;
    this.accountsService.get().subscribe({
      next: a => {
        this.accounts = a;
        this.old_accounts = JSON.stringify(a);
        for(let a of this.accounts){
          this.collapsed_accounts.add(a.id);
        }
        this.generateFormGroups();
        this.waiting = false;
      }
    });
  }

  generateFormGroups() {
    this.accountFormGroups = [];
    for(let a of this.accounts){
      let formGroup = new FormGroup({
        name: new FormControl(a.name, [Validators.required]),
        balance: new FormControl(a.balance)
      });
      formGroup.valueChanges.subscribe(val => this.touch());
      this.accountFormGroups.push(formGroup);
    }
  }

  applyFormGroups() {
    for(let i in this.accounts){
      this.accounts[i].name = this.accountFormGroups[i].controls['name'].value;
      this.accounts[i].balance = this.accountFormGroups[i].controls['balance'].value;
    }
  }

  getAccounts() {
    this.waiting = true;
    this.accountsService.get().subscribe({
      next: a => {
        this.dirty = false;
        this.accounts = a;
        this.old_accounts = JSON.stringify(a);
        this.updateCollapsedAccounts();
        this.generateFormGroups();
        this.waiting = false;
      }
    });
  }

  setAccounts() {
    this.waiting = true;
    this.applyFormGroups();
    this.accountsService.set(this.accounts).subscribe({
      next: a => {
        this.dirty = false;
        this.accounts = a;
        this.old_accounts = JSON.stringify(a);
        this.updateCollapsedAccounts();
        this.generateFormGroups();
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
    this.generateFormGroups();
    this.dirty = false;
  }

  touch() {
    this.dirty = true;
  }

  addAccount() {
    this.touch();
    this.accounts.unshift(new AccountModel());
    let formGroup = new FormGroup({
        name: new FormControl('', [Validators.required]),
        balance: new FormControl(0)
    });
    formGroup.valueChanges.subscribe(val => this.touch());
    this.accountFormGroups.unshift(formGroup);
  }

  remove(account: AccountModel) {
    this.touch();
    let i = this.accounts.indexOf(account);
    this.accounts.splice(i, 1);
    this.accountFormGroups.splice(i, 1);
  }

  expandAccount(id: string){
    this.collapsed_accounts.delete(id);
  }

  collapseAccount(id: string){
    if(id){
      this.collapsed_accounts.add(id);
    }
  }

  openImportSettingsConfigurationDialog(account: AccountModel){
    let importSettings = new ImportSettingsModel();
    if(account.importSettings){
      importSettings = JSON.parse(JSON.stringify(account.importSettings));
    }

    let dialogRef = this.dialog.open(ImportSettingsConfigurationDialogComponent, {
      data : {importSettings: importSettings}
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result){
        account.importSettings = importSettings
        this.touch();
      }
    });

  }

  openTransactionDatapointMappingConfigurationDialog(account: AccountModel){
    this.touch();
  }
}
