import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { SongSheet } from 'src/app/types/common.model';

@Component({
  selector: 'app-single-sheet',
  templateUrl: './single-sheet.component.html',
  styleUrls: ['./single-sheet.less']
})
export class SingleSheetComponent implements OnInit {
  @Input() sheet: SongSheet;
  @Output() onPlay = new EventEmitter<number>();
  constructor() { }

  ngOnInit() {
  }
  playSheet(event: MouseEvent, id: number) {
    event.stopPropagation();
    this.onPlay.emit(id);
  }
  get coverImg() {
    return this.sheet.picUrl || this.sheet.coverImgUrl;
  }
}
