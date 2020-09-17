import { Component, OnInit, Output, EventEmitter, Input } from '@angular/core';
import { NzMessageService } from 'ng-zorro-antd';
import { timer } from 'rxjs';
import { User } from 'src/app/services/data-types/member.type';
import { MemberService } from 'src/app/services/member.service';

@Component({
  selector: 'app-member-card',
  templateUrl: './member-card.component.html',
  styleUrls: ['menber-card.component.less']
})
export class MemberCardComponent implements OnInit {
  @Input() user: User = null;
  @Output() openModal = new EventEmitter<void>();

  point: number;
  tipTitle = "";
  showTip = false;
  constructor(
    private memberServe: MemberService,
    private messageServe: NzMessageService,
  ) { }

  ngOnInit() {
  }
  onSignin() {
    this.memberServe.signin().subscribe(res => {

      if (res.code === 200) {
        this.alertMessage("success", res.msg || "签到成功");
        this.tipTitle = "积分 +" + res.point;
        this.showTip = true;
        timer(1500).subscribe(() => {
          this.tipTitle = "";
          this.showTip = false;
        })
      } else {
        console.log("res", res)
        this.alertMessage("error", res.msg || "签到失败");
      }
    }, error => {
      this.alertMessage("error", error.msg || "签到失败");
    })
  }

  private alertMessage(type: string, msg: string) {
    this.messageServe.create(type, msg)
  }
}
