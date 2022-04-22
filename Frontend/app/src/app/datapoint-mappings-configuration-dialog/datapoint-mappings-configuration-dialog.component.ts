import { DIR_DOCUMENT_FACTORY } from "@angular/cdk/bidi/dir-document-token";
import { Parser } from "@angular/compiler";
import { Component, ElementRef, Inject, OnInit, ViewChild, ViewEncapsulation } from "@angular/core";
import { TestModuleMetadata } from "@angular/core/testing";
import { FormControl, FormGroup, Validators } from "@angular/forms";
import { MatDialogRef, MAT_DIALOG_DATA } from "@angular/material/dialog";
import { highlight, languages } from "prismjs";
import { tap } from "rxjs";
import { CategoryModel } from "../models/data/Category";
import { SiteData } from "../models/data/SiteData";
import { TransactionDatapointMappingModel } from "../models/data/TransactionDatapointMapping";
import { DetectorComparisons } from "../models/enums/DetectorComparisons";
import { DetectorOperations } from "../models/enums/DetectorOperations";
import { ParserDatapoints } from "../models/enums/ParserDatapoints";
import { ParserOperations } from "../models/enums/ParserOperations";
import { ViewEnum } from "../models/enums/ViewEnum";
import { UserService } from "../services/api/User.service";
import { DialogMappingFormComponent, IDialogMappingFormComponent } from "./datapoint-mapping-form-component";


@Component({
    selector: 'app-datapoint-mappings-configuration-dialog',
    templateUrl: "./datapoint-mappings-configuration-dialog.component.html",
    styleUrls: ["./datapoint-mappings-configuration-dialog.component.scss"]
})
export class DatapointMappingsConfigurationDialogComponent implements OnInit {
    datapointMappings: TransactionDatapointMappingModel[];
    selectedMapping: TransactionDatapointMappingModel | null;
    editMappingFormGroup: FormGroup;
    rootDetector: IDialogMappingFormComponent;
    rootParser: IDialogMappingFormComponent;

    // offset value for sliding tabs
    tabOffset = "0";

    detectorOperations = DetectorOperations;
    comparisons = DetectorComparisons;
    parserDatapoints = ParserDatapoints;

    parserOperations = ParserOperations;
    availableParserOperations = [ ParserOperations['is'] ];

    parserVendors: { value: string, isNew: boolean }[] = [];

    parserCategories: { value: string, isNew: boolean }[] = [];

    parserAutocompleteOptions: {value: string, isNew: boolean }[] = [];
    parserAutocompleteFilteredOptions: {value: string, isNew: boolean }[] = [];
    parserAutocompletePlaceholder: string;
    parserNewAutocompleteString: string = "";

    @ViewChild('detectorRegexView') detectorRegexView: ElementRef;
    @ViewChild('parserRegexView') parserRegexView: ElementRef;
    @ViewChild('jsonView') jsonView: ElementRef;

    devMode: boolean = false;

    constructor(@Inject(MAT_DIALOG_DATA) data: { datapointMappings: TransactionDatapointMappingModel[] },
        private dialogRef: MatDialogRef<DatapointMappingsConfigurationDialogComponent>, userService: UserService) {

        this.datapointMappings = data.datapointMappings;
        userService.getUserInfo().subscribe({
            next: ui => this.devMode = ui.siteData.isDeveloper
        })


        userService.getCategories().subscribe({
            next: c => this.parserCategories = c.map(_c => CategoryModel.unroll(_c)).flat().flat().map(_c => {
                return {
                    value: _c.name,
                    isNew: false
                };
            })
        });

        userService.getVendors().subscribe({
            next: v => this.parserVendors = v.map(_v => {
                return {
                    value: _v.name,
                    isNew: false
                }
            })
        });

        let formControls = {
            // detector controls
            detectorDefaultControl: new FormControl('always', {initialValueIsDefault: true}),
            detectorColumnControl: new FormControl(),
            detectorOperationControl: new FormControl(this.detectorOperations['isNotEmpty'], {initialValueIsDefault: true}),
            detectorRegexControl: new FormControl(),
            detectorComparisonControl: new FormControl(),
            detectorValueControl: new FormControl(),
            detectorCheckboxControl: new FormControl(false, {initialValueIsDefault: true}),

            // parser controls
            parserDatapointControl: new FormControl('', {initialValueIsDefault: true}),
            parserOperationControl: new FormControl(this.parserOperations['is'], {initialValueIsDefault: true}),
            parserAutocompleteControl: new FormControl(''),
            parserCurrencyControl: new FormControl(0, {initialValueIsDefault: true}),
            parserColumnControl: new FormControl(),
            parserCheckboxControl: new FormControl(false, {initialValueIsDefault: true}),
            parserDatepickerControl: new FormControl(),
            parserRecurringControl: new FormControl('recurring', {initialValueIsDefault: true}),
            parserTextControl: new FormControl(),
            parserRegexControl: new FormControl(),
        };

        this.editMappingFormGroup = new FormGroup(formControls);

        // Detector setup

        let detectorRegexComponent = new DialogMappingFormComponent<string>(formControls.detectorRegexControl, {
            setInMapping: (m, s) => m.detectorStringValue = s ?? "",
            getFromMapping: m => m.detectorStringValue,
        })

        formControls.detectorRegexControl.valueChanges.pipe(tap(v => {
            if (this.detectorRegexView){
                if (v){
                    this.detectorRegexView.nativeElement.innerHTML = highlight(v, languages['regex'], 'regex');
                    this.detectorRegexView.nativeElement.parentNode.classList.add('regex-view');
                } else {
                    this.detectorRegexView.nativeElement.innerHTML = '';
                    this.detectorRegexView.nativeElement.parentNode.classList.remove('regex-view');
                }
            }
        })).subscribe();

        let detectorCheckboxComponent = new DialogMappingFormComponent<boolean>(formControls.detectorCheckboxControl, {
            setInMapping: (m, s) => m.detectorValueIsNumeric = s ?? false,
            getFromMapping: m => m.detectorValueIsNumeric
        });

        let detectorValueComponent = new DialogMappingFormComponent<string>(formControls.detectorValueControl, {
            generateSummary: s => s ?? "",
            setInMapping: (m, s) => m.detectorStringValue = s ?? "",
            getFromMapping: m => m.detectorStringValue,
            childSelector: _ => detectorCheckboxComponent
        });

        let detectorComparisonComponent = new DialogMappingFormComponent<ViewEnum>(formControls.detectorComparisonControl, {
            generateSummary: s => s?.viewValue ?? "",
            setInMapping: (m, s) => m.detectorComparison = s?.id ?? -1,
            getFromMapping: m => this.findItemById(DetectorComparisons, m.detectorComparison),
            childSelector: _ => detectorValueComponent
        });

        let detectorOperationComponent = new DialogMappingFormComponent<ViewEnum>(formControls.detectorOperationControl, {
            generateSummary: s => s ? s.viewValue : "",
            setInMapping: (m, s) => m.detectorOperation = s?.id ?? -1,
            getFromMapping: m => this.findItemById(DetectorOperations, m.detectorOperation),
            childSelector: (p, s) => {
                if (s){
                    switch(s.id){
                        case DetectorOperations['matchesRegularExpression'].id:
                            return detectorRegexComponent;
                        case DetectorOperations['is'].id:
                            return detectorComparisonComponent;
                    }
                }
                return undefined;
            },
            resetValueWhenParentValueChanges: false
        });

        let detectorColumnComponent = new DialogMappingFormComponent<number>(formControls.detectorColumnControl, {
            generateSummary: s => ''+s,
            setInMapping: (m, s) => m.detectorColumn = s,
            getFromMapping: m => m.detectorColumn,
            childSelector: (p, s) => detectorOperationComponent
        });

        this.rootDetector = new DialogMappingFormComponent<string>(formControls.detectorDefaultControl, {
            generateSummary: s => s == 'always' ? 'Always' : 'Column',
            setInMapping: (m, s) => m.isDefault = s == 'always',
            getFromMapping: m => m.isDefault ? 'always' : 'condition',
            childSelector: (p, s) => {
                if (s == 'condition') {
                    return detectorColumnComponent;
                }
                return undefined;
            }
        });

        // parser setup

        let parserAutocompleteComponent = new DialogMappingFormComponent<{value: string, isNew: boolean} | string>(formControls.parserAutocompleteControl, {
            generateSummary: s => {
                if (s){
                    if (typeof(s) == 'string'){
                        return s;
                    } else {
                        return s.value;
                    }
                }
                return "";
            },
            setInMapping: (m, s) => {
                if (s){
                    let datapoint: ViewEnum | undefined = this.rootParser.getSelection();
                    if (datapoint){
                        switch(datapoint.id){
                            case ParserDatapoints['vendor'].id:
                                let vendor = this.AddNewVendorIfRequired(s);
                                if (vendor){
                                    m.parserStringValue = vendor.value;
                                }
                            break;
                            case ParserDatapoints['category'].id:
                                let category = this.AddNewCategoryIfRequired(s);
                                if (category){
                                    m.parserStringValue = category.value;
                                }
                            break;
                        }
                    }
                }
            },
            getFromMapping: m => {
                let datapoint: ViewEnum | undefined = this.rootParser.getSelection();
                if (datapoint){
                    switch(datapoint.id){
                        case ParserDatapoints['vendor'].id:
                            return this.parserVendors.find(e => e.value == m.parserStringValue) ?? m.parserStringValue;
                        case ParserDatapoints['category'].id:
                            return this.parserCategories.find(e => e.value == m.parserStringValue) ?? m.parserStringValue;
                    }
                }
                return undefined;
            },
        });

        formControls.parserAutocompleteControl.valueChanges.pipe(tap(v => {
            let vStr = typeof(v) === 'string' ? v : v?.value;
            if (vStr == null){
                this.parserAutocompleteFilteredOptions = this.parserAutocompleteOptions.slice();
            } else {
                this.parserAutocompleteFilteredOptions = this.parserAutocompleteOptions.filter(o => o.value.toLowerCase().includes(vStr.toLowerCase()))
            }

            let option = this.tryMatchParserAutocompleteValue(v, this.parserAutocompleteOptions);
            this.parserNewAutocompleteString = '';
            if (option){
                if (option.isNew){
                    this.parserNewAutocompleteString = option.value;
                }
            }
        })).subscribe();

        let parserCurrencyComponent = new DialogMappingFormComponent<number>(formControls.parserCurrencyControl, {
            generateSummary: s => ''+s,
            setInMapping: (m, s) => m.parserNumericValue = s ?? 0,
            getFromMapping: m => m.parserNumericValue
        });

        let parserCheckboxComponent = new DialogMappingFormComponent<boolean>(formControls.parserCheckboxControl, {
            generateSummary: s => s ? '×-1' : '',
            setInMapping: (m, s) => m.parserInvertValue = s ?? false,
            getFromMapping: m => m.parserInvertValue
        });

        let parserRegexComponent = new DialogMappingFormComponent<string>( formControls.parserRegexControl, {
            generateSummary: s => s ?? '',
            setInMapping: (m, s) => m.parserStringValue = s ?? '',
            getFromMapping: m => m.parserStringValue,
            resetValueWhenParentValueChanges: false
        });

        formControls.parserRegexControl.valueChanges.pipe(tap(v => {
            if (this.parserRegexView){
                if (v){
                    this.parserRegexView.nativeElement.innerHTML = highlight(v, languages['regex'], 'regex');
                    this.parserRegexView.nativeElement.parentNode.classList.add('regex-view');
                } else {
                    this.parserRegexView.nativeElement.innerHTML = '';
                    this.parserRegexView.nativeElement.parentNode.classList.remove('regex-view');
                }
            }
        })).subscribe();

        let parserColumnComponent = new DialogMappingFormComponent<number>(formControls.parserColumnControl, {
            generateSummary: s => ''+s,
            setInMapping: (m, s) => m.parserColumn = s,
            getFromMapping: m => m.parserColumn,
            childSelector: (p, s) => {
                let datapoint: ViewEnum | undefined = p?.parent?.getSelection();
                let operation: ViewEnum | undefined = p?.getSelection();
                if (datapoint){
                    switch(datapoint.id){
                        case ParserDatapoints['value'].id:
                            return parserCheckboxComponent;
                        case ParserDatapoints['description'].id:
                            if (operation){
                                if (operation.id == ParserOperations['parseColumn'].id){
                                    return parserRegexComponent;
                                }
                            }
                    }
                }
                return undefined;
            }
        });

        let parserDatepickerComponent = new DialogMappingFormComponent<Date>(formControls.parserDatepickerControl, {
            generateSummary: s => (<Date>s)?.toLocaleDateString(),
            setInMapping: (m, s) => m.parserDateTimeValue = (<Date>s)?.toISOString() ?? new Date().toISOString(),
            getFromMapping: m => m.parserDateTimeValue ? new Date(m.parserDateTimeValue) : undefined
        });

        let parserRecurringComponent = new DialogMappingFormComponent<string>(formControls.parserRecurringControl, {
            generateSummary: s => s ?? 'recurring',
            setInMapping: (m, s) => m.parserBoolValue = s == 'recurring',
            getFromMapping: m => m.parserBoolValue ? 'recurring' : 'not recurring'
        });

        let parserTextComponent = new DialogMappingFormComponent<string>( formControls.parserTextControl, {
            generateSummary: s => s ?? '',
            setInMapping: (m, s) => m.parserStringValue = s ?? '',
            getFromMapping: m => m.parserStringValue
        });

        let parserOperationComponent = new DialogMappingFormComponent<ViewEnum>(formControls.parserOperationControl, {
            generateSummary: s => s?.viewValue ?? '',
            setInMapping: (m, s) => m.parserOperation = s?.id ?? -1,
            getFromMapping: m => this.findItemById(ParserOperations, m.parserOperation),
            childSelector: (p, s) => {
                let parentSelection: ViewEnum | undefined = p?.getSelection();
                if (parentSelection){
                    switch(parentSelection.id){
                        case ParserDatapoints['vendor'].id:
                        case ParserDatapoints['category'].id:
                            return parserAutocompleteComponent;
                        case ParserDatapoints['value'].id:
                            if (s){
                                switch(s.id) {
                                    case ParserOperations['is'].id:
                                        return parserCurrencyComponent;
                                    case ParserOperations['parseColumn'].id:
                                        return parserColumnComponent;
                                }
                            }
                            break;
                        case ParserDatapoints['date'].id:
                            if (s){
                                switch(s.id) {
                                    case ParserOperations['is'].id:
                                        return parserDatepickerComponent;
                                    case ParserOperations['parseColumn'].id:
                                        return parserColumnComponent;
                                }
                            }
                            break;
                        case ParserDatapoints['recurring'].id:
                            return parserRecurringComponent;
                        case ParserDatapoints['description'].id:
                            if (s){
                                switch(s.id) {
                                    case ParserOperations['is'].id:
                                        return parserTextComponent;
                                    case ParserOperations['parseColumn'].id:
                                    case ParserOperations['isColumn'].id:
                                        return parserColumnComponent;
                                }
                            }
                            break;
                    }
                }

                return undefined;
            }
        });

        formControls.parserOperationControl.valueChanges.pipe(tap(v => {
            switch(formControls.parserDatapointControl.value?.id) {
                case ParserDatapoints['vendor'].id:
                    this.parserAutocompletePlaceholder = 'Vendor';
                    this.parserAutocompleteOptions = this.parserVendors;
                    this.parserAutocompleteFilteredOptions = this.parserAutocompleteOptions.slice();
                    break;
                case ParserDatapoints['category'].id:
                    this.parserAutocompletePlaceholder = 'Category';
                    this.parserAutocompleteOptions = this.parserCategories;
                    this.parserAutocompleteFilteredOptions = this.parserAutocompleteOptions.slice();
                    break;
                case ParserDatapoints['description'].id:
                    switch(v.id){
                        case this.parserOperations['is'].id:
                            this.editMappingFormGroup.controls['parserTextControl'].enable();
                            break;
                        case this.parserOperations['isColumn'].id:
                            this.editMappingFormGroup.controls['parserColumnControl'].enable();
                            break;
                        case this.parserOperations['parseColumn'].id:
                            this.editMappingFormGroup.controls['parserColumnControl'].enable();
                            this.editMappingFormGroup.controls['parserRegexControl'].enable();
                            break;
                    }
                    break;

            }
        })).subscribe();

        this.rootParser = new DialogMappingFormComponent<ViewEnum>(formControls.parserDatapointControl, {
            generateSummary: s => s?.viewValue ?? '',
            setInMapping: (m, s) => m.parserDatapoint = s?.id,
            getFromMapping: m => this.findItemById(ParserDatapoints, m.parserDatapoint),
            childSelector: _ => parserOperationComponent
        });

        formControls.parserDatapointControl.valueChanges.pipe(tap(v => {
            this.availableParserOperations = [
                ParserOperations['is']
            ];
            if (v){
                switch (v.id){
                    case ParserDatapoints['value'].id:
                    case ParserDatapoints['date'].id:
                        this.availableParserOperations = [
                            ParserOperations['is'],
                            ParserOperations['parseColumn']
                        ];
                        break;
                    case ParserDatapoints['description'].id:
                        this.availableParserOperations = [
                            ParserOperations['is'],
                            ParserOperations['isColumn'],
                            ParserOperations['parseColumn']
                        ];
                        break;
                }
            }
        })).subscribe();

        this.rootDetector.disable();
        detectorColumnComponent.disable();
        detectorOperationComponent.disable();
        detectorRegexComponent.disable();
        detectorComparisonComponent.disable();
        detectorValueComponent.disable();
        detectorCheckboxComponent.disable();

        this.rootParser.disable();
        parserOperationComponent.disable();
        parserAutocompleteComponent.disable();
        parserCurrencyComponent.disable();
        parserColumnComponent.disable();
        parserCheckboxComponent.disable();
        parserDatepickerComponent.disable();
        parserRecurringComponent.disable();
        parserTextComponent.disable();
        parserRegexComponent.disable();
    }

    parserAutocompleteDisplayFunction(v: string | {viewValue: string} | undefined){
        return typeof(v) === 'string' ? v : v?.viewValue || '';
    }


    tryMatchParserAutocompleteValue(value: string | {value: string, isNew: boolean} | undefined,
        values: {value: string, isNew: boolean}[])
        : { value: string, isNew: boolean } | undefined {
        if (!value){
            return undefined;
        }
        else if (typeof(value) === 'string'){
            // try to match case sensitive
            let caseSensitiveMatch = values.find(o => o.value === value);
            if (caseSensitiveMatch){
                return caseSensitiveMatch;
            }
            // try to match case insensitive
            let caseInsensitiveMatch = values.find(o => o.value.toLowerCase() === value.toLowerCase());
            if (caseInsensitiveMatch){
                return caseInsensitiveMatch;
            }
            // create new
            return {value: value, isNew: true};

        } else {
            return value;
        }
    }

    ngOnInit(): void {
        this.rootDetector.enable();
        this.rootParser.enable();
        for (let mapping of this.datapointMappings){
            this.loadMapping(mapping); // load once to generate summaries
        }
    }

    /* mapping list */
    addMapping() {
        let newDPM = new TransactionDatapointMappingModel();
        newDPM.isDefault = true;
        newDPM._summary = "New mapping";
        this.datapointMappings.push(newDPM);
    }

    editMapping(dpm: TransactionDatapointMappingModel) {
        this.loadMapping(dpm);
        this.selectedMapping = dpm;
        this.tabOffset = "-100%";
    }

    viewJson(){
        let dpm = new TransactionDatapointMappingModel();
        this.applyToMapping(dpm);
        console.log(languages);
        this.jsonView.nativeElement.innerHTML = highlight(JSON.stringify(dpm, null, 2), languages['js'], 'js');
        this.tabOffset = "-200%";
    }

    returnToEditMapping(){
        this.tabOffset = "-100%";
    }

    returnToList() {
        this.tabOffset = "0";
    }

    deleteMapping(){
        if (this.selectedMapping){
            let i = this.datapointMappings.indexOf(this.selectedMapping, 0);
            if (i >= 0){
                this.datapointMappings.splice(i, 1);
            }
        }
        this.selectedMapping = null;
        this.returnToList();
    }

    discardMappingChanges(){
        if (this.selectedMapping){
            this.loadMapping(this.selectedMapping);
        }
        this.selectedMapping = null;
        this.returnToList();
    }

    saveMappingChanges(){
        if (this.selectedMapping){
            this.applyToMapping(this.selectedMapping);
        }
        this.selectedMapping = null;
        this.returnToList();
    }

    findItemById(e: {[key: string]: ViewEnum}, id: number | undefined): ViewEnum | undefined {
        if (id != null){
            for (let k in e){
                if (e[k].id === id){
                    return e[k];
                }
            }
        }
        return undefined;
    }

    loadMapping(mapping: TransactionDatapointMappingModel){
        this.rootDetector.loadMapping(mapping);
        this.rootParser.loadMapping(mapping);
        this.summarizeMapping(mapping);
    }

    applyToMapping(mapping: TransactionDatapointMappingModel) {
        this.rootDetector.applyToMapping(mapping);
        this.rootParser.applyToMapping(mapping);
        this.summarizeMapping(mapping);
    }

    AddNewCategoryIfRequired(category: string | { value: string, isNew: boolean } | null): { value: string, isNew: boolean} | null {
        if (category){
            if (typeof(category) === 'string'){
                if (this.parserCategories.filter(e => e.value === category).length === 0){
                    let e = {value: category, isNew: true};
                    this.parserCategories.push(e);
                    return e;
                }
            } else {
                return category;
            }
        }
        return null;
    }

    AddNewVendorIfRequired(vendor: string | { value: string, isNew: boolean } | null): {value: string, isNew: boolean} | null {
        if (vendor){
            if (typeof(vendor) === 'string') {
                if (this.parserVendors.filter(e => e.value === vendor).length === 0){
                    let e = {value: vendor, isNew: true};
                    this.parserVendors.push(e);
                    return e;
                }
            } else {
                return vendor;
            }
        }
        return null;
    }

    summarizeMapping(mapping: TransactionDatapointMappingModel): void {
        let err = this.validateMapping(mapping);
        if (!err) {
            mapping._summary = this.rootDetector.summarize() + " ➞ " + this.rootParser.summarize();
        } else {
            mapping._summary = "This mapping is not configured correctly and will not be saved.";
        }
    }

    validateMapping(mapping: TransactionDatapointMappingModel) : string | undefined {
        if(!mapping.isDefault){
            if (mapping.detectorColumn == null){
                return "Detector column must be populated";
            }

            let dOp = this.findItemById(DetectorOperations, mapping.detectorOperation);
            if (dOp){
                if (dOp.id === DetectorOperations['is'].id){
                    let dCp = this.findItemById(DetectorComparisons, mapping.detectorComparison);
                    if (!dCp){
                        return "Invalid detector comparison";
                    }
                }
            } else {
                return "Invalid detector operation";
            }
        }

        let pDp = this.findItemById(ParserDatapoints, mapping.parserDatapoint);
        if (pDp){
            let pOp = this.findItemById(ParserOperations, mapping.parserOperation);
            if (pOp){
                switch(pDp.id){
                    case ParserDatapoints['vendor'].id:
                        if (pOp.id === ParserOperations['is'].id){
                            if (!mapping.parserStringValue){
                                return "Invalid vendor";
                            }
                        }
                        break;
                    case ParserDatapoints['value'].id:
                        if (pOp.id === ParserOperations['parseColumn'].id){
                            if (mapping.parserColumn == null){
                                return "Parser column must be populated";
                            }
                        }
                        break;
                    case ParserDatapoints['date'].id:
                        switch(pOp.id){
                            case ParserOperations['is'].id:
                                if (!mapping.parserDateTimeValue){
                                    return "Invalid parser date";
                                }
                                break;
                            case ParserOperations['parseColumn'].id:
                                if (mapping.parserColumn == null){
                                    return "Parser column must be populated";
                                }
                                break;
                        }
                        break;
                    case ParserDatapoints['category'].id:
                        if (pOp.id === ParserOperations['is'].id){
                            if (!mapping.parserStringValue){
                                return "Invalid category";
                            }
                        }
                        break;
                    case ParserDatapoints['description'].id:
                        switch(pOp.id){
                            case ParserOperations['is'].id:
                                if (mapping.parserStringValue == null){
                                    return "Parser string value must be populated";
                                }
                                break;
                            case ParserOperations['isColumn'].id:
                                if (mapping.parserColumn == null){
                                    return "Parser column must be populated";
                                }
                                break;
                            case ParserOperations['parseColumn'].id:
                                if (mapping.parserColumn == null
                                    || mapping.parserStringValue == null){
                                    return "Parser string value and column must be populated";
                                }
                                break;
                        }
                        break;
                }
            } else {
                return "Invalid parser operation";
            }
        } else {
            return "Invalid parser datapoint";
        }

        return undefined;
    }

    save() {
        let validMappings = [];
        for(let mapping of this.datapointMappings){
            if (!this.validateMapping(mapping)){
                validMappings.push(mapping);
            }
        }
        this.dialogRef.close(validMappings);
    }

    cancel() {
        this.dialogRef.close();
    }

}