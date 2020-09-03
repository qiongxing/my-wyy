import { Component, OnInit, ChangeDetectionStrategy } from '@angular/core';
import { Store, select } from '@ngrx/store';
import { AppStoreModule } from 'src/app/store';
import { getMember, selectModalVisible, selectModalType } from 'src/app/store/selectors/member.selector';

@Component({
  selector: 'app-wy-layer-modal',
  templateUrl: './wy-layer-modal.component.html',
  styleUrls: ['./wy-layer-modal.component.less'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class WyLayerModalComponent implements OnInit {

  constructor(
    private store$: Store<AppStoreModule>
  ) {
    const appStore$ = this.store$.pipe(select(getMember));
    appStore$.pipe(select(selectModalVisible)).subscribe(visib => {
      console.log('visible',visib)
    })
    appStore$.pipe(select(selectModalType)).subscribe(modalType => {
      console.log('modalType',modalType)
    })
  }

  ngOnInit() {
  }

}
