import { Component, OnInit, ChangeDetectionStrategy, Input, Output, EventEmitter, OnChanges, SimpleChanges } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ShareParams } from 'src/app/services/member.service';
import { ShareInfo } from 'src/app/store/reducers/member.reducer';

const MAX_MSG = 140;

@Component({
  selector: 'app-wy-layer-share',
  templateUrl: './wy-layer-share.component.html',
  styleUrls: ['./wy-layer-share.component.less'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class WyLayerShareComponent implements OnInit, OnChanges {
  @Input() shareInfo: ShareInfo;
  @Input() visible = false;
  @Output() onCancel = new EventEmitter<void>();
  @Output() onShare = new EventEmitter<ShareParams>();
  formModel: FormGroup;
  surplusMsgCount = MAX_MSG;
  constructor() {
    this.formModel = new FormGroup({
      msg: new FormControl('', Validators.maxLength(140))
    });
    this.formModel.get("msg").valueChanges.subscribe(msg => {
      this.surplusMsgCount = MAX_MSG - msg.length;
    })
  }

  ngOnInit() {
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes["visible"] && !changes["visible"].firstChange) {
      this.formModel.get("msg").markAllAsTouched();
    }
  }

  onSubmit() {
    if (this.formModel.valid) {
      this.onShare.emit({
        id: this.shareInfo.id,
        msg: this.formModel.get("msg").value,
        type: this.shareInfo.type,
      })
    }
  }
}
