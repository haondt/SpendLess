import { Component, Inject } from "@angular/core";
import { FormControl, FormGroup } from "@angular/forms";
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from "@angular/material/dialog";
import { tap } from "rxjs";
import { ImportSettingsModel } from "../models/data/ImportSettings";

@Component({
    selector: 'app-import-settings-configuration-dialog',
    templateUrl: './import-settings-configuration-dialog.component.html',
    styleUrls: ['./import-settings-configuration-dialog.component.scss' ]
})
export class ImportSettingsConfigurationDialogComponent {
    importSettings: ImportSettingsModel;
    formGroup = new FormGroup({
        hasHeaderRow: new FormControl(false),
        hasHeaderColumn: new FormControl(false)
    });

    constructor(@Inject(MAT_DIALOG_DATA) private data: { importSettings: ImportSettingsModel },
        private dialogRef: MatDialogRef<ImportSettingsConfigurationDialogComponent>,
        ){
        this.importSettings = data.importSettings;
        this.loadForm();
        this.dialogRef.beforeClosed().subscribe(x => this.applyForm());
    }

    loadForm(){
        this.formGroup.controls['hasHeaderRow'].setValue(this.importSettings.hasHeaderRow);
        this.formGroup.controls['hasHeaderColumn'].setValue(this.importSettings.hasHeaderColumn);
    }

    applyForm(){
        this.importSettings.hasHeaderRow = this.formGroup.controls['hasHeaderRow'].value;
        this.importSettings.hasHeaderColumn = this.formGroup.controls['hasHeaderColumn'].value;
    }
}