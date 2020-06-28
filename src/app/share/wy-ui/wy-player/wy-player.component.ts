import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { AppStoreModule } from 'src/app/store';
import { Store, select } from '@ngrx/store';
import { selectSongList } from 'src/app/store/selectors/player.selector';

@Component({
  selector: 'app-wy-player',
  templateUrl: './wy-player.component.html',
  styleUrls: ['./wy-player.component.less'],
})
export class WyPlayerComponent implements OnInit {
  wySliderValue = 35;
  bufferOffset = 70;
  constructor(
    private store$: Store<AppStoreModule>
  ) {
    this.store$.pipe(select(selectSongList)).subscribe(
      res => {
        console.log('歌单', res);
      }
    )
  }

  ngOnInit() {
  }

}
