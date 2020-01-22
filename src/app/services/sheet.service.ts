import { Injectable, Inject } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { API_CONFIG } from './services.module';
import { Observable } from 'rxjs';
import { Singer } from '../types/common.model';
import queryString from 'query-string';
import { map } from 'rxjs/internal/operators';

@Injectable({
  providedIn: 'root'
})
export class SingerService {
  constructor(private http: HttpClient, @Inject(API_CONFIG) private url: string) { }

  getSongSheetDetail(id: number): Observable<Singer[]> {
    //queryString为angular某个某块引入的第三方库，所以不需要导入
    const params = new HttpParams().set('id', id.toString());
    return this.http.get(this.url + 'playlist/detail', { params })
      .pipe(map((res: { artists }) => res.artists));
  }
}
