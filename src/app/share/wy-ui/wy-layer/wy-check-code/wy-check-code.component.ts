import { Component, OnInit, ChangeDetectionStrategy, Input, Output, EventEmitter, OnChanges, SimpleChanges, ChangeDetectorRef } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-wy-check-code',
  templateUrl: './wy-check-code.component.html',
  styleUrls: ['./wy-check-code.component.less'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class WyCheckCodeComponent implements OnInit, OnChanges {
  private phoneHidStr = '';

  formModel: FormGroup;
  showRepeatBtn = false;
  @Input()
  set phone(phone: string) {
    let arr = phone.split('');
    arr.splice(3, 4, "****");
    this.phoneHidStr = arr.join('');
  }
  get phone() {
    return this.phoneHidStr;
  }
  @Input() codePass: string;
  @Input() timing: number;
  @Output() onCheckCode = new EventEmitter<string>();
  @Output() onReatSendCode = new EventEmitter<void>();
  @Output() onCheckExist = new EventEmitter<void>();
  constructor(
    private cdr: ChangeDetectorRef,
  ) {
    this.formModel = new FormGroup({
      code: new FormControl('', [Validators.required, Validators.pattern(/\d{4}/)]),
    });
    const codeControl = this.formModel.get('code');
    codeControl.statusChanges.subscribe(status => {
      if (status === "VALID") {
        this.onCheckCode.emit(this.formModel.value.code);
      }
    })

  }


  ngOnInit() {
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes["timing"]) {
      this.showRepeatBtn = this.timing <= 0;
      this.cdr.markForCheck();
    }
  }
  /**注册 */
  onSubmit() {
    if (this.formModel.valid && this.codePass) {
      this.onCheckExist.emit();
    }
  }

}
