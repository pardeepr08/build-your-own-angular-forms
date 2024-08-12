import { Observable, from } from "rxjs";
import { ValidationErrors, ValidatorFn } from "./src/directives/validators";
import { AbstractControl } from "./src/model/AbstractControl";

export function toObservable(value: any): Observable<any> {
  return value?.then ? from(value) : value;
}

export function toBool(input: string|boolean): boolean {
    return typeof input === "boolean" ? input : input !== null && input !== "false";
}

export function toInteger(input: string|number): number {
    return typeof input === "number" ? input : parseInt(input, 10);
}


export function nullValidator(control: AbstractControl): null {
    return null;
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

export function mergeErrors(
    errors: (ValidationErrors | null)[]
  ): ValidationErrors | null {
    let res: { [key: string]: any } = {};
    for (let error of errors) {
      if (error) {
        res = { ...res, ...error };
      }
    }
    return Object.keys(res).length ? res : null;
  }
  