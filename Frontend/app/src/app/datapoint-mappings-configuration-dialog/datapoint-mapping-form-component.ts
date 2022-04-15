import { ThisReceiver } from "@angular/compiler";
import { AbstractControl, FormControl } from "@angular/forms";
import { tap } from "rxjs";
import { TransactionDatapointMappingModel } from "../models/data/TransactionDatapointMapping";

export interface IDialogMappingFormComponent {
    getSelection(): any;
    disable(): void;
    enable(): void;
    get enabled(): boolean;
    loadMapping(mapping: TransactionDatapointMappingModel): void;
    applyToMapping(mapping: TransactionDatapointMappingModel): void;
    summarize(): string;
    get valid(): boolean;
    parent?: IDialogMappingFormComponent;
    resetValue(): void;
    get name(): string;
    resetValueWhenParentValueChanges: boolean;
}

export class DialogMappingFormComponent<ItemType> implements IDialogMappingFormComponent {
    parent?: IDialogMappingFormComponent;
    private _currentChild?: IDialogMappingFormComponent;
    private _enabled: boolean = true;

    generateSummary: (selection?: ItemType) => string = _ => "";
    setInMapping: (mapping: TransactionDatapointMappingModel, selection?: ItemType) => void = _ => { };
    getFromMapping: (mapping: TransactionDatapointMappingModel) => ItemType | undefined = _ => undefined;
    childSelector: (parent?: IDialogMappingFormComponent, selection?: ItemType) => IDialogMappingFormComponent | undefined = _ => undefined;
    resetValueWhenParentValueChanges: boolean = true;

    constructor(private formControl: FormControl, init?: Partial<DialogMappingFormComponent<ItemType>>) {
        Object.assign(this, init);
        this.formControl = formControl;
        this.formControl.valueChanges.pipe(tap(v => {
            this.updateActiveChild();
        })).subscribe();
    }

    resetValue(): void {
        this.formControl.setValue(this.formControl.defaultValue);
    }

    get name(): string {
        let controls = <{ [key: string]: AbstractControl }>this.formControl.parent?.controls;
        if (controls) {
            for (let k in controls) {
                if (controls[k] === this.formControl) {
                    return k;
                }
            }
        }
        return "?";
    }

    get enabled(): boolean {
        return this._enabled;
    }

    get valid(): boolean {
        let valid = this.formControl.valid;
        if (this._currentChild) {
            valid = valid && this._currentChild.valid;
        }

        return valid;
    }

    summarize(): string {
        let summary = this.generateSummary(this.formControl.value);
        if (this._currentChild) {
            let childSummary = this._currentChild.summarize();
            if (childSummary) {
                if (summary) {
                    summary += " ";
                }
                summary += childSummary;
            }
        }

        return summary;
    }

    loadMapping(mapping: TransactionDatapointMappingModel): void {
        this.formControl.setValue(this.getFromMapping(mapping) ?? this.formControl.defaultValue);
        this.updateActiveChild();
        if (this._currentChild) {
            this._currentChild.loadMapping(mapping);
        }
    }

    applyToMapping(mapping: TransactionDatapointMappingModel): void {
        this.setInMapping(mapping, this.formControl.value);
        if (this._currentChild) {
            this._currentChild.applyToMapping(mapping);
        }
    }

    enable() {
        if (this._enabled) {
            return;
        }
        this._enabled = true;

        if (!this.formControl.enabled) {
            this.resetValue();
            this.formControl.enable();
        }

        let newActiveChild = this.childSelector(this.parent, this.formControl.value);
        if (this._currentChild) {
            if (this._currentChild != newActiveChild) {
                this._currentChild.disable();
            }
        }

        this._currentChild = newActiveChild;
        if (this._currentChild) {
            this._currentChild.parent = this;
            this._currentChild.enable();
        }

    }

    disable() {
        if (!this._enabled) {
            return;
        }
        this._enabled = false;

        if (this._currentChild) {
            this._currentChild.disable();
            this._currentChild = undefined;
        }

        if (!this.formControl.disabled) {
            this.resetValue();
            this.formControl.disable();
        }
        this.parent = undefined;

    }

    getSelection() {
        return this.formControl.value;
    }

    private updateActiveChild() {
        let newActiveChild: IDialogMappingFormComponent | undefined;
        if (this._enabled) {
            newActiveChild = this.childSelector(this.parent, this.formControl.value);
        }

        if (this._currentChild) {
            if (this._currentChild != newActiveChild) {
                this._currentChild.disable();
            } else if (this._enabled) {
                if (this._currentChild.resetValueWhenParentValueChanges){
                    this._currentChild.resetValue();
                }
            }
        }

        if (this._enabled) {
            this._currentChild = newActiveChild;
            if (this._currentChild) {
                this._currentChild.parent = this;
            }
            this._currentChild?.enable();
        }
    }
}