import { ImportMappingModel } from "./ImportMapping";

export class AccountModel {
    id: string;
    name: string;
    balance: number;
    importMapping: ImportMappingModel;
    transactionDatapointMappings: string[];
}