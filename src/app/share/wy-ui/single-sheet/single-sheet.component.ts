import { Component, OnInit, Input } from '@angular/core';
import { SongSheet } from 'src/app/types/common.model';

@Component({
  selector: 'app-single-sheet',
  templateUrl: './single-sheet.component.html',
  styleUrls: ['./single-sheet.less']
})
export class SingleSheetComponent implements OnInit {
  @Input() sheet: SongSheet;
  constructor() { }

  ngOnInit() {
  }

}
