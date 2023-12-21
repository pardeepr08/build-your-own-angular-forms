import { Directive, HostListener, Provider, Renderer2, forwardRef } from "@angular/core";
import { BaseControlValueAccessor, ControlValueAccessor, NG_VALUE_ACCESSOR } from "./control_value_accessor";

const CHECKBOX_VALUE_ACCESSOR: Provider  = {
    provide: NG_VALUE_ACCESSOR,
    useExisting: forwardRef(() => CheckboxControlValueAccessor)
}

@Directive({
    selector: "input([type=checkbox])[ngModel]",
    providers: [CHECKBOX_VALUE_ACCESSOR]
})
export class CheckboxControlValueAccessor extends BaseControlValueAccessor implements ControlValueAccessor {    
    writeValue(value: string): void {
        this.setProperty("checked", value)
    }

    @HostListener("change", ["$event.target.checked"]) onInputChange(value: string) {
        this.onChange(value)
    }
}