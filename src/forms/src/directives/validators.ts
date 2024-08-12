import { Directive, InjectionToken, Input, OnChanges, SimpleChanges } from "@angular/core"
import { AbstractControl } from "../model/AbstractControl"
import { Observable } from "rxjs"
import { nullValidator, requiredValidator, toBool, minlengthValidator, toInteger } from "src/forms/validators"

export type ValidationErrors = {
    [key: string]: any
}
export interface ValidatorFn {
    (control: AbstractControl): ValidationErrors|null
}

export interface AsyncValidatorFn {
    (control: AbstractControl): Promise<ValidationErrors|null> | Observable<ValidationErrors|null>
}

export interface AsyncValidatorFn {
    (control: AbstractControl): Promise<ValidationErrors|null> | Observable<ValidationErrors|null>
}

export interface Validator {
    validate(control: AbstractControl): ValidationErrors|null
}

export interface AsyncValidator {
    validate(control: AbstractControl): Promise<ValidationErrors|null> | Observable<ValidationErrors|null>
}
export const NG_VALIDATORS: InjectionToken<Validator> = new InjectionToken("NG_VALIDATOR")

export const NG_ASYNC_VALIDATORS: InjectionToken<AsyncValidator> = new InjectionToken("NG_ASYNC_VALIDATOR")

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