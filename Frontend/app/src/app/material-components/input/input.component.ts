import { FocusMonitor } from "@angular/cdk/a11y";
import { coerceBooleanProperty } from "@angular/cdk/coercion";
import { formatNumber } from "@angular/common";
import { Attribute, Component, ElementRef, HostBinding, Inject, Input, OnDestroy, Optional, Self } from "@angular/core";
import { AbstractControl, ControlValueAccessor, FormControl, FormGroup, NgControl } from "@angular/forms";
import { MatFormField, MatFormFieldControl, MAT_FORM_FIELD } from "@angular/material/form-field";
import { Observable, Subject } from "rxjs";


export interface IMaterialInputControl {

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
export class MaterialInputComponent implements MatFormFieldControl<any>, OnDestroy, ControlValueAccessor {
    group: FormGroup;

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
                this.group = new FormGroup({
                    num: new FormControl('')
                });
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


    /* mat-form-field will add a class based on this type (mat-form-field-type-XYZ) */
    controlType = 'material-input'

    /* configure field input interaction */
    _handleInput(control: AbstractControl, nextElement?: HTMLInputElement): void {
        this.group.setValue({num: this._restrictInput(this.group.controls['num'].value) });
        this.autoFocusNext(control, nextElement);
        this.onChange(this.value);
    }

    _restrictInput(value: string): string{
        let regex = /^-?[0-9]*(?:\.[0-9]{0,2})?/;
        regex = new RegExp(regex);
        let match = regex.exec(value);
        if(match){
            return match[0];
        }
        return "";
    }

    _formatValue(value: any): string {
        return Number(value).toFixed(2);
    }

    /* configure field value setting */
    @Input()
    get value(): any {
        if (this.group.valid){
            let v = parseFloat(this.group.controls['num'].value);
            if (v) {
                return v;
            }
            return 0;
        }
        return 0;
    }
    set value(v: any){
        v = v || 0;
        this.group.setValue({num: this._formatValue(v)});
        this.stateChanges.next();
    }

    /* control empty state */
    get empty(){
        let n = this.group.value.value;
        return !n;
    }

    /* whether the field should be in the disabled state */
    @Input()
    get disabled(): boolean { return this._disabled; }
    set disabled(value: boolean) {
        this._disabled = coerceBooleanProperty(value);
        this._disabled ? this.group.disable() : this.group.enable();
        this.stateChanges.next();
    }
    private _disabled = false;

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
            this.group.setValue({num: this._formatValue(this.value)});
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
        return this.group.invalid && this.touched;
    }

    /* event when user clicks on field */
    onContainerClick(event: MouseEvent): void {
        if ((event.target as Element).tagName.toLowerCase() != 'input'){
            this._elementRef.nativeElement.querySelector('input')?.focus();
        }
    }

    /* honestly idk */
    autoFocusNext(control: AbstractControl, nextElement?: HTMLInputElement): void {
        if (!control.errors && nextElement) {
          this._focusMonitor.focusVia(nextElement, 'program');
        }
      }

      autoFocusPrev(control: AbstractControl, prevElement: HTMLInputElement): void {
        if (control.value.length < 1) {
          this._focusMonitor.focusVia(prevElement, 'program');
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