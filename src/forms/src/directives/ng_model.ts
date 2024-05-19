import { Directive, ElementRef, EventEmitter, HostListener, Inject, Input, OnChanges, Optional, Output, SimpleChanges } from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from './control_value_accessor';
import { FormControl } from '../model/FormControl';
import { AbstractControl, INVALID } from '../model/AbstractControl';
import { ValidatorFn, ValidationErrors, Validator, NG_VALIDATORS } from './validators';


@Directive({
  selector: '[ngModel]',
  exportAs: 'ngModel'
})
export class NgModel implements OnChanges {
  control: FormControl = new FormControl();
  @Input() required: any;
  @Input('ngModel') model: any
  @Output('ngModelChange') update = new EventEmitter()
  valueAccessor: ControlValueAccessor;
  _composedValidatorFn: ValidatorFn|null = null;
  registerd: boolean = false;

  constructor(@Inject(NG_VALUE_ACCESSOR) valueAccessor: ControlValueAccessor, @Inject(NG_VALIDATORS) @Optional() validators: Validator[]|null) {
    this.valueAccessor = valueAccessor;
    this._setValidator(validators);
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (!this.registerd) {
      this.setUpViewChangePipeLine();
      this.setUpFormControl();
    }
    this.updateValue(this.model);
  }

  _setValidator(validators: Validator[]|null) {
    if (validators) {
      this._composedValidatorFn = (control: AbstractControl): ValidationErrors|null => {
        const errors = validators.map((validator: Validator) => {
          return validator.validate(control);
        })
        return errors.reduce((acc, err) => {
          return {...acc, ...err}
        }, {})
      }
    }
  }

  setUpViewChangePipeLine() {
    this.valueAccessor.registerOnChange((value: string) => {
      this.update.emit(value);
      this.control.setValue(value);
    });
    this.registerd = true;
  }

  setUpFormControl() {
    if (this._composedValidatorFn) {
      this.control.setValidator(this._composedValidatorFn);
    }
  }

  updateValue(value: any) {
    this.control.setValue(value);
    this.valueAccessor.writeValue(this.model);
  }

  get invalid(): boolean {
    return this.control.status === INVALID;
  }

  get errors(): ValidationErrors|null {
    return this.control.errors;
  }

 }
