import { Component, OnInit, ChangeDetectionStrategy, Input, EventEmitter, Output, ChangeDetectorRef } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { NzMessageService } from 'ng-zorro-antd';
import { interval } from 'rxjs';
import { take } from 'rxjs/internal/operators';
import { MemberService } from 'src/app/services/member.service';

@Component({
  selector: 'app-wy-layer-register',
  templateUrl: './wy-layer-register.component.html',
  styleUrls: ['./wy-layer-register.component.less'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class WyLayerRegisterComponent implements OnInit {
  @Input() visible = false;
  @Output() onChangeModalType = new EventEmitter<string | void>();

  formModel: FormGroup;
  timing: number;
  showCode = false;
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

  onSubmit() {
    this.sendCode();

  }

  changeType() {
    this.showCode = false;
    this.formModel.reset();
    this.onChangeModalType.emit('defult');
  }

  private sendCode() {
    const phone = this.formModel.get("phone").value;
    this.memberServe.sendCode(phone).subscribe(() => {
      this.timing = 60;
      if (!this.showCode) {
        this.showCode = true;
      }
      this.cdr.markForCheck();
      interval(1000).pipe(take(60)).subscribe(() => this.timing--);
    }, err => this.messageServe.error(err.message || "发送验证码失败"));
    console.log(this.formModel)
  }

}
