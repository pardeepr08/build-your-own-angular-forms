import { AbstractControl } from "./AbstractControl"

export class FormControl<TValue = any> extends AbstractControl<TValue> {
    _pendingValue!: TValue;
    _pendingChange: boolean = false;
    override setValue(value: TValue): void {
        this.value = this._pendingValue = value;
        this.updateValueAndValidity();
    }

}