import { Injectable, Inject } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { API_CONFIG } from './services.module';
import { Observable } from 'rxjs';
import { Singer, Song, SongSheet, SheetList } from '../types/common.model';
import queryString from 'query-string';
import { map, pluck, switchMap } from 'rxjs/internal/operators';
import { SongService } from './song.service';


export type SheetParams = {
  offset: number,
  limit: number,
  order: 'hot' | 'new',
  cat: string,
}

@Injectable({
  providedIn: 'root'
})
export class SheetService {
  constructor(
    private http: HttpClient,
    @Inject(API_CONFIG) private url: string,
    private songServe: SongService,
  ) { }
  /**返回歌单列表 */
  getSheet(args: SheetParams): Observable<SheetList> {
    const params = new HttpParams({ fromString: queryString.stringify(args) });
    return this.http.get(this.url + 'top/playlist', { params }).pipe(map(res => res as SheetList));
  }

  getSongSheetDetail(id: number): Observable<SongSheet[]> {
    const params = new HttpParams().set('id', id.toString());
    return this.http.get(this.url + 'playlist/detail', { params })
      .pipe(map((res: { playlist: SongSheet[] }) => res.playlist));
  }
  //返回歌单详情数据
  playSheet(id): Observable<Song[]> {
    return this.getSongSheetDetail(id).pipe(
      pluck('tracks'),
      switchMap((tracks: Song[]) => this.songServe.getSongList(tracks))
    )
  }
}
