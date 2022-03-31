import { ImportSettingsModel } from "./ImportSettings";

export class AccountModel {
    id: string;
    name: string = "New Account";
    balance: number = 0;
    importSettings: ImportSettingsModel = new ImportSettingsModel();
    transactionDatapointMappings: string[] = [];
}