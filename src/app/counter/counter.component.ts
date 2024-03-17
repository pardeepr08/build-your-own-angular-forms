import { Component, OnInit, Provider, forwardRef } from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from 'src/forms/src/directives/control_value_accessor';

const COUNTER_PROVIDER: Provider = {
  provide: NG_VALUE_ACCESSOR,
  useExisting: forwardRef(() => CounterComponent)
}

@Component({
  selector: 'app-counter',
  templateUrl: './counter.component.html',
  styleUrls: ['./counter.component.scss'],
  providers: [COUNTER_PROVIDER]
})
export class CounterComponent implements ControlValueAccessor {

  count = 0;

  onChange: any;
  
  constructor() { }

  writeValue(value: any): void {
    this.count = value;
  }

  registerOnChange(fn: any): void {
    this.onChange = fn;
  }

  increment() {
    this.count++;
    this.onChange(this.count);
  }

  decrement() {
    this.count--;
    this.onChange(this.count);
  }
}
