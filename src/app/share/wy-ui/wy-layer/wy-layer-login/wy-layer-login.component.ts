import { Component, OnInit, ChangeDetectionStrategy, Output, EventEmitter, Input, OnChanges, SimpleChanges } from '@angular/core';
import { FormGroup, FormBuilder, Validators, NgModel } from '@angular/forms';
import { codeJson } from 'src/app/utils/base64';

export type LoginParams = {
  phone: string;
  password: string;
  remember: boolean;
}

@Component({
  selector: 'app-wy-layer-login',
  templateUrl: './wy-layer-login.component.html',
  styleUrls: ['./wy-layer-login.component.less'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class WyLayerLoginComponent implements OnInit, OnChanges {
  @Input() wyRememberLogin: LoginParams;
  @Input() visible = false;
  @Output() onChangeModalType = new EventEmitter<string | void>();
  @Output() onLogin = new EventEmitter<LoginParams>();
  formModel: FormGroup;
  constructor(
    private fb: FormBuilder,
  ) {

  }


  ngOnInit() {

  }

  ngOnChanges(changes: SimpleChanges): void {
    const userLoginParames = changes["wyRememberLogin"];
    if (changes["visible"] && !changes["visible"].firstChange) {
      this.formModel.markAllAsTouched();
    }
    if (userLoginParames) {
      let phone = "";
      let password = "";
      let remember = false;

      if (userLoginParames.currentValue) {
        const value = codeJson(userLoginParames.currentValue, "decode");
        phone = value.phone;
        password = value.password;
        remember = value.remember;
      }
      this.setModel({ phone, password, remember })
    }
  }
  setModel({ phone, password, remember }) {
    this.formModel = this.fb.group({
      phone: [phone, [Validators.required, Validators.pattern(/^1\d{10}$/)]],
      password: [password, [Validators.required, Validators.minLength(6)]],
      remember: [remember]
    })
  }
  onSubmit() {
    const modal = this.formModel;
    if (modal.valid) {
      this.onLogin.emit(modal.value)
    }
  }
}
