import { Injectable, Inject } from "@angular/core";
import { ServicesModule, API_CONFIG } from './services.module';
import { Observable } from 'rxjs';
import { Banner, HotTag, SongSheet, SampleBack } from '../types/common.model';
import { HttpClient, HttpParams } from '@angular/common/http';
import { map } from 'rxjs/internal/operators';
import { LoginParams } from '../share/wy-ui/wy-layer/wy-layer-login/wy-layer-login.component';
import { RecordVal, Signin, User, UserRecord, UserSheet } from './data-types/member.type';
import queryString from "query-string";


export enum RecordType {
    allData,
    weekData
}

export type LikeSongParams = {
    pid: string;
    tracks: string;
    op?: "add" | "upload";
}
export type ShareParams = {
    id: string;
    msg: string;
    type: string;
}

@Injectable({
    providedIn: ServicesModule
})
export class MemberService {


    constructor(
        private http: HttpClient,
        @Inject(API_CONFIG) private url: string
    ) { }

    /**登录 */
    login(formValue: LoginParams): Observable<User> {
        const params = new HttpParams({ fromString: queryString.stringify(formValue) });
        return this.http.get(this.url + "login/cellphone", { params }).pipe(map((res) => res as User))
    }
    /**用户详情 */
    getUserDetail(uid: string): Observable<User> {
        const params = new HttpParams({ fromString: queryString.stringify({ uid }) });
        return this.http.get(this.url + "user/detail", { params }).pipe(map((res) => res as User))
    }
    //退出
    logout(): Observable<SampleBack> {
        return this.http.get(this.url + "logout").pipe(map((res) => res as SampleBack))
    }
    //签到
    signin(): Observable<Signin> {
        const params = new HttpParams({ fromString: queryString.stringify({ type: 1 }) });
        return this.http.get(this.url + 'daily_signin', { params }).pipe(map(res => res as Signin));
    }

    /**获取听歌记录 */
    getUserRecord(uid: string, type = RecordType.weekData): Observable<RecordVal[]> {
        const params = new HttpParams({ fromString: queryString.stringify({ uid, type }) });
        return this.http.get(this.url + 'user/record', { params }).pipe(map((res: UserRecord) => res[RecordType[type]]))
    }

    /**获取用户歌单 */
    getUserSheets(uid: string): Observable<UserSheet> {
        const params = new HttpParams({ fromString: queryString.stringify({ uid }) });
        return this.http.get(this.url + 'user/playlist', { params }).pipe(map((res: { playlist: SongSheet[] }) => {
            const list = res.playlist;
            return {
                self: list.filter(item => !item.subscribed),
                subscribed: list.filter(item => item.subscribed),
            }
        }))
    }
    /**收藏歌曲 */
    likeSong({ pid, tracks }: LikeSongParams): Observable<number> {
        const params = new HttpParams({ fromString: queryString.stringify({ pid, tracks, op: "add" }) });
        return this.http.get(this.url + 'playlist/tracks', { params }).pipe(map((res: SampleBack) => res.code));
    }
    /**新建歌单 */
    createSheet(name: string): Observable<string> {
        const params = new HttpParams({ fromString: queryString.stringify({ name }) });
        return this.http.get(this.url + 'playlist/create', { params }).pipe(map((res: SampleBack) => res.id.toString()));
    }
    /**收藏歌单 */
    likeSheet(id: string, t = 1): Observable<number> {
        const params = new HttpParams({ fromString: queryString.stringify({ id, t }) });
        return this.http.get(this.url + 'playlist/subscribe', { params }).pipe(map((res: SampleBack) => res.code));
    }

    /**收藏歌手 */
    likeSinger(id: string, t = 1): Observable<number> {
        const params = new HttpParams({ fromString: queryString.stringify({ id, t }) });
        return this.http.get(this.url + 'artist/sub', { params }).pipe(map((res: SampleBack) => res.code));
    }


    // 分享
    shareResource({ id, msg, type }: ShareParams): Observable<number> {
        const params = new HttpParams({ fromString: queryString.stringify({ id, msg, type }) });
        return this.http.get(this.url + 'share/resource', { params }).pipe(map((res: SampleBack) => res.code));
    }

}