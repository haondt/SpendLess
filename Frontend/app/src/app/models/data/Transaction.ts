import { DecimalPipe } from "@angular/common";

export class TransactionModel {
    id: string;
    importHash?: string;
    vendor: string;
    value: number;
    date: string;
    recurring: boolean;
    category: string;
    description: string;
    _selected: boolean;
}