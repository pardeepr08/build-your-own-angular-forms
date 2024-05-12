import { Directive, ElementRef, EventEmitter, HostListener, Inject, Input, OnChanges, Optional, Output, SimpleChanges } from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from './control_value_accessor';
import { FormControl } from '../model/FormControl';
import { AbstractControl, INVALID } from '../model/AbstractControl';
import { ValidatorFn, ValidationErrors, Validator, NG_VALIDATOR } from './validators';


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
  validator: Validator;
  registerd: boolean = false;

  constructor(@Inject(NG_VALUE_ACCESSOR) valueAccessor: ControlValueAccessor, @Inject(NG_VALIDATOR) @Optional() validator: Validator) {
    this.valueAccessor = valueAccessor;
    this.validator = validator;
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (!this.registerd) {
      this.setUpViewChangePipeLine();
      this.setUpFormControl();
    }
    this.updateValue(this.model);
  }

  setUpViewChangePipeLine() {
    this.valueAccessor.registerOnChange((value: string) => {
      this.update.emit(value);
      this.control.setValue(value);
    });
    this.registerd = true;
  }

  setUpFormControl() {
    if (this.validator) {
      const validatorFn: ValidatorFn = (control: AbstractControl): ValidationErrors|null => {
        return this.validator.validate(control)
      }
      this.control.setValidator(validatorFn);
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
