import { Directive, ElementRef, InjectionToken, Renderer2 } from "@angular/core";

export interface ControlValueAccessor {
    writeValue(obj: any): void;
    registerOnChange(fn: any): void;
}


@Directive({})
export class BaseControlValueAccessor {
    constructor(private _renderer: Renderer2, private _elementRef: ElementRef) {}
    onChange = (_: any) => {

    }

    registerOnChange(fn: (_: any) => void) {
        this.onChange = fn
    }

    setProperty(key: string, value: string): void {
        this._renderer.setProperty(this._elementRef.nativeElement, key, value)
    }
}

export const NG_VALUE_ACCESSOR = new InjectionToken<ControlValueAccessor>("NG_VALUE_ACCESSOR")