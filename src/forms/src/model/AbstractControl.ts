import { ValidationErrors, ValidatorFn } from "../directives/validators";

export type FormControlStatus = 'VALID'|'INVALID'


export const VALID = 'VALID';
export const INVALID = 'INVALID';


export abstract class AbstractControl<TValue = any> {
    value!: TValue;
    status: FormControlStatus = VALID;
    errors: ValidationErrors|null = null;
    private _validtorFn: ValidatorFn|null = null;

    private _calculateErrors():ValidationErrors|null {
        return this._validtorFn ? this._validtorFn(this) : null;
    }

    private _calculateStatus(): FormControlStatus {
        return this.errors && Object.keys(this.errors).length ? INVALID : VALID
    }

    setValidator(fn: ValidatorFn) {
        this._validtorFn = fn;
    }

    updateValueAndValidity() {
        this.errors = this._calculateErrors();
        this.status = this._calculateStatus();
    }

    abstract setValue(value: TValue): void
}