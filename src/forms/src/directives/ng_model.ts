import { Directive, ElementRef, EventEmitter, HostListener, Inject, Input, OnChanges, Output, SimpleChanges } from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from './control_value_accessor';


@Directive({
  selector: '[ngModel]',
  exportAs: 'ngModel'
})
export class NgModel implements OnChanges {
  @Input('ngModel') model: any
  @Output('ngModelChange') update = new EventEmitter()
  valueAccessor: ControlValueAccessor;
  registerd: boolean = false;

  constructor(@Inject(NG_VALUE_ACCESSOR) valueAccessor: ControlValueAccessor) {
    this.valueAccessor = valueAccessor;
  }

  ngOnChanges(changes: SimpleChanges): void {
    this.valueAccessor.writeValue(this.model);
    if (!this.registerd) {
      this.setUpViewChangePipeLine();
    }
  }

  setUpViewChangePipeLine() {
    this.valueAccessor.registerOnChange((value: string) => {
      this.update.emit(value);
    });
    this.registerd = true;
  }

 }
