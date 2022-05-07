import { TransactionModel } from "../models/data/Transaction";

export class TransactionsModificationState {
    newTransactions: TransactionModel[] = [];
    deletedTransactions: TransactionModel[] = [];
    modifiedTransactions: TransactionModel[] = [];
}