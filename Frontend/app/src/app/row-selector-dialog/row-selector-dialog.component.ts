import { Component, Inject } from "@angular/core";
import { MatDialogRef, MAT_DIALOG_DATA } from "@angular/material/dialog";

@Component({
    selector: `app-row-selector-dialog`,
    templateUrl: './row-selector-dialog.component.html',
    styleUrls: ['./row-selector-dialog.component.scss'],
})
export class RowSelectorDialogComponent {
    title: string;
    objects: {viewValue: string, data: any}[];

    constructor(@Inject(MAT_DIALOG_DATA) data: {
        title: string,
        objects: {viewValue: string, data: any}[]
    }, private dialogRef: MatDialogRef<RowSelectorDialogComponent>) {
        this.title = data.title;
        this.objects = data.objects;
    }

    select(obj: any){
        this.dialogRef.close(obj);
    }

    cancel(){
        this.dialogRef.close();
    }
}