import { Observable } from "rxjs";
import { AsyncValidatorFn, ValidationErrors, ValidatorFn } from "../directives/validators";

export type FormControlStatus = 'VALID'|'INVALID'|'PENDING'
export type FormHooks = 'change'|'blur';


export const VALID = 'VALID';
export const INVALID = 'INVALID';
export const PENDING = 'PENDING';


export abstract class AbstractControl<TValue = any> {
    value!: TValue;
    status: FormControlStatus = VALID;
    errors: ValidationErrors|null = null;
    _updateOn!: FormHooks;
    private _validtorFn: ValidatorFn|null = null;
    private _asyncValidtorFn: AsyncValidatorFn|null = null;

    private _calculateErrors():ValidationErrors|null {
        return this._validtorFn ? this._validtorFn(this) : null;
    }

    private _calculateStatus(): FormControlStatus {
        return this.errors ? INVALID : VALID
    }

    private _runAsyncValidators() {
        if (this._asyncValidtorFn) {
            this.status = PENDING;
            const observable = this._asyncValidtorFn(this) as Observable<ValidationErrors|null>;
            observable.subscribe(res => {
                this.errors = res;
                this.status = this._calculateStatus();
            });
        }
    }

    setValidator(fn: ValidatorFn) {
        this._validtorFn = fn;
    }

    setAsyncValidator(fn: AsyncValidatorFn) {
        this._asyncValidtorFn = fn;
    }

    updateValueAndValidity() {
        this.errors = this._calculateErrors();
        this.status = this._calculateStatus();

        if (this.status === VALID) {
            this._runAsyncValidators();
        }
    }

    get updateOn() {
        return this._updateOn ? this._updateOn : 'change';
    }

    abstract setValue(value: TValue): void
}