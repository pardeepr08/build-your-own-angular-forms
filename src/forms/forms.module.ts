import { NgModule } from '@angular/core';
import { NgModel } from './src/directives/ng_model';
import { DefaultControlValueAccessor } from './src/directives/default_value_accessor';
import { CheckboxControlValueAccessor } from './src/directives/checkbox_value_accessor';
import { NgOption, SelectControlValueAccessor } from './src/directives/select_control_value_accessor';

@NgModule({
  declarations: [
    NgModel,
    DefaultControlValueAccessor,
    CheckboxControlValueAccessor,
    SelectControlValueAccessor,
    NgOption
  ],
  exports: [
    NgModel,
    DefaultControlValueAccessor,
    CheckboxControlValueAccessor,
    SelectControlValueAccessor,
    NgOption
  ]
})
export class FormsModule { }
