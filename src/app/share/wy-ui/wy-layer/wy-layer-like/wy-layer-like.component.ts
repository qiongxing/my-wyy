import { Component, OnInit, ChangeDetectionStrategy, Input, OnChanges, SimpleChanges, Output, EventEmitter } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, Validators } from '@angular/forms';
import { LikeSongParams } from 'src/app/services/member.service';
import { SongSheet } from 'src/app/types/common.model';

@Component({
  selector: 'app-wy-layer-like',
  templateUrl: './wy-layer-like.component.html',
  styleUrls: ['./wy-layer-like.component.less'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class WyLayerLikeComponent implements OnInit, OnChanges {
  @Input() mySheet: SongSheet[];
  @Input() likeId: string;
  @Input() visible: boolean;
  @Output() onLikeSong = new EventEmitter<LikeSongParams>();
  @Output() onCreateSheet = new EventEmitter<string>();
  creating = false;
  formModel: FormGroup;
  constructor(
    private fb: FormBuilder
  ) {
    this.formModel = fb.group({
      "sheetName": ['', [Validators.required]]
    })
  }


  ngOnInit() {
  }
  ngOnChanges(changes: SimpleChanges): void {
    // console.log("mySheet", changes["mySheet"].currentValue);
    // console.log("likeId", changes["likeId"].currentValue);
    // this.mySheets = changes["mySheet"].currentValue;
    if (changes["visible"]) {
      if (!this.visible) {
        this.formModel.get('sheetName').reset();
        this.creating = false;
      }
    }
  }

  onLike(pid: string) {
    this.onLikeSong.emit({ pid, tracks: this.likeId });
  }

  onSubmit() {
    this.onCreateSheet.emit(this.formModel.value.sheetName);
  }
}
