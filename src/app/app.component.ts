import { Component } from '@angular/core';
import { SearchService } from './services/search.service';
import { SearchResult } from './types/common.model';
import { isEmptyObject } from './utils/tool';
import { ModalTypes } from './store/reducers/member.reducer';
import { AppStoreModule } from './store';
import { Store } from '@ngrx/store';
import { setModalType } from './store/actions/member.action';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.less']
})
export class AppComponent {
  title = 'WyyApp';
  searchResult: SearchResult;
  menu = [
    {
      label: '发现',
      path: '/home'
    },
    {
      label: '歌单',
      path: '/sheet'
    }
  ]
  constructor(
    private searchServe: SearchService,
    private store$: Store<AppStoreModule>,
  ) {

  }
  onSearch(keyword: string) {
    if (keyword) {
      this.searchServe.search(keyword).subscribe(res => {
        this.searchResult = this.highlightKeyWords(keyword, res);
      })
    } else {
      this.searchResult = {};
    }
  }

  private highlightKeyWords(keyword: string, result: SearchResult): SearchResult {
    if (!isEmptyObject(result)) {
      const reg = new RegExp(keyword, 'ig');
      ['artists', 'playlists', 'songs'].forEach(type => {
        if (result[type]) {
          result[type].forEach(item => {
            item.name = item.name.replace(reg, '<span class="highlight">$&</span>')
          })
        }
      })
    }
    return result;
  }
  /**改变弹窗类型 */
  onChangeModalType(type = ModalTypes.Default) {
    this.store$.dispatch(setModalType({ modalType: type }));
  }
}
