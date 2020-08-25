import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { map } from 'rxjs/internal/operators';
import { SongSheet } from 'src/app/types/common.model';

@Component({
  selector: 'app-sheet-info',
  templateUrl: './sheet-info.component.html',
  styleUrls: ['./sheet-info.component.less']
})
export class SheetInfoComponent implements OnInit {

  sheetInfo: SongSheet;
  description = {
    short: '',
    long: '',
  }
  controlDesc = {
    isExpand: false,
    iconCls: 'down',
    label: '展开'
  }
  constructor(
    private route: ActivatedRoute,
  ) {
    this.route.data.pipe(map(res => res.sheetInfo)).subscribe(res => {
      this.sheetInfo = res;
      if (res.description) {
        this.changeDesc(res.description)
      }
    })
  }
  ngOnInit() {
  }
  private changeDesc(description: string) {
    const str = this.replaceStr(`<b>介绍：</b>${description}`);
    if (description.length < 99) {
      this.description.short = str;
      this.description.long = '';
    } else {
      this.description = {
        short: str.slice(0, 99) + '...',
        long: str
      }
    }
  }
  private replaceStr(str: string) {
    return str.replace(/\n/g, '<br/>');
  }
  toggleDesc() {
    this.controlDesc.isExpand = !this.controlDesc.isExpand;
    if (this.controlDesc.isExpand) {
      this.controlDesc.iconCls = 'up';
      this.controlDesc.label = '收起';
    } else {
      this.controlDesc.iconCls = 'down';
      this.controlDesc.label = '展开';
    }
  }
}
