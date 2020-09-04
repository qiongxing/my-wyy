import { Component, OnInit, ChangeDetectionStrategy, Output, EventEmitter } from '@angular/core';
import { FormGroup, FormBuilder, Validators, NgModel } from '@angular/forms';

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
export class WyLayerLoginComponent implements OnInit {
  @Output() onChangeModalType = new EventEmitter<string | void>();
  @Output() onLogin = new EventEmitter<LoginParams>();
  formModel: FormGroup;
  constructor(
    private fb: FormBuilder,
  ) {
    this.formModel = this.fb.group({
      phone: ['', [Validators.required, Validators.pattern(/^1\d{10}$/)]],
      password: ['', [Validators.required, Validators.minLength(6)]],
      remember: [false]
    })
  }

  ngOnInit() {

  }
  onSubmit() {
    const modal = this.formModel;
    if (modal.valid) {
      this.onLogin.emit(modal.value)
    }
  }
}
