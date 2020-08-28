import { Injectable, Inject } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { API_CONFIG, ServicesModule } from './services.module';
import { Observable, of } from 'rxjs';
import { Singer, SongUrl, Song, Lyrics, SearchResult } from '../types/common.model';
import queryString from 'query-string';
import { map } from 'rxjs/internal/operators';

@Injectable({
  providedIn: ServicesModule
})
export class SearchService {
  constructor(
    private http: HttpClient,
    @Inject(API_CONFIG) private url: string
  ) { }

  search(keywords: string): Observable<SearchResult> {
    const params = new HttpParams().set('keywords', keywords);
    return this.http.get(this.url + 'search/suggest', { params }).pipe(map((res: { result: SearchResult }) =>
      res.result
    ))
  }

}
