import { Component } from '@angular/core';
import { SearchService } from './services/search.service';
import { SearchResult, SongSheet } from './types/common.model';
import { isEmptyObject } from './utils/tool';
import { ModalTypes } from './store/reducers/member.reducer';
import { AppStoreModule } from './store';
import { Store } from '@ngrx/store';
import { setModalType, setModalVisible, setUserId } from './store/actions/member.action';
import { BatchActionsService } from './store/batch-actions.service';
import { LoginParams } from './share/wy-ui/wy-layer/wy-layer-login/wy-layer-login.component';
import { MemberService } from './services/member.service';
import { User } from './services/data-types/member.type';
import { NzMessageService } from 'ng-zorro-antd';
import { HttpParams } from '@angular/common/http';
import { codeJson } from './utils/base64';
import { StorageService } from './services/storage.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.less']
})
export class AppComponent {
  title = 'WyyApp';
  searchResult: SearchResult;
  wyRememberLogin: LoginParams;
  user: User;
  mySheet: SongSheet[];
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
    private bactchActionsServe: BatchActionsService,
    private memberServe: MemberService,
    private messageServe: NzMessageService,
    private storageServe: StorageService,
  ) {
    const userId = this.storageServe.getStorage("wyUserId");
    if (userId) {
      this.store$.dispatch(setUserId({ userId }));
      this.memberServe.getUserDetail(userId).subscribe(res => {
        if (res.code !== 200) {
          this.alertMessage('error', res.message || "获取详情失败")
        } else {
          this.user = res;
        }
      }, error => {
        this.alertMessage('error', error.message || "获取详情失败")
      })
    }

    const wyRememberLogin = this.storageServe.getStorage("wyRememberLogin")
    if (wyRememberLogin) {
      this.wyRememberLogin = JSON.parse(wyRememberLogin);
    }
  }
  /**打开弹窗 */
  openModal(type: ModalTypes) {
    this.bactchActionsServe.controlModal(true, type)
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
  /**获取当前用户歌单 */
  onLoadMySheet() {
    if (this.user) {
      this.memberServe.getUserSheets(this.user.profile.userId.toString()).subscribe(userSheet => {
        this.mySheet = userSheet.self;
        this.store$.dispatch(setModalVisible({ modalVisible: true }))
      })
    } else {
      this.openModal(ModalTypes.Default)
    }
  }
  onLogin(params: LoginParams) {
    this.memberServe.login(params).subscribe(user => {
      if (user.code !== 200) {
        this.alertMessage('error', user.message || "登陆失败")
      } else {
        this.user = user;
        this.bactchActionsServe.controlModal(false);
        this.alertMessage('success', "登陆成功");
        this.storageServe.setStorage({ key: "wyUserId", value: user.profile.userId });
        this.store$.dispatch(setUserId({ userId: user.profile.userId.toString() }));
        if (params.remember) {
          this.storageServe.setStorage({ key: "wyRememberLogin", value: JSON.stringify(codeJson(params)) });
        } else {
          this.storageServe.removeStorage("wyRememberLogin")
        }
      }
    }, error => {
      this.alertMessage('error', error.message || "登陆失败")
    })
  }
  onLogout() {
    this.memberServe.logout().subscribe(res => {
      if (res.code !== 200) {
        this.alertMessage('error', res.message || "退出失败")
      } else {
        this.user = null;
        this.storageServe.removeStorage("wyUserId")
        this.alertMessage('success', "退出成功")
        this.store$.dispatch(setUserId({ userId: "" }));
      }
    }, error => {
      this.alertMessage('error', error.message || "退出失败")
    })
  }
  private alertMessage(type: string, msg: string) {
    this.messageServe.create(type, msg)
  }
}
