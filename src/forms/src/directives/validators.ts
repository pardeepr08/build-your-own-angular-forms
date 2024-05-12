import { Directive, InjectionToken } from "@angular/core"
import { AbstractControl } from "../model/AbstractControl"

export type ValidationErrors = {
    [key: string]: any
}
export interface ValidatorFn {
    (control: AbstractControl): ValidationErrors|null
}


export interface Validator {
    validate(control: AbstractControl): ValidationErrors|null
}

export const NG_VALIDATOR: InjectionToken<Validator> = new InjectionToken("NG_VALIDATOR")

@Directive({
    selector: ":not([type=checkbox])[required][ngModel]",
    providers: [{
        provide: NG_VALIDATOR,
        useExisting: RequiredValidator
    }]
})
export class RequiredValidator implements Validator {
    validate(control: AbstractControl<any>): ValidationErrors | null {
        return control.value ? null : { required: true };
    }
}