import { Injectable, Inject } from "@angular/core";
import { ServicesModule, API_CONFIG } from './services.module';
import { Observable } from 'rxjs';
import { Banner, HotTag, SongSheet } from '../types/common.model';
import { HttpClient } from '@angular/common/http';
import { map } from 'rxjs/internal/operators';

@Injectable({
    providedIn: ServicesModule
})
export class HomeService {
    constructor(private http: HttpClient, @Inject(API_CONFIG) private url: string) { }
    getBanners(): Observable<Banner[]> {
        return this.http.get(this.url + 'banner').pipe(map((res: { banners: Banner[] }) => res.banners))
    }
    //获取论文标签
    getHotTags(): Observable<HotTag[]> {
        return this.http.get(this.url + 'playlist/hot').pipe(map((res: { tags: HotTag[] }) => res.tags
            .sort((x: HotTag, y: HotTag) => x.position - y.position).slice(0, 5)))
    }
    //获取推荐歌单
    getPerosonalSheetList(): Observable<SongSheet[]> {
        return this.http.get(this.url + 'personalized').pipe(map((res: { result: SongSheet[] }) => res.result.slice(0, 16)))
    }
}