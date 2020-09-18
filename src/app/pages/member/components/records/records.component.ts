import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { RecordVal } from 'src/app/services/data-types/member.type';
import { RecordType } from 'src/app/services/member.service';
import { Song } from 'src/app/types/common.model';

@Component({
  selector: 'app-records',
  templateUrl: './records.component.html',
  styleUrls: ['./records.component.less']
})
export class RecordsComponent implements OnInit {

  @Input() records: RecordVal[];
  @Input() recordType = RecordType.weekData;
  @Input() listenSongs = 0;
  @Input() currentSong: Song = null;
  @Output() onChangeType = new EventEmitter<RecordType>();
  @Output() onAddSong = new EventEmitter<[Song, boolean]>();
  constructor() { }

  ngOnInit() {
  }

}
