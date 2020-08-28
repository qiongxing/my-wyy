import { Injectable } from '@angular/core';
import { Resolve, ActivatedRouteSnapshot } from '@angular/router';
import { SongSheet, Song, Lyrics } from 'src/app/types/common.model';
import { Observable, forkJoin } from 'rxjs';
import { SheetService } from 'src/app/services/sheet.service';
import { SongService } from 'src/app/services/song.service';
import { first } from 'rxjs/internal/operators';

type SongDataModel = [Song, Lyrics]

@Injectable()
export class SongInfoResolverService implements Resolve<SongDataModel> {
    constructor(
        private songServe: SongService
    ) { }
    resolve(route: ActivatedRouteSnapshot): Observable<SongDataModel> {
        const id = route.paramMap.get('id');
        return forkJoin([
            this.songServe.getSongDetail(id),
            this.songServe.getLyrics(Number(id))
        ]).pipe(first())
    }

}