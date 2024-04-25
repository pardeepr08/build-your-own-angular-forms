import { INVALID, VALID, ValidationErrors } from "./AbstractControl";
import { FormControl } from "./FormControl"

describe('FormControl', () => {
    let control: FormControl<string>;

    beforeEach(() => {
        control = new FormControl();
    })

    it("control is valid initially", () => {
        expect(control.status).toEqual(VALID)
    })

    it("control is valid, if no validation fn provided", () => {
        control.setValue("xyz");
        expect(control.status).toEqual(VALID);
        expect(control.errors).toEqual(null);
    })

    it("control should call the validator function with control as argument", () => {
        const spy = jasmine.createSpy().and.returnValue(null);
        control.setValidator(spy);
        control.setValue("xyz");

        expect(spy).toHaveBeenCalledWith(control);
    })

    it("control is valid if validator fn returns null", () => {
        const spy = jasmine.createSpy().and.returnValue(null);
        control.setValidator(spy);
        control.setValue("xyz");

        expect(control.status).toEqual(VALID);
        expect(control.errors).toEqual(null);
    })

    it("control is invalid if validator fn returns non null value", () => {
        const errors: ValidationErrors = { required: true };
        const spy = jasmine.createSpy().and.returnValue(errors);
        control.setValidator(spy);
        control.setValue("");

        expect(control.status).toEqual(INVALID);
        expect(control.errors).toEqual(errors);
    })
})