import { Component } from '@angular/core';
import { SearchService } from './services/search.service';
import { SearchResult, SongSheet } from './types/common.model';
import { isEmptyObject } from './utils/tool';
import { ModalTypes, ShareInfo } from './store/reducers/member.reducer';
import { AppStoreModule } from './store';
import { select, Store } from '@ngrx/store';
import { setModalType, setModalVisible, setUserId } from './store/actions/member.action';
import { BatchActionsService } from './store/batch-actions.service';
import { LoginParams } from './share/wy-ui/wy-layer/wy-layer-login/wy-layer-login.component';
import { LikeSongParams, MemberService, ShareParams } from './services/member.service';
import { User } from './services/data-types/member.type';
import { NzMessageService } from 'ng-zorro-antd';
import { codeJson } from './utils/base64';
import { StorageService } from './services/storage.service';
import { getMember, selectLikeId, selectModalType, selectModalVisible, selectShareInfo } from './store/selectors/member.selector';
import { ActivatedRoute, NavigationEnd, NavigationStart, Router } from '@angular/router';
import { interval, Observable } from 'rxjs';
import { filter, map, mergeMap, takeUntil } from 'rxjs/internal/operators';
import { Title } from '@angular/platform-browser';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.less']
})
export class AppComponent {
  routeTitle = '';
  searchResult: SearchResult;
  wyRememberLogin: LoginParams;
  user: User;
  mySheet: SongSheet[];
  //被监听的收藏Id
  likeId: string;
  currentModalType = ModalTypes.Default;
  visible = false;
  shareInfo: ShareInfo;
  //弹窗loading
  showSpin = false;
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

  /**加载读条 */
  loadPrecent = 0;

  private navEnd: Observable<NavigationEnd>;
  constructor(
    private searchServe: SearchService,
    private store$: Store<AppStoreModule>,
    private bactchActionsServe: BatchActionsService,
    private memberServe: MemberService,
    private messageServe: NzMessageService,
    private storageServe: StorageService,
    private router: Router,
    private activatedRoute: ActivatedRoute,
    private titleServe: Title,
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

    this.listenStates();

    this.router.events.pipe(filter(evt => evt instanceof NavigationStart)).subscribe(() => {
      this.loadPrecent = 0;
      this.setTitle();
    });
    this.navEnd = <Observable<NavigationEnd>>this.router.events.pipe(filter(evt => evt instanceof NavigationEnd));
    this.setLoadingBar();
  }

  private setLoadingBar() {
    interval(100).pipe(takeUntil(this.navEnd)).subscribe(() => {
      this.loadPrecent = Math.max(95, ++this.loadPrecent)
    });
    this.navEnd.subscribe(() => {
      this.loadPrecent = 100;
    })
  }
  private setTitle() {
    this.navEnd.pipe(
      //转换类型
      map(() => this.activatedRoute),
      map((route: ActivatedRoute) => {
        while (route.firstChild) {
          route = route.firstChild;
        }
        return route;
      }),
      mergeMap(route => route.data),
    ).subscribe(data => {
      this.routeTitle = data['title'];
      this.titleServe.setTitle(this.routeTitle);
    })
  }
  /**打开弹窗 */
  openModal(type: ModalTypes) {
    this.bactchActionsServe.controlModal(true, type)
  }
  closeModal() {
    this.bactchActionsServe.controlModal(false);
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
    this.showSpin = true;
    this.memberServe.login(params).subscribe(user => {
      this.showSpin = false;
      if (user.code !== 200) {
        this.alertMessage('error', user.message || "登陆失败")
      } else {
        this.user = user;
        this.closeModal()
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
      this.showSpin = false;
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

  /**收藏歌曲 */
  onLikeSong(args: LikeSongParams) {
    this.memberServe.likeSong(args).subscribe(() => {
      this.closeModal()
      this.alertMessage('success', '收藏成功');
    }, error => {
      this.alertMessage('error', error.msg || '收藏失败');
    });
  }
  /**创建歌单 */
  onCreateSheet(sheetName: string) {
    this.memberServe.createSheet(sheetName).subscribe((pid) => {
      this.onLikeSong({ pid, tracks: this.likeId });
    }, error => {
      this.alertMessage('error', error.msg || '创建失败');
    });
  }

  onShare(info: ShareParams) {
    this.memberServe.shareResource(info).subscribe(() => {
      this.alertMessage('success', '分享成功');
      this.closeModal();
    }, error => {
      this.alertMessage('error', error.msg || '分享失败');
    })
  }

  //注册
  onRegister(phone: string) {
    //TODO:未调用接口，测试用
    this.alertMessage('success', phone + '注册成功');
  }



  private alertMessage(type: string, msg: string) {
    this.messageServe.create(type, msg)
  }

  private listenStates() {
    const appStore$ = this.store$.pipe(select(getMember));
    const stateArr: { type: any, cb: any }[] = [
      {
        type: selectLikeId,
        cb: id => this.watchListId(id)
      },
      {
        type: selectModalVisible,
        cb: visib => this.warchModalVisible(visib)
      },
      {
        type: selectModalType,
        cb: modalType => this.watchModalType(modalType)
      },
      {
        type: selectShareInfo,
        cb: info => this.watchShareInfo(info)
      },
    ]
    stateArr.forEach(item => {
      appStore$.pipe(select(item.type)).subscribe(item.cb);
    });
  }

  private watchListId(id: string) {
    if (id) {
      this.likeId = id;
    }
  }
  private watchModalType(modalType: ModalTypes) {
    if (this.currentModalType !== modalType) {
      if (modalType === ModalTypes.Like) {
        this.onLoadMySheet()
      }
      this.currentModalType = modalType;
    }
  }
  private warchModalVisible(visib: boolean) {
    if (this.visible !== visib) {
      this.visible = visib;
    }
  }

  private watchShareInfo(info: ShareInfo) {
    if (info) {
      if (!this.user) {
        this.openModal(ModalTypes.Default);
        return;
      }
      this.shareInfo = info;
      this.openModal(ModalTypes.Share);
    }
  }
}
