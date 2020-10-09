import { Component, OnInit, ChangeDetectionStrategy, Input } from '@angular/core';

@Component({
  selector: 'app-wy-check-code',
  templateUrl: './wy-check-code.component.html',
  styleUrls: ['./wy-check-code.component.less'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class WyCheckCodeComponent implements OnInit {
  private phoneHidStr = '';
  @Input()
  set phone(phone: string) {
    let arr = phone.split('');
    arr.splice(3, 4, "****");
    this.phoneHidStr = arr.join('');
  }
  get phone() {
    return this.phoneHidStr;
  }
  constructor() { }

  ngOnInit() {
  }

}
