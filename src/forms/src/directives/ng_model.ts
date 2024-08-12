import {
  Directive,
  ElementRef,
  EventEmitter,
  HostListener,
  Inject,
  Input,
  OnChanges,
  Optional,
  Output,
  SimpleChanges,
} from '@angular/core';
import {
  ControlValueAccessor,
  NG_VALUE_ACCESSOR,
} from './control_value_accessor';
import { FormControl } from '../model/FormControl';
import { AbstractControl, INVALID, PENDING } from '../model/AbstractControl';
import {
  ValidatorFn,
  ValidationErrors,
  Validator,
  NG_VALIDATORS,
  NG_ASYNC_VALIDATORS,
  AsyncValidator,
  AsyncValidatorFn,
} from './validators';
import { forkJoin, from, map, merge, Observable } from 'rxjs';
import { AbstractControlDirective } from './abstract_control_directive';


@Directive({
  selector: '[ngModel]',
  exportAs: 'ngModel',
})
export class NgModel extends AbstractControlDirective implements OnChanges {
  control: FormControl = new FormControl();
  @Input() required: any;
  @Input('ngModel') model: any;
  @Output('ngModelChange') update = new EventEmitter();
  valueAccessor: ControlValueAccessor;
  registerd: boolean = false;

  constructor(
    @Inject(NG_VALUE_ACCESSOR) valueAccessor: ControlValueAccessor,
    @Inject(NG_VALIDATORS) @Optional() validators: Validator[] | null,
    @Inject(NG_ASYNC_VALIDATORS) @Optional() asyncValidators: AsyncValidator[] | null
  ) {
    super();
    this.valueAccessor = valueAccessor;
    this._setValidator(validators);
    this._setAsyncValidator(asyncValidators);
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
    if (this.validators) {
      this.control.setValidator(this.validators);
    }
    if (this.asyncValidators) {
      this.control.setAsyncValidator(this.asyncValidators);
    }
  }

  updateValue(value: any) {
    this.control.setValue(value);
    this.valueAccessor.writeValue(this.model);
  }

}
