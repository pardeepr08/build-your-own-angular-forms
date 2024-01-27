import { Directive, ElementRef, HostListener, Input, OnDestroy, Optional, Provider, Renderer2, forwardRef } from "@angular/core";
import { BaseControlValueAccessor, ControlValueAccessor, NG_VALUE_ACCESSOR } from "./control_value_accessor";

function _buildValueString(id: string|null, value: any) {
    if (id === null) return `${value}`
    else return `${id}:object`;
}

function _extractId(value: string): string {
    return value.split(":")[0];
}

const SELECT_MULTIPLE_VALUE_ACCESSOR: Provider  = {
    provide: NG_VALUE_ACCESSOR,
    useExisting: forwardRef(() => SelectMultipleControlValueAccessor)
}

@Directive({
    selector: "select[multiple][ngModel]",
    providers: [SELECT_MULTIPLE_VALUE_ACCESSOR],
    host: {
        "(change)": "onChange($event.target)"
    }
})
export class SelectMultipleControlValueAccessor extends BaseControlValueAccessor implements ControlValueAccessor {    
    value: any;
    _idCounter: number = 0;
    _optionMap: Map<string, NgSelectMultipleOption> = new Map<string, NgSelectMultipleOption>();

    writeValue(value: any): void {
        let optionSelectedStateSetter: (option: NgSelectMultipleOption, o: any) => void;
        this.value = value;
        const ids = value.map((v: any) => this._getOptionId(v))
        
        if (Array.isArray(value)) {
            optionSelectedStateSetter = (option: NgSelectMultipleOption, o: any) => {
                option._setSelected(ids.includes(o) ? true : false);
            }
        }
        else {
            optionSelectedStateSetter = (option: NgSelectMultipleOption, o: any) => {
                option._setSelected(false);
            }
        }

        this._optionMap.forEach(optionSelectedStateSetter)
    }

    override registerOnChange(fn: (_: any) => void): void {
        this.onChange = (element: HTMLSelectElement) => {
            const selected: any[] = [];
            const options = element.selectedOptions;
            for (let i = 0; i < options.length; i++) {
                const opt = options[i];
                selected.push(this._getOptionValue(opt.value));
            }
            fn(selected);
        }
    }

    @Input() set compareWith(fn: (o1: any, o2:any) => boolean) {
        this._compareWith = fn;
    }

    _compareWith: (o1: any, o2: any) => boolean = Object.is;

    _registerOption(option: NgSelectMultipleOption): string {
        const id = (this._idCounter++).toString();
        this._optionMap.set(id, option);
        return id;
    }

    _getOptionValue(value: string): any {
        const id = _extractId(value);
        return this._optionMap.has(id) ? this._optionMap.get(id)?._value : value;
    }

    _getOptionId(value: any): string|null {
        for(let id of this._optionMap.keys()) {
            if (this._compareWith(value, this._optionMap.get(id)?._value)) return id;
        }
        return null;
    }
}

@Directive({
  selector: 'option',
})
export class NgSelectMultipleOption implements OnDestroy {
    id!: string;
    _value: any;

    constructor(private renderer: Renderer2, private elementRef: ElementRef, @Optional() private _select: SelectMultipleControlValueAccessor) {
        if (this._select) {
            this.id = this._select._registerOption(this);
        }
    }

    @Input() set ngValue(value: any) {
        if (!this._select) return;
        this._value = value;
        const valueString = _buildValueString(this.id, value);
        this._setElementValue(valueString);
        this._select.writeValue(this._select.value);
    }


    @Input() set value(value: string) {
        this._setElementValue(value);
        if (this._select) {
            this._value = value;
            this._select.writeValue(this._select.value);
        }
    }


    _setElementValue(value: any): void {
        this.renderer.setProperty(this.elementRef.nativeElement, "value", value);
    }

    _setSelected(selected: boolean) {
        this.renderer.setProperty(this.elementRef.nativeElement, "selected", selected);
    }

    ngOnDestroy(): void {
        if (this._select) {
            this._select._optionMap.delete(this.id);
            this._select.writeValue(this._select.value);
        }
    }

}