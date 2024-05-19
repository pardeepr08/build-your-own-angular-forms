import { Directive, InjectionToken, Input } from "@angular/core"
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

export const NG_VALIDATORS: InjectionToken<Validator> = new InjectionToken("NG_VALIDATOR")

@Directive({
    selector: ":not([type=checkbox])[required][ngModel]",
    providers: [{
        provide: NG_VALIDATORS,
        useExisting: RequiredValidator,
        multi: true
    }]
})
export class RequiredValidator implements Validator {
    validate(control: AbstractControl<any>): ValidationErrors | null {
        return control.value ? null : { required: true };
    }
}

@Directive({
    selector: "[minlength][ngModel]",
    providers: [{
        provide: NG_VALIDATORS,
        useExisting: MinLengthValidatorValidator,
        multi: true
    }]
})
export class MinLengthValidatorValidator implements Validator {
    @Input() minlength!: string|number;
    validate(control: AbstractControl<any>): ValidationErrors | null {
        if (control.value.length < +this.minlength) {
            return {
              minlength: {
                actualLength: control.value.length,
                requiredLength: this.minlength,
              },
            };
        }
        return null;
    }
}