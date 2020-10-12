import { Component, OnInit, ChangeDetectionStrategy, AfterViewInit, OnDestroy, forwardRef, ViewChild, ElementRef, ChangeDetectorRef } from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';
import { fromEvent, Subject } from 'rxjs';
import { takeUntil } from 'rxjs/internal/operators';

const CODElen = 4;

@Component({
  selector: 'app-wy-code',
  templateUrl: './wy-code.component.html',
  styleUrls: ['./wy-code.component.less'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => WyCodeComponent),
      multi: true,
    }
  ]
})
export class WyCodeComponent implements OnInit, ControlValueAccessor, AfterViewInit, OnDestroy {
  inputArr = [];
  inputsEl: HTMLElement[];
  @ViewChild('cordWrap', { static: true }) private cordWrap: ElementRef;
  private code: string;

  result: string[] = [];
  currentFocusIndex = 0;

  private destory$ = new Subject;

  constructor(
    private cdr: ChangeDetectorRef,
  ) {
    this.inputArr = Array(CODElen).fill('');
  }

  ngOnInit() {
  }

  ngAfterViewInit(): void {
    this.inputsEl = this.cordWrap.nativeElement.getElementsByClassName("item") as HTMLElement[];
    console.log("inputsEl", this.inputsEl)
    this.inputsEl[0].focus();
    for (let index = 0; index < this.inputsEl.length; index++) {
      const item = this.inputsEl[index];
      fromEvent(item, 'keyup').pipe(takeUntil(this.destory$)).subscribe((event: KeyboardEvent) => this.listenKeyUp(event));
      fromEvent(item, 'click').pipe(takeUntil(this.destory$)).subscribe(() => { this.currentFocusIndex = index });
    }
  }

  private listenKeyUp(event: KeyboardEvent) {
    const target = <HTMLInputElement>event.target;
    let value = target.value;

    const isBackSpace = event.key === "Backspace";
    if (/\D/.test(value)) {
      target.value = '';
      value = '';
      this.result[this.currentFocusIndex] = '';
    } else if (value) {
      this.result[this.currentFocusIndex] = value;
      this.currentFocusIndex = (this.currentFocusIndex + 1) % CODElen;
      this.inputsEl[this.currentFocusIndex].focus();
    } else if (isBackSpace) {
      this.result[this.currentFocusIndex] = '';
      this.currentFocusIndex = Math.max(this.currentFocusIndex - 1, 0);
      this.inputsEl[this.currentFocusIndex].focus();
    }
    this.checkResult(this.result);
  }

  private checkResult(result: string[]) {
    const codeStr = result.join('');
    this.setValue(codeStr);
  }

  private setValue(code: string) {
    this.code = code;
    this.onValueChange(code);
    this.cdr.markForCheck();
  }

  private onValueChange(value: string): void { };
  private onTouched(): void { };

  /**输入过程 */
  writeValue(value: string): void {
    this.setValue(value)
  }
  /**输出过程 */
  registerOnChange(fn: (value: string) => void): void {
    this.onValueChange = fn;
  }
  registerOnTouched(fn: () => void): void {
    this.onTouched = fn;
  }

  ngOnDestroy(): void {
    this.destory$.next();
    this.destory$.complete();
  }
}
