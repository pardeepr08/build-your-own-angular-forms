import { Directive, ElementRef, EventEmitter, HostListener, Inject, Input, OnChanges, Output, SimpleChanges } from '@angular/core';


@Directive({
  selector: '[ngModel]',
  exportAs: 'ngModel'
})
export class NgModel implements OnChanges {
  @Input('ngModel') model: any
  @Output('ngModelChange') update = new EventEmitter()

  constructor(private _elementRef: ElementRef) {}

  ngOnChanges(changes: SimpleChanges): void {    
    this._elementRef.nativeElement.checked = this.model
  }


  @HostListener("change", ["$event.target.checked"]) onInput(value: any) {
    this.update.emit(value)
  }
 }
