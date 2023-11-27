import { NgModule } from '@angular/core';
import { NgModel } from './src/directives/ng_model';

@NgModule({
  declarations: [
    NgModel
  ],
  exports: [
    NgModel
  ]
})
export class FormsModule { }
