import { Component, Inject, ViewEncapsulation } from "@angular/core";
import { FormGroup } from "@angular/forms";
import { RippleAnimationConfig } from "@angular/material/core";
import { MatDialogRef, MAT_DIALOG_DATA } from "@angular/material/dialog";
import { TransactionDatapointMappingModel } from "../models/data/TransactionDatapointMapping";

@Component({
    selector: 'app-datapoint-mappings-configuration-dialog',
    templateUrl: "./datapoint-mappings-configuration-dialog.component.html",
    styleUrls: ["./datapoint-mappings-configuration-dialog.component.scss"]
})
export class DatapointMappingsConfigurationDialogComponent {
    datapointMappings: TransactionDatapointMappingModel[];
    formGroup = new FormGroup({

    });
    tabOffset = "0";

    constructor(@Inject(MAT_DIALOG_DATA) private data: {datapointMappings: TransactionDatapointMappingModel[] },
        private dialogRef: MatDialogRef<DatapointMappingsConfigurationDialogComponent>){
            this.datapointMappings = [
                {
                    isDefault: true
                },
                {
                    isDefault: false
                },
                {
                    isDefault: true
                },
            ];
    }

    addMapping(){
        this.datapointMappings.push(new TransactionDatapointMappingModel());
    }

    editMapping(){
        this.tabOffset = "-100%";
    }

    returnToList(){
        this.tabOffset = "0";
    }
}