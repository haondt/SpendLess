import { ImportMappingModel } from "./ImportMapping";

export class AccountModel {
    id: string;
    name: string = "New Account";
    balance: number = 0;
    importMapping: ImportMappingModel;
    transactionDatapointMappings: string[] = [];
}