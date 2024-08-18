import {
  Directive,
  EventEmitter,
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
import {
  Validator,
  NG_VALIDATORS,
  NG_ASYNC_VALIDATORS,
  AsyncValidator,
} from './validators';
import { AbstractControlDirective } from './abstract_control_directive';
import { FormHooks } from '../model/AbstractControl';


@Directive({
  selector: '[ngModel]',
  exportAs: 'ngModel',
})
export class NgModel extends AbstractControlDirective implements OnChanges {
  control: FormControl = new FormControl();
  @Input() required: any;
  @Input('ngModel') model: any;
  @Input('ngModelOptions') options?: { updateOn: FormHooks }
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
      this.setUpBlurPipeLine();
      this.setUpFormControl();
      this.registerd = true;
    }
    this.updateValue(this.model);
  }

  setUpViewChangePipeLine() {
    this.valueAccessor.registerOnChange((value: string) => {
      this.control._pendingValue = value;
      this.control._pendingChange = true;
      if (this.control.updateOn === 'change') {
        this.update.emit(value);
        this.control.setValue(value);
      }
    });
    this.registerd = true;
  }

  setUpBlurPipeLine() {
    this.valueAccessor.registerOnTouched(() => {
      if (this.control.updateOn === 'blur' && this.control._pendingChange) {
        this.update.emit(this.control._pendingValue);
        this.control.setValue(this.control._pendingValue);
      }
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
    if (this.options?.updateOn) {
      this.control._updateOn = this.options.updateOn;
    }
  }

  updateValue(value: any) {
    this.control.setValue(value);
    this.valueAccessor.writeValue(this.model);
  }

}
