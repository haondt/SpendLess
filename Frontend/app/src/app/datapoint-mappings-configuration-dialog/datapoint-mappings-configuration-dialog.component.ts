import { Component, ElementRef, Inject, OnInit, ViewChild, ViewEncapsulation } from "@angular/core";
import { FormControl, FormGroup } from "@angular/forms";
import { MatDialogRef, MAT_DIALOG_DATA } from "@angular/material/dialog";
import { highlight, languages } from "prismjs";
import { tap } from "rxjs";
import { TransactionDatapointMappingModel } from "../models/data/TransactionDatapointMapping";
import { Comparsions } from "../models/enums/ComparisonEnum";
import { Operation, Operations } from "../models/enums/OperationEnum";


@Component({
    selector: 'app-datapoint-mappings-configuration-dialog',
    templateUrl: "./datapoint-mappings-configuration-dialog.component.html",
    styleUrls: ["./datapoint-mappings-configuration-dialog.component.scss"]
})
export class DatapointMappingsConfigurationDialogComponent implements OnInit {
    datapointMappings: TransactionDatapointMappingModel[];
    editMappingFormGroup: FormGroup;

    private ignoreEvents: boolean = false;
    // offset value for sliding tabs
    tabOffset = "0";

    operations = Operations;
    comparisons = Comparsions;
    parserDatapoints: { [key: string]: { id: number, viewValue: string } } = {
        vendor: { id: 0, viewValue: "Vendor" },
        value: { id: 1, viewValue: "Value" },
        date: { id: 2, viewValue: "Date" },
        recurring: { id: 3, viewValue: "Recurring" },
        category: { id: 4, viewValue: "Category" },
        description: { id: 6, viewValue: "Description" },
    };

    parserOperations: { [key: string]: { id: number, viewValue: string } } = {
        is: { id: 0, viewValue: "is" },
        isColumn: { id: 1, viewValue: "is column" },
        parseColumn: { id: 2, viewValue: "parse column" }
    };
    availableParserOperations = [ this.parserOperations['is'] ];

    parserVendors: { id: string, viewValue: string, isNew: boolean }[] = [
        { id: "B7847220-682A-45DB-B44D-D1232F2C7E29", viewValue: "Amazon", isNew: false },
        { id: "1D2408AF-BB77-45CE-82AC-7166C42E66A5", viewValue: "Netflix", isNew: false },
        { id: "4E8E7444-500D-4C64-B576-5A3C73F67F2A", viewValue: "Costco", isNew: false }
    ];

    parserNewVendorString: string = "";

    parserCategories: { id: string, viewValue: string, isNew: boolean }[] = [
        { id: "AASDASD", viewValue: "Category A", isNew: false },
        { id: "BBSDBSD", viewValue: "Category B", isNew: false },
    ];

    parserNewCategoryString: string = "";

    parserAutocompleteOptions: {id: string, viewValue: string, isNew: boolean }[] = [];
    parserAutocompleteFilteredOptions: {id: string, viewValue: string, isNew: boolean }[] = [];
    parserAutocompletePlaceholder: string;


    @ViewChild('regexView') regexView: ElementRef;

    constructor(@Inject(MAT_DIALOG_DATA) private data: { datapointMappings: TransactionDatapointMappingModel[] },
        private dialogRef: MatDialogRef<DatapointMappingsConfigurationDialogComponent>) {
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

        this.editMappingFormGroup = new FormGroup({
            /* detector controls */
            regexControl: new FormControl(),

            /* parser controls */
            parserDatapointControl: new FormControl('', {initialValueIsDefault: true}),
            parserOperationControl: new FormControl(this.parserOperations['is'], {initialValueIsDefault: true}),
            parserAutocompleteControl: new FormControl(''),
        });

        this.editMappingFormGroup.controls['parserDatapointControl'].valueChanges.pipe(tap(v => {
            if (this.ignoreEvents){ return; }

            this.editMappingFormGroup.controls['parserOperationControl'].reset();
            if ([
                this.parserDatapoints['vendor'].id,
                this.parserDatapoints['recurring'].id,
                this.parserDatapoints['category'].id
            ].includes(v.id)){
                this.ignoreEvents = true;
                this.editMappingFormGroup.controls['parserOperationControl'].disable();
                this.ignoreEvents = false;
            } else {
                this.ignoreEvents = true;
                this.editMappingFormGroup.controls['parserOperationControl'].enable();
                this.ignoreEvents = false;

                if (v.id == this.parserDatapoints['description'].id){
                    this.availableParserOperations = [
                        this.parserOperations['is'],
                        this.parserOperations['isColumn'],
                        this.parserOperations['parseColumn']
                    ];
                } else {
                    this.availableParserOperations = [
                        this.parserOperations['is'],
                        this.parserOperations['parseColumn']
                    ];
                }
            }
        })).subscribe();

        this.editMappingFormGroup.controls['parserOperationControl'].valueChanges.pipe(tap(v => {
            if (this.ignoreEvents){ return; }

            this.ignoreEvents = true;
            this.editMappingFormGroup.controls['parserAutocompleteControl'].reset();
            this.parserNewVendorString = '';
            this.editMappingFormGroup.controls['parserAutocompleteControl'].disable();
            this.ignoreEvents = false;
            switch (this.editMappingFormGroup.controls['parserDatapointControl'].value.id){
                case this.parserDatapoints['vendor'].id:
                    this.parserAutocompletePlaceholder = 'Vendor';
                    this.parserAutocompleteOptions = this.parserVendors;
                    this.editMappingFormGroup.controls['parserAutocompleteControl'].enable();
                    break;
                case this.parserDatapoints['category'].id:
                    this.parserAutocompletePlaceholder = 'Category';
                    this.parserAutocompleteOptions = this.parserCategories;
                    this.editMappingFormGroup.controls['parserAutocompleteControl'].enable();
                    break;
            }
        })).subscribe();

        this.editMappingFormGroup.controls['parserAutocompleteControl'].valueChanges.pipe(tap(v => {
            if (this.ignoreEvents){ return; }

            let vStr = typeof(v) === 'string' ? v : v?.value;
            if (vStr == null){
                this.parserAutocompleteFilteredOptions = this.parserAutocompleteOptions.slice();
            } else {
                this.parserAutocompleteFilteredOptions = this.parserAutocompleteOptions.filter(o => o.viewValue.toLowerCase().includes(vStr.toLowerCase()))
            }

            let option = this.tryMatchParserAutocompleteValue(v, this.parserAutocompleteOptions);
            this.parserNewVendorString = '';
            if (option){
                if (option.isNew){
                    this.parserNewVendorString = option.viewValue;
                }
            }
        })).subscribe();

    }

    parserAutocompleteDisplayFunction(v: string | {viewValue: string} | undefined){
        return typeof(v) === 'string' ? v : v?.viewValue || '';
    }


    tryMatchParserAutocompleteValue(value: string | {id: string, viewValue: string, isNew: boolean} | undefined,
        values: {id: string, viewValue: string, isNew: boolean}[])
        : { id: string, viewValue: string, isNew: boolean } | undefined {
        if (!value){
            return undefined;
        }
        else if (typeof(value) === 'string'){
            // try to match case sensitive
            let caseSensitiveMatch = values.find(o => o.viewValue === value);
            if (caseSensitiveMatch){
                return caseSensitiveMatch;
            }
            // try to match case insensitive
            let caseInsensitiveMatch = values.find(o => o.viewValue.toLowerCase() === value.toLowerCase());
            if (caseInsensitiveMatch){
                return caseInsensitiveMatch;
            }
            // create new
            return {id: value.toLowerCase(), viewValue: value, isNew: true};

        } else {
            return value;
        }
    }

    ngOnInit(): void {
        this.editMappingFormGroup.controls['parserOperationControl'].disable();
        this.editMappingFormGroup.controls['parserAutocompleteControl'].disable();
    }

    /* mapping list */
    addMapping() {
        this.datapointMappings.push(new TransactionDatapointMappingModel());
    }

    editMapping() {
        this.tabOffset = "-100%";
    }

    returnToList() {
        this.tabOffset = "0";
    }

    updateRegexField() {
        this.regexView.nativeElement.innerHTML = highlight(this.editMappingFormGroup.controls['regexControl'].value, languages['regex'], 'regex');
    }

    /* edit mapping } */

    clearDetector(){

    }

    disableDetectorCondition(){

    }

    enableDetectorCondition(){

    }


}