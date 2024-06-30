import { Directive, InjectionToken, Input, OnChanges, SimpleChanges } from "@angular/core"
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

export function nullValidator(control: AbstractControl): null {
    return null;
}

export function toBool(input: string|boolean): boolean {
    return typeof input === "boolean" ? input : input !== null && input !== "false";
}

export function toInteger(input: string|number): number {
    return typeof input === "number" ? input : parseInt(input, 10);
}

export function requiredValidator(input: boolean): ValidatorFn {
    if (input) {
        return (control: AbstractControl): ValidationErrors|null => {
            return control.value ? null : { required: true }
        }
    }
    return nullValidator
}

export function minlengthValidator(minlength: number): ValidatorFn {
   return (control: AbstractControl): ValidationErrors|null => {
    if (control.value.length < minlength) {
        return {
          minlength: {
            actualLength: control.value.length,
            requiredLength: minlength,
          },
        };
    }
    return null;
   }
}

@Directive()
export abstract class AbstractValidatorDirective  implements Validator, OnChanges {
    private _validator: ValidatorFn = nullValidator;
    abstract inputName: string;
    abstract createValidator(input: unknown): ValidatorFn;
    abstract normalizeInput(input: unknown): unknown;
    validate(control: AbstractControl<any>): ValidationErrors | null {
        return this._validator(control);
    }
    ngOnChanges(changes: SimpleChanges): void {
        if (this.inputName in changes) {
            const input = this.normalizeInput(changes[this.inputName].currentValue);
            this._validator = this.createValidator(input);
        }
    }

}

@Directive({
    selector: ":not([type=checkbox])[required][ngModel]",
    providers: [{
        provide: NG_VALIDATORS,
        useExisting: RequiredValidator,
        multi: true
    }]
})
export class RequiredValidator extends AbstractValidatorDirective {
    @Input() required!: string|boolean
    override inputName: string = "required";
    override createValidator = requiredValidator;
    override normalizeInput = toBool;
}

@Directive({
    selector: "[minlength][ngModel]",
    providers: [{
        provide: NG_VALIDATORS,
        useExisting: MinLengthValidatorValidator,
        multi: true
    }]
})
export class MinLengthValidatorValidator extends AbstractValidatorDirective {
    @Input() minlength!: string|number;
    override inputName: string = "minlength";
    override createValidator = minlengthValidator
    override normalizeInput = toInteger
}