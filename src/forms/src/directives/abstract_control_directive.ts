import { Observable, forkJoin, map, retry } from 'rxjs';
import { AbstractControl, INVALID, PENDING } from '../model/AbstractControl';
import { AsyncValidator, AsyncValidatorFn, ValidationErrors, Validator, ValidatorFn } from './validators';
import { mergeErrors, toObservable } from 'src/forms/validators';

export abstract class AbstractControlDirective {
  abstract control: AbstractControl;
  private _composedValidatorFn: ValidatorFn | null = null;
  private _composedAsyncValidatorFn: AsyncValidatorFn | null = null;

  _setValidator(validators: Validator[] | null) {
    if (validators) {
      this._composedValidatorFn = (
        control: AbstractControl
      ): ValidationErrors | null => {
        const errors = validators.map((validator: Validator) => {
          return validator.validate(control);
        });
        return mergeErrors(errors);
      };
    }
  }

  _setAsyncValidator(validators: AsyncValidator[] | null) {
    if (validators) {
      this._composedAsyncValidatorFn = (
        control: AbstractControl
      ): Observable<ValidationErrors | null> => {
        const observables = validators.map((validator: AsyncValidator) => {
          return toObservable(validator.validate(control));
        });
        return forkJoin(observables).pipe(map(mergeErrors));
      };
    }
  }

  get invalid(): boolean {
    return this.control.status === INVALID;
  }

  get pending(): boolean {
    return this.control.status === PENDING;
  }

  get errors(): ValidationErrors | null {
    return this.control.errors;
  }

  get validators() {
    return this._composedValidatorFn;
  }

  get asyncValidators() {
    return this._composedAsyncValidatorFn;
  }
}
