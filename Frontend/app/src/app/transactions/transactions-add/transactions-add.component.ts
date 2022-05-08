import { AfterContentInit, AfterViewChecked, AfterViewInit, Component, ElementRef, EventEmitter, Input, OnChanges, OnInit, Output, SimpleChanges, ViewChild } from "@angular/core";
import { MatPaginator } from "@angular/material/paginator";
import { CategoryModel } from "src/app/models/data/Category";
import { TransactionModel } from "src/app/models/data/Transaction";
import { UserService } from "src/app/services/api/User.service";

@Component({
    selector: 'app-transactions-add',
    templateUrl: './transactions-add.component.html',
    styleUrls: ['./transactions-add.component.scss']
})
export class TransactionsAddComponent {
    devMode: boolean = false;
    data: TransactionModel[] = [];
    paginatedData: TransactionModel[] = [];
    selectAllCheckboxValue: boolean;
    pageSizes = [10,25,50,100];

    vendors: string[] = [];
    vendorAutocompleteFilteredOptions: string[] = [];
    categories: string[] = [];
    categoryAutocompleteFilteredOptions: string[] = [];

    displayedColumns: string[] = [
        'date',
        'description'
    ];

    @ViewChild(MatPaginator) paginator: MatPaginator;

    constructor(private userService: UserService) {
        this.userService.getUserInfo().subscribe({
            next: ui => {
                if (ui.siteData.isDeveloper){
                    this.devMode = true;
                    this.displayedColumns.unshift('id');
                }
            }
        });

        userService.getCategories().subscribe({
            next: c => this.categories = c.map(_c => CategoryModel.unroll(_c)).flat().flat().map(_c => _c.name)
        });

        userService.getVendors().subscribe({
            next: v => this.vendors = v.map(_v => _v.name)
        });
    }

    refresh(){
        this.paginate();
        this.onSelectedChanged();
    }

    addTransaction() {
        this.data.unshift(new TransactionModel());
        this.refresh();
    }

    removeTransaction(transaction: TransactionModel) {
        let i = this.data.indexOf(transaction, 0);
        if (i >= 0){
            this.data.splice(i, 1);
            this.refresh();
        }
    }

    paginate() {
        let minIndex = 0;
        let maxIndex = Math.min(this.pageSizes[0]-1, this.data.length-1);
        if (this.paginator){
            minIndex = this.paginator.pageIndex*this.paginator.pageSize;
            if (minIndex < 0) {
                minIndex = 0;
                this.paginator.pageIndex = 0;
            }

            maxIndex = ((this.paginator.pageIndex+1)*this.paginator.pageSize)-1;
            if (maxIndex >= this.data.length) {
                this.paginator.pageIndex = Math.floor(Math.max(this.data.length-1, 0)/this.paginator.pageSize);
                minIndex = this.paginator.pageIndex*this.paginator.pageSize;
                maxIndex = Math.max(this.data.length-1, 0);
            }
        }
        this.paginatedData = this.data.slice(minIndex, maxIndex+1);
    }

    onSelectAllCheckboxChanged(){
        for(let i=0; i<this.data.length; i++){
            this.data[i]._selected = this.selectAllCheckboxValue;
        }
    }

    onSelectedChanged(){
        let allSelected = true;
        for(let i=0; i<this.data.length; i++){
            if (!this.data[i]._selected){
                allSelected = false;
                break;
            }
        }

        this.selectAllCheckboxValue = allSelected;
    }

    deleteSelected(){
        let copy = [];
        for(let t of this.data){
            if (!t._selected){
                copy.push(t);
            }
        }

        this.data = copy;
        this.refresh();
    }

    getErrors(transaction: TransactionModel): string{
        return TransactionModel.GetErrors(transaction);
    }

    getVendorOptions(transaction: TransactionModel): string[] {
        let vStr = transaction.vendor?.toLowerCase();
        if(vStr){
            return this.vendors.filter(o => o.toLowerCase().includes(vStr));
        }
        return this.vendors;
    }

    getCategoryOptions(transaction: TransactionModel): string[] {
        let vStr = transaction.category?.toLowerCase();
        if(vStr){
            return this.categories.filter(o => o.toLowerCase().includes(vStr));
        }
        return this.categories;
    }

}

