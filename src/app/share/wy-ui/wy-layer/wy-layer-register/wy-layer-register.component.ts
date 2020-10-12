import { Component, OnInit, ChangeDetectionStrategy, Input, EventEmitter, Output, ChangeDetectorRef, OnChanges, SimpleChanges } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { NzMessageService } from 'ng-zorro-antd';
import { interval } from 'rxjs';
import { take } from 'rxjs/internal/operators';
import { MemberService } from 'src/app/services/member.service';
import { ModalTypes } from 'src/app/store/reducers/member.reducer';

enum Exist {
  '存在' = 1,
  '不存在' = -1
}

@Component({
  selector: 'app-wy-layer-register',
  templateUrl: './wy-layer-register.component.html',
  styleUrls: ['./wy-layer-register.component.less'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class WyLayerRegisterComponent implements OnInit, OnChanges {
  @Input() visible = false;
  @Output() onChangeModalType = new EventEmitter<string | void>();
  @Output() onRegister = new EventEmitter<string>();

  formModel: FormGroup;
  timing: number;
  showCode = false;
  codePass = '';
  constructor(
    private fb: FormBuilder,
    private memberServe: MemberService,
    private messageServe: NzMessageService,
    private cdr: ChangeDetectorRef,
  ) {
    this.formModel = this.fb.group({
      phone: ['', [Validators.required, Validators.pattern(/^1\d{10}$/)]],
      password: ['', [Validators.required, Validators.minLength(6)]]
    })
  }

  ngOnInit() {
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['visible'] && !changes['visible'].firstChange) {
      this.formModel.markAllAsTouched();
      if (!this.visible) {
        this.showCode = false;
        this.codePass = '';
        this.cdr.markForCheck();
      }
    }
  }

  onSubmit() {
    this.sendCode();

  }

  onCheckCode(code: string) {
    this.memberServe.checkCode(this.formModel.get('phone').value, Number(code)).subscribe(() =>
      () => this.codePass = '1',
      () => this.codePass = '0',
      () => this.cdr.markForCheck()
    )
  }

  onCheckExist() {
    this.memberServe.checkExist(this.formModel.get('phone').value).subscribe((res) => {
      if (Exist[res] === '存在') {
        this.messageServe.error('已存在当前用户,可直接登录');
        this.changeType(ModalTypes.LoginByPhone);
      } else {
        this.onRegister.emit(this.formModel.get('phone').value)
      }
    })
  }

  changeType(type = ModalTypes.Default) {
    this.showCode = false;
    this.formModel.reset();
    this.onChangeModalType.emit(type);
  }

  sendCode() {
    const phone = this.formModel.get("phone").value;
    this.memberServe.sendCode(phone).subscribe(() => {
      this.timing = 60;
      if (!this.showCode) {
        this.showCode = true;
      }
      interval(1000).pipe(take(60)).subscribe(() => {
        this.timing--;
        this.cdr.markForCheck();
      });
    }, err => this.messageServe.error(err.message || "发送验证码失败"));
    console.log(this.formModel)
  }

}
