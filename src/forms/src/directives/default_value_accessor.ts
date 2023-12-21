import { Directive, HostListener, Provider, Renderer2, forwardRef } from "@angular/core";
import { BaseControlValueAccessor, ControlValueAccessor, NG_VALUE_ACCESSOR } from "./control_value_accessor";

const DEFAULT_VALUE_ACCESSOR: Provider  = {
    provide: NG_VALUE_ACCESSOR,
    useExisting: forwardRef(() => DefaultControlValueAccessor)
}

@Directive({
    selector: "input:not([type=checkbox])[ngModel]",
    providers: [DEFAULT_VALUE_ACCESSOR]
})
export class DefaultControlValueAccessor extends BaseControlValueAccessor implements ControlValueAccessor {    
    writeValue(value: string): void {
        this.setProperty("value", value)
    }

    @HostListener("input", ["$event.target.value"]) onInput(value: string) {
        this.onChange(value)
    }
}