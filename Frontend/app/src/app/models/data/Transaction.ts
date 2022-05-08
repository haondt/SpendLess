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

    static GetErrors(transaction: TransactionModel): string{
        let errors = [];
        if (!transaction.date){
            errors.push("date");
        }

        let errorMessage = "";
        if (errors.length > 0){
            errorMessage = "The following fields must be populated: ";
            errorMessage += errors.join(", ");
        }

        return errorMessage;
    }
}