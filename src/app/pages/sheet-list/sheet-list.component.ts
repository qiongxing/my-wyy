import { Component, OnInit } from '@angular/core';
import { SheetParams, SheetService } from 'src/app/services/sheet.service';
import { ActivatedRoute } from '@angular/router';
import { SheetList } from 'src/app/types/common.model';
import { BatchActionsService } from 'src/app/store/batch-actions.service';

@Component({
  selector: 'app-sheet-list',
  templateUrl: './sheet-list.component.html',
  styleUrls: ['./sheet-list.component.less']
})
export class SheetListComponent implements OnInit {

  listParams: SheetParams = {
    cat: '全部',
    order: 'hot',
    offset: 0,
    limit: 35,
  }
  sheet: SheetList;
  orderValue = 'hot';
  constructor(
    private route: ActivatedRoute,
    private sheetServe: SheetService,
    private batchActionService: BatchActionsService,
  ) {
    // this.listParams.cat = this.route.snapshot.queryParams["cat"];
    this.listParams.cat = this.route.snapshot.queryParamMap.get("cat") || "全部";
    this.getSheet();
  }

  ngOnInit() {
  }
  onOrderChange(order: 'hot' | 'new') {
    this.listParams.order = order;
    this.listParams.offset = 1;
    this.getSheet();
  }
  onPageChange(index: number) {
    this.listParams.offset = index;
    this.getSheet();
  }
  private getSheet() {
    this.sheetServe.getSheet(this.listParams).subscribe(res => {
      this.sheet = res;
    })
  }
  onPlaySheet(id: number) {
    this.sheetServe.playSheet(id).subscribe(list => {
      this.batchActionService.selectPlayList({ list, index: 0 });
    });
  }
}
