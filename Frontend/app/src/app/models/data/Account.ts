import { ImportSettingsModel } from "./ImportSettings";

export class AccountModel {
    _temporaryId: string;
    traceId: string;
    id: string;
    name: string = "New Account";
    balance: number = 0;
    importSettings: ImportSettingsModel = new ImportSettingsModel();
}