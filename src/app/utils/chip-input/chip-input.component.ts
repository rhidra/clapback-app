import {Component, forwardRef, Input, OnInit} from '@angular/core';
import {ControlValueAccessor, NG_VALUE_ACCESSOR} from '@angular/forms';

@Component({
  selector: 'app-chip-input',
  templateUrl: './chip-input.component.html',
  providers: [
    {provide: NG_VALUE_ACCESSOR, multi: true, useExisting: forwardRef(() => ChipInputComponent)}
  ]
})
export class ChipInputComponent implements ControlValueAccessor {

  @Input()
  set suggestedTags(tags: Array<string>) {
    tags.forEach(t => this.tags.add(t));
  }

  tags = new Set<string>();
  selected: Set<string>;
  custom = new Set<string>();
  input: string;

  propagateChange: any = () => {};

  constructor() { }

  toggle(tag: string) {
    if (this.selected.has(tag)) {
      this.selected.delete(tag);
      if (this.custom.has(tag)) {
        this.custom.delete(tag);
        this.tags.delete(tag);
      }
    } else {
      this.selected.add(tag);
    }
    this.propagateChange([...this.selected]);
  }

  onKey() {
    const c = this.input[this.input.length - 1];
    if ([' ', '.', ',', ';', '#'].includes(c)) {
      this.addTag();
    }
  }

  addTag() {
    const tag = (this.input || '').trim().replace(/[ !"#$%&'°ùàéçè²()*+,.:;<=>?@[^_`{|}~\/\\\]\-]/gm, '').trim();
    if (tag) {
      this.tags.add(tag);
      this.selected.add(tag);
      this.custom.add(tag);
    }
    this.input = '';
    this.propagateChange([...this.selected]);
  }

  writeValue(obj: any): void {
    this.selected = new Set(obj);
    this.tags = new Set([...obj, ...this.tags]);
  }

  registerOnChange(fn: any): void {
    this.propagateChange = fn;
  }
  registerOnTouched(fn: any): void {}
}
