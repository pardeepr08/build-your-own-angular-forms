import { NgModule } from '@angular/core';
import { NgModel } from './src/directives/ng_model';
import { DefaultControlValueAccessor } from './src/directives/default_value_accessor';
import { CheckboxControlValueAccessor } from './src/directives/checkbox_value_accessor';
import { NgSelectOption, SelectControlValueAccessor } from './src/directives/select_control_value_accessor';
import { NgSelectMultipleOption, SelectMultipleControlValueAccessor } from './src/directives/select_multiple_control_value_accessor';
import { RequiredValidator } from './src/directives/validators';

@NgModule({
  declarations: [
    NgModel,
    DefaultControlValueAccessor,
    CheckboxControlValueAccessor,
    SelectControlValueAccessor,
    NgSelectOption,
    SelectMultipleControlValueAccessor,
    NgSelectMultipleOption,
    RequiredValidator
  ],
  exports: [
    NgModel,
    DefaultControlValueAccessor,
    CheckboxControlValueAccessor,
    SelectControlValueAccessor,
    NgSelectOption,
    SelectMultipleControlValueAccessor,
    NgSelectMultipleOption,
    RequiredValidator
  ]
})
export class FormsModule { }
