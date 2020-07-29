import { Injectable, Inject } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { API_CONFIG } from './services.module';
import { Observable, of } from 'rxjs';
import { Singer, SongUrl, Song, Lyrics } from '../types/common.model';
import queryString from 'query-string';
import { map } from 'rxjs/internal/operators';

@Injectable({
  providedIn: 'root'
})
export class SongService {
  constructor(private http: HttpClient, @Inject(API_CONFIG) private url: string) { }

  getSongUrl(ids: string): Observable<SongUrl[]> {
    const params = new HttpParams().set('id', ids);
    return this.http.get(this.url + 'song/url', { params })
      .pipe(map((res: { data: SongUrl[] }) => res.data));
  }
  // getSongList(songs: Song | Song[]): Observable<Song[]> {
  //   const songArr = Array.isArray(songs) ? songs.slice() : [songs];
  //   const ids = songArr.map(item => item.id).join(",");
  //   return Observable.create(observer => {
  //     this.getSongUrl(ids).subscribe(urls => {
  //       observer.next(this.generateSongList(songArr, urls));
  //     })
  //   })
  // }
  getSongList(songs: Song | Song[]): Observable<Song[]> {
    const songArr = Array.isArray(songs) ? songs.slice() : [songs];
    const ids = songArr.map(item => item.id).join(",");
    return this.getSongUrl(ids).pipe(
      map((urls) => this.generateSongList(songArr, urls))
    )
  }
  private generateSongList(songs: Song[], urls: SongUrl[]): Song[] {
    const result = [];
    songs.forEach(song => {
      const url = urls.find(url => url.id === song.id).url;
      if (url) {
        result.push({ ...song, url })
      }
    });
    return result;
  }
  /**获取歌词
   * @param id 歌曲id
   */
  getLyrics(id: number): Observable<Lyrics> {
    const params = new HttpParams().set('id', id.toString());
    const lyricsUrl = this.url + 'lyric';
    return this.http.get(lyricsUrl, { params }).pipe(map((res: { [key: string]: { lyric: string } }) => {
      try {
        return {
          lyric: res.lrc.lyric,
          tlyric: res.tlyric.lyric
        }
      } catch{
        return {
          lyric: '[00:00.000]本歌曲暂无歌词',
          tlyric: ''
        }
      }
    }))
  }
}
