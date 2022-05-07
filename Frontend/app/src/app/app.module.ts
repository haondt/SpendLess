import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { HttpClientModule } from '@angular/common/http';
import { LoginComponent } from './login/login.component';
import { HomeComponent } from './home/home.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { LayoutModule } from '@angular/cdk/layout';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatButtonModule } from '@angular/material/button';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatIconModule } from '@angular/material/icon';
import { MatListModule } from '@angular/material/list';
import { NavComponent } from './nav/nav.component';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { FormsModule } from '@angular/forms';
import { ReactiveFormsModule } from '@angular/forms';
import { httpInterceptorProviders } from './services/http-interceptors';
import { MatMenuModule } from '@angular/material/menu';
import { DashboardComponent } from './dashboard/dashboard.component';
import { MatGridListModule } from '@angular/material/grid-list';
import { MatCardModule } from '@angular/material/card';
import { GridsterModule } from 'angular-gridster2';
import { DefaultWindowComponent } from './dashboard/windows/default-window/default-window.component';
import { AccountsComponent } from './accounts/accounts.component';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatDialogModule } from '@angular/material/dialog';
import { ImportSettingsConfigurationDialogComponent } from './import-settings-configuration-dialog/import-settings-configuration-dialog.component';
import { MaterialInputComponent } from './material-components/input/input.component';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { DatapointMappingsConfigurationDialogComponent } from './datapoint-mappings-configuration-dialog/datapoint-mappings-configuration-dialog.component';
import { RowSelectorDialogComponent } from './row-selector-dialog/row-selector-dialog.component';
import { MatRippleModule } from '@angular/material/core';
import { MatTabsModule } from '@angular/material/tabs';
import { MatRadioModule } from '@angular/material/radio';
import { MatSelectModule } from '@angular/material/select';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { TransactionImportComponent } from './transactions/transaction-import/transaction-import.component';
import { TransactionsComponent } from './transactions/transactions.component';
import { TransactionsEditComponent } from './transactions/transactions-edit/transactions-edit.component';
import { TransactionsAddComponent } from './transactions/transactions-add/transactions-add.component';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatChipsModule } from '@angular/material/chips';
import { MatTableModule } from '@angular/material/table';
import { MatTooltip, MatTooltipModule } from '@angular/material/tooltip';

import 'prismjs/components/prism-css';
import 'prismjs/components/prism-javascript';
import 'prismjs/components/prism-typescript';
import 'prismjs/components/prism-scss';
import 'prismjs/components/prism-regex';

@NgModule({
  declarations: [
    AppComponent,
    LoginComponent,
    HomeComponent,
    NavComponent,
    DashboardComponent,
    DefaultWindowComponent,
    AccountsComponent,
    ImportSettingsConfigurationDialogComponent,
    MaterialInputComponent,
    DatapointMappingsConfigurationDialogComponent,
    RowSelectorDialogComponent,
    TransactionImportComponent,
    TransactionsComponent,
    TransactionsEditComponent,
    TransactionsAddComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,
    BrowserAnimationsModule,
    LayoutModule,
    MatToolbarModule,
    MatButtonModule,
    MatSidenavModule,
    MatIconModule,
    MatListModule,
    MatFormFieldModule,
    MatInputModule,
    FormsModule,
    ReactiveFormsModule,
    MatMenuModule,
    MatGridListModule,
    MatCardModule,
    GridsterModule,
    MatExpansionModule,
    MatDialogModule,
    MatCheckboxModule,
    MatRippleModule,
    MatTabsModule,
    MatRadioModule,
    MatSelectModule,
    MatAutocompleteModule,
    MatDatepickerModule,
    MatNativeDateModule,
    MatSnackBarModule,
    MatPaginatorModule,
    MatChipsModule,
    MatTableModule,
    MatTooltipModule
  ],
  providers: [httpInterceptorProviders],
  bootstrap: [AppComponent]
})
export class AppModule { }
