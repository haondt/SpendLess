import { Component, OnInit } from '@angular/core';
import { AccountModel } from '../models/data/Account';
import { AccountsService } from '../services/api/accounts.service';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ImportSettingsConfigurationDialogComponent } from '../import-settings-configuration-dialog/import-settings-configuration-dialog.component';
import { MatDialog } from '@angular/material/dialog';
import { ImportSettingsModel } from '../models/data/ImportSettings';
import { DatapointMappingsConfigurationDialogComponent } from '../datapoint-mappings-configuration-dialog/datapoint-mappings-configuration-dialog.component';
import { RowSelectorDialogComponent } from '../row-selector-dialog/row-selector-dialog.component';
import { map, Observable, of } from 'rxjs';
import { TransactionDatapointMappingModel } from '../models/data/TransactionDatapointMapping';
import { forkJoin } from 'rxjs';
import { GeneratorService } from '../services/generator.service';
import { MatSnackBar } from '@angular/material/snack-bar'

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
  modifiedDatapointMappings: { [key: string]: TransactionDatapointMappingModel[] } = {};

  constructor(private accountsService: AccountsService,
    private dialog: MatDialog,
    private snackBar: MatSnackBar,
    private generator: GeneratorService) { }

  ngOnInit(): void {
    this.waiting = true;
    this.accountsService.get().subscribe({
      next: a => {
        this.accounts = a;
        this.old_accounts = JSON.stringify(a);
        for (let a of this.accounts) {
          this.collapsed_accounts.add(a.id);
        }
        this.generateFormGroups();
        this.waiting = false;
      }
    });
  }

  generateFormGroups() {
    this.accountFormGroups = [];
    for (let a of this.accounts) {
      let formGroup = new FormGroup({
        name: new FormControl(a.name, [Validators.required]),
        balance: new FormControl(a.balance)
      });
      formGroup.valueChanges.subscribe(val => this.touch());
      this.accountFormGroups.push(formGroup);
    }
  }

  applyFormGroups() {
    for (let i in this.accounts) {
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
        this.modifiedDatapointMappings = {};
        this.updateCollapsedAccounts();
        this.generateFormGroups();
        this.waiting = false;
      }
    });
  }

  setAccounts() {
    this.waiting = true;
    this.applyFormGroups();
    for (let a of this.accounts) {
      a.traceId = a._temporaryId;
    }
    this.accountsService.set(this.accounts).subscribe({
      next: a => {
        let updateMappings$ = [];
        for (let _a of a) {
          if (this.modifiedDatapointMappings[_a.id]) {
            updateMappings$.push(this.accountsService.setMappings(_a.id, this.modifiedDatapointMappings[_a.id]));
          } else if (this.modifiedDatapointMappings[_a.traceId]) {
            updateMappings$.push(this.accountsService.setMappings(_a.id, this.modifiedDatapointMappings[_a.traceId]));
          }
        }

        (updateMappings$.length ? forkJoin(updateMappings$) : of([])).subscribe({
          next: m => {
            this.dirty = false;
            this.accounts = a;
            this.old_accounts = JSON.stringify(a);
            this.modifiedDatapointMappings = {};
            this.updateCollapsedAccounts();
            this.generateFormGroups();
            this.waiting = false;
          }
        })
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
    this.modifiedDatapointMappings = {};
    this.generateFormGroups();
    this.dirty = false;
  }

  touch() {
    this.dirty = true;
  }

  addAccount() {
    this.touch();
    let newAccount = new AccountModel();
    newAccount._temporaryId = this.generator.newGuid();
    console.log(newAccount._temporaryId);
    this.accounts.unshift(newAccount);
    let formGroup = new FormGroup({
      name: new FormControl('', [Validators.required]),
      balance: new FormControl(0)
    });
    formGroup.valueChanges.subscribe(val => this.touch());
    this.accountFormGroups.unshift(formGroup);
  }

  remove(account: AccountModel) {
    this.touch();
    delete this.modifiedDatapointMappings[account.id ?? account._temporaryId];
    let i = this.accounts.indexOf(account);
    this.accounts.splice(i, 1);
    this.accountFormGroups.splice(i, 1);
  }

  expandAccount(id: string) {
    this.collapsed_accounts.delete(id);
  }

  collapseAccount(id: string) {
    if (id) {
      this.collapsed_accounts.add(id);
    }
  }

  openImportSettingsConfigurationDialog(account: AccountModel) {
    let importSettings = new ImportSettingsModel();
    if (account.importSettings) {
      importSettings = JSON.parse(JSON.stringify(account.importSettings));
    }

    let dialogRef = this.dialog.open(ImportSettingsConfigurationDialogComponent, {
      data: { importSettings: importSettings },
      maxWidth: "100vw"
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        account.importSettings = importSettings
        this.touch();
      }
    });
  }

  getMappings(account: AccountModel): Observable<TransactionDatapointMappingModel[]> {
    let obs: Observable<TransactionDatapointMappingModel[]> = of([]);
    if (account.id) {
      if (this.modifiedDatapointMappings[account.id]) {
        obs = of(JSON.parse(JSON.stringify(this.modifiedDatapointMappings[account.id])));
      } else {
        obs = this.accountsService.getMappings(account.id);
      }
    } else if (account._temporaryId) {
      if (this.modifiedDatapointMappings[account._temporaryId]) {
        obs = of(JSON.parse(JSON.stringify(this.modifiedDatapointMappings[account._temporaryId])));
      }
    }
    return obs;
  }

  openTransactionDatapointMappingConfigurationDialog(account: AccountModel) {
    this.getMappings(account).subscribe({
      next: m => {
        let dialogRef = this.dialog.open(DatapointMappingsConfigurationDialogComponent, {
          data: { datapointMappings: m },
          maxWidth: "100vw"
        });

        dialogRef.afterClosed().subscribe(result => {
          if (result) {
            this.modifiedDatapointMappings[account.id ?? account._temporaryId] = result;
            this.touch();
          }
        });
      }
    });
  }

  openCopyTransactionDatapointMappingsDialog(account: AccountModel) {
    let others = this.accounts.filter(a => (a.id ?? a._temporaryId) != (account.id ?? account._temporaryId))
    let dialogRef = this.dialog.open(RowSelectorDialogComponent, {
      data: {
        title: "Select Account",
        objects: others.map(o => { return { viewValue: o.name, data: o }; })
      },
      maxWidth: "100vw"
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.getMappings(account).subscribe(mappings => {
          this.getMappings(result).subscribe(destinationMappings => {
            this.modifiedDatapointMappings[result.id ?? result._temporaryId] = destinationMappings.concat(mappings).slice();
            this.snackBar.open("Datapoint mappings copied to " + result.name, "Dismiss", { duration: 3000 });
          });
        });
      }
    });
  }
}
