import {Component, forwardRef, OnInit} from '@angular/core';
import {
  AbstractControl,
  ControlValueAccessor,
  NG_VALIDATORS,
  NG_VALUE_ACCESSOR,
  ValidationErrors,
  Validator
} from "@angular/forms";

@Component({
  selector: 'app-intl-phone-input',
  templateUrl: './intl-phone-input.component.html',
  providers: [
    {provide: NG_VALUE_ACCESSOR, multi: true, useExisting: forwardRef(() => IntlPhoneInputComponent)},
    {provide: NG_VALIDATORS, multi: true, useExisting: forwardRef(() => IntlPhoneInputComponent)},
  ]
})
export class IntlPhoneInputComponent implements OnInit, ControlValueAccessor, Validator {

  propagateChange = (_) => {};
  phone = '';

  // Default country to China. This parameter should be identical to the initial country in the HTML
  dialCode = '+86';

  constructor() {}

  ngOnInit() {}

  onChange() {
    const full = this.dialCode + /0*([0-9]+)/.exec(this.phone)[1];
    this.propagateChange(full);
  }

  onCountryChange(event: any) {
    this.dialCode = '+' + event.dialCode;
    this.onChange();
  }

  validate(control: AbstractControl): ValidationErrors | null {
    const reg = RegExp('[0-9]{2,12}');
    return reg.exec(this.phone) ? null : { parsePhoneError: { valid: false } };
  }

  writeValue(obj: any): void {
    this.phone = obj;
  }

  registerOnChange(fn: any): void {
    this.propagateChange = fn;
  }

  registerOnTouched(fn: any): void {}


}
