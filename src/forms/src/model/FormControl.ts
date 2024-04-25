import { AbstractControl } from "./AbstractControl"

export class FormControl<TValue = any> extends AbstractControl<TValue> {
    override setValue(value: TValue): void {
        this.value = value;
        this.updateValueAndValidity();
    }

}