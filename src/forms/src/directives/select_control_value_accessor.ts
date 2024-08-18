import { Directive, ElementRef, HostListener, Input, OnDestroy, Optional, Provider, Renderer2, forwardRef } from "@angular/core";
import { BaseControlValueAccessor, ControlValueAccessor, NG_VALUE_ACCESSOR } from "./control_value_accessor";

function _buildValueString(id: string|null, value: any) {
    if (id === null) return `${value}`
    else return `${id}:object`;
}

function _extractId(value: string): string {
    return value.split(":")[0];
}

const SELECT_VALUE_ACCESSOR: Provider  = {
    provide: NG_VALUE_ACCESSOR,
    useExisting: forwardRef(() => SelectControlValueAccessor)
}

@Directive({
    selector: "select:not([multiple])[ngModel]",
    providers: [SELECT_VALUE_ACCESSOR],
    host: {
        "(change)": "onChange($event.target.value)",
        "(blur)": "onTouched()"
    }
})
export class SelectControlValueAccessor extends BaseControlValueAccessor implements ControlValueAccessor {    
    value: any;
    _idCounter: number = 0;
    _optionMap: Map<string, any> = new Map<string, any>();

    writeValue(value: any): void {
        this.value = value;
        const id = this._getOptionId(value);
        const valueString = _buildValueString(id, value);
        this.setProperty("value", valueString)
    }

    override registerOnChange(fn: (_: any) => void): void {
        this.onChange = (value: string) => {
            this.value = this._getOptionValue(value);
            fn(this.value);
        }
    }

    @Input() set compareWith(fn: (o1: any, o2:any) => boolean) {
        this._compareWith = fn;
    }

    _compareWith: (o1: any, o2: any) => boolean = Object.is;

    _registerOption(): string {
        return (this._idCounter++).toString();
    }

    _getOptionValue(value: string): any {
        const id = _extractId(value);
        return this._optionMap.has(id) ? this._optionMap.get(id) : value;
    }

    _getOptionId(value: any): string|null {
        for(let id of this._optionMap.keys()) {
            if (this._compareWith(value, this._optionMap.get(id))) return id;
        }
        return null;
    }
}

@Directive({
  selector: 'option',
})
export class NgSelectOption implements OnDestroy {
    id!: string;

    constructor(private renderer: Renderer2, private elementRef: ElementRef, @Optional() private _select: SelectControlValueAccessor) {
        if (this._select) {
            this.id = this._select._registerOption();
        }
    }
    

    @Input() set ngValue(value: any) {
        if (!this._select) return;
        this._select._optionMap.set(this.id, value);
        const valueString = _buildValueString(this.id, value);
        this._setElementValue(valueString);
        this._select.writeValue(this._select.value);
    }


    @Input() set value(value: string) {
        this._setElementValue(value);
        if (this._select) {
            this._select.writeValue(this._select.value);
        }
    }


    _setElementValue(value: any): void {
        this.renderer.setProperty(this.elementRef.nativeElement, "value", value);
    }

    ngOnDestroy(): void {
        if (this._select) {
            this._select._optionMap.delete(this.id);
            this._select.writeValue(this._select.value);
        }
    }

}