import { FocusMonitor } from "@angular/cdk/a11y";
import { coerceBooleanProperty } from "@angular/cdk/coercion";
import { formatNumber } from "@angular/common";
import { AfterViewInit, Attribute, Component, ElementRef, HostBinding, Inject, Input, OnDestroy, Optional, Self, ViewChild } from "@angular/core";
import { AbstractControl, ControlValueAccessor, FormControl, FormGroup, NgControl } from "@angular/forms";
import { MatFormField, MatFormFieldControl, MAT_FORM_FIELD } from "@angular/material/form-field";
import { highlight, languages } from "prismjs";
import { Observable, Subject } from "rxjs";


export interface IMaterialInputControl {
    type: string;
    group: FormGroup;
    invalid: boolean;
    restrictInput(value: string): string;
    setFieldValue(value: any): void;
    getRealValue(): any;
    empty(): boolean;
    disable(): void;
    enable(): void;
    onChange(): void;
}

export class CurrencyInputControl implements IMaterialInputControl {
    type = 'currency';
    group: FormGroup;
    get invalid(): boolean {
        return this.group.invalid;
    }

    constructor(){
        this.group = new FormGroup({
            formControl: new FormControl()
        })
    }

    restrictInput(value: string): string{
        let regex = /^-?[0-9]*(?:\.[0-9]{0,2})?/;
        regex = new RegExp(regex);
        let match = regex.exec(value);
        if(match){
            return match[0];
        }
        return "";
    }

    setFieldValue(value: any): void {
        value = value || 0;
        let fieldValue = Number(value).toFixed(2);
        this.group.setValue({formControl: fieldValue});
    }

    getRealValue(): any {
        if (this.group.valid){
            let v = parseFloat(this.group.controls['formControl'].value);
            if (v) {
                return v;
            }
            return 0;
        }
        return 0;
    }

    empty(): boolean {
        let n = this.group.controls['formControl'].value;
        return !n;
    }

    enable(): void {
        this.group.enable();
    }

    disable(): void {
        this.group.disable();
    }

    onChange(): void {

    }
}

export class IntegerInputControl implements IMaterialInputControl {
    type = 'integer';
    group: FormGroup;
    get invalid(): boolean {
        return this.group.invalid;
    }

    constructor(){
        this.group = new FormGroup({
            formControl: new FormControl()
        })
    }

    restrictInput(value: string): string{
        let regex = /^[0-9]*/;
        regex = new RegExp(regex);
        let match = regex.exec(value);
        if(match){
            return match[0];
        }
        return "";
    }

    setFieldValue(value: any): void {
        if (value){
            let fieldValue = Number(value).toFixed(0);
            this.group.setValue({formControl: fieldValue});
        } else {
            this.group.setValue({formControl: value});
        }
    }

    getRealValue(): any {
        if (this.group.valid){
            let v = parseInt(this.group.controls['formControl'].value);
            if (v) {
                return v;
            }
            return null;
        }
        return null;
    }

    empty(): boolean {
        let n = this.group.controls['formControl'].value;
        return !n;
    }

    enable(): void {
        this.group.enable();
    }

    disable(): void {
        this.group.disable();
    }

    onChange(): void {

    }
}


@Component({
    selector: 'material-input',
    templateUrl: './input.component.html',
    styleUrls: ['./input.component.scss'],
    providers: [{provide: MatFormFieldControl, useExisting: MaterialInputComponent}],
    host: {
        '[class.floating]': 'shouldLabelFloat',
        '[id]': 'id'
    }
})
export class MaterialInputComponent implements MatFormFieldControl<any>, OnDestroy, ControlValueAccessor, AfterViewInit {
    inputControl : IMaterialInputControl;
    @ViewChild('inputElement') inputElement: ElementRef;

    constructor(
        // @angular/forms control that is bound to this element
        @Attribute('type') public type: string,

        @Optional() @Self() public ngControl: NgControl,
        private _focusMonitor: FocusMonitor,
        private _elementRef: ElementRef<HTMLElement>,
        @Optional() @Inject(MAT_FORM_FIELD) public _formField: MatFormField
        ){
        switch(this.type){
            case 'currency': {
                this.inputControl = new CurrencyInputControl();
                break;
            }
            case 'integer' : {
                this.inputControl = new IntegerInputControl();
                break;
            }
            default: {
                break;
            }
        }

        if(this.ngControl != null){
            this.ngControl.valueAccessor = this;
        }
    }

    afterViewInit = () => {};
    ngAfterViewInit(): void {
        this.afterViewInit();
    }


    /* mat-form-field will add a class based on this type (mat-form-field-type-XYZ) */
    controlType = 'material-input'

    /* configure field input interaction */
    _handleInput(): void {
        this.inputControl.group.setValue({formControl: this.inputControl.restrictInput(this.inputControl.group.controls['formControl'].value) });
        this.inputControl.onChange();
        this.onChange(this.value);
    }


    /* configure field value setting */
    @Input()
    get value(): any {
        return this.inputControl.getRealValue();
    }
    set value(v: any){
        this.inputControl.setFieldValue(v);
        this.stateChanges.next();
    }

    /* control empty state */
    get empty(){
        return this.inputControl.empty();
    }

    /* whether the field should be in the disabled state */
    @Input()
    get disabled(): boolean { return this._disabled; }
    set disabled(value: boolean) {
        this._disabled = coerceBooleanProperty(value);
        this._disabled ? this.inputControl.disable() : this.inputControl.enable();
        this.stateChanges.next();
    }
    private _disabled = false;

    setDisabledState(disabled: boolean){
        this.disabled = disabled;
    }

    /* placeholder */
    @Input()
    get placeholder(){
        return this._placeholder;
    }
    set placeholder(plh){
        this._placeholder = plh;
        this.stateChanges.next();
    }
    private _placeholder: string;

    /* control value accessor */
    onChange = (_:any) => {};
    writeValue(obj: any): void {
        this.value = obj;
    }
    registerOnChange(fn: any): void {
        this.onChange = fn;
    }
    registerOnTouched(fn: any): void {
        this.onTouched = fn;
    }

    /* state changed event */
    stateChanges = new Subject<void>();
    ngOnDestroy(){
        this.stateChanges.complete();
        this._focusMonitor.stopMonitoring(this._elementRef);
    }

    /* field id for associating labels and hints */
    static nextId = 0;
    @HostBinding() id = `material-input${MaterialInputComponent.nextId++}`;

    /* control touched event */
    touched: boolean = false;
    onTouched = () => {};

    /* control focused event */
    focused: boolean = false;
    onFocusIn(event: FocusEvent){
        if(!this.focused){
            this.focused = true;
            this.stateChanges.next();
        }
    }
    onFocusOut(event: FocusEvent){
        if(!this._elementRef.nativeElement.contains(event.relatedTarget as Element)){
            this.inputControl.setFieldValue(this.value);
            this.touched = true;
            this.focused = false;
            this.onTouched();
            this.stateChanges.next();
        }
    }

    /* whether or not label should be floating -- copies matInput logic */
    @HostBinding('class.floating')
    get shouldLabelFloat() {
        return this.focused || !this.empty;
    }

    /* whether field is required in form */
    @Input()
    get required(){
        return this._required;
    }
    set required(req){
        this._required = coerceBooleanProperty(req);
        this.stateChanges.next();
    }
    private _required = false;


    /* whether field is in error state */
    get errorState(): boolean {
        return this.inputControl.invalid && this.touched;
    }

    /* event when user clicks on field */
    onContainerClick(event: MouseEvent): void {
        if ((event.target as Element).tagName.toLowerCase() != 'input'){
            this._elementRef.nativeElement.querySelector('input')?.focus();
        }
    }


    /* MatFormFieldControl<any> */
    setDescribedByIds(ids: string[]): void {
        const controlElement = this._elementRef.nativeElement.querySelector(
        '.material-input-container',
        )!;
        controlElement?.setAttribute('aria-describedby', ids.join(' '));
    }
}