import { AfterContentInit, AfterViewChecked, AfterViewInit, Component, ElementRef, EventEmitter, Input, OnChanges, OnInit, Output, SimpleChanges, ViewChild } from "@angular/core";
import { MatPaginator } from "@angular/material/paginator";
import { TransactionModel } from "src/app/models/data/Transaction";
import { UserService } from "src/app/services/api/User.service";
import { TransactionsModificationState } from "../transactions-modification-state";

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

    @Input()
    state: TransactionsModificationState;
    @Output()
    stateChange = new EventEmitter<TransactionsModificationState>();

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
    }

    ngOnChanges(changes: SimpleChanges): void {
        if ('state' in changes){
            this.loadState(changes['state'].currentValue);
        }
    }

    loadState(state: TransactionsModificationState){
        for(let t of state.newTransactions){
            t._selected = false;
        }
        this.data = state.newTransactions.slice();
        this.selectAllCheckboxValue = false;
        this.paginate();
    }

    applyDataToState(){
        this.state.newTransactions = this.data;
        this.stateChange.emit(this.state);
    }

    refresh(){
        this.paginate();
        this.onSelectedChanged();
    }

    addTransaction() {
        this.data.unshift(new TransactionModel());
        this.refresh();
        this.applyDataToState();
    }

    removeTransaction(transaction: TransactionModel) {
        let i = this.data.indexOf(transaction, 0);
        if (i >= 0){
            this.data.splice(i, 1);
            this.refresh();
            this.applyDataToState();
        }
    }

    paginate() {
        let minIndex = 0;
        let maxIndex = Math.min(this.pageSizes[0]-1, this.data.length-1);
        if (this.paginator){
            minIndex = Math.max(this.paginator.pageIndex*this.paginator.pageSize, 0);
            maxIndex = Math.min(((this.paginator.pageIndex+1)*this.paginator.pageSize)-1, this.data.length);
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
        this.applyDataToState();
    }
}

