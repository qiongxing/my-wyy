import { Component, OnInit, ChangeDetectionStrategy, Input, OnChanges, SimpleChanges } from '@angular/core';
import { SongSheet } from 'src/app/types/common.model';

@Component({
  selector: 'app-wy-layer-like',
  templateUrl: './wy-layer-like.component.html',
  styles: [],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class WyLayerLikeComponent implements OnInit, OnChanges {
  @Input() mySheet: SongSheet[]
  constructor() { }


  ngOnInit() {
  }
  ngOnChanges(changes: SimpleChanges): void {
    console.log("mySheet", changes["mySheet"].currentValue)
  }
}
