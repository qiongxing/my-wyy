import { Injectable, Inject } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { API_CONFIG } from './services.module';
import { Observable } from 'rxjs';
import { Singer } from '../types/common.model';
import queryString from 'query-string';
import { map } from 'rxjs/internal/operators';

type SingerParams = {
  offset: number;
  limit: number;
  cat?: string;
}

const defaultParams: SingerParams = {
  offset: 0,
  limit: 9,
  cat: '5001'
}
@Injectable({
  providedIn: 'root'
})
export class SingerService {
  constructor(private http: HttpClient, @Inject(API_CONFIG) private url: string) { }

  getEnterSinger(args: SingerParams = defaultParams): Observable<Singer[]> {
    //queryString为angular某个某块引入的第三方库，所以不需要导入
    const params = new HttpParams({ fromString: queryString.stringify(args) });
    return this.http.get(this.url + 'artist/list', { params })
      .pipe(map((res: { artists }) => res.artists));
  }
}
