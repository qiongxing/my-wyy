import { Injectable } from '@angular/core';
import { Resolve } from '@angular/router';
import { Observable, forkJoin } from 'rxjs';
import { Singer, SongSheet, HotTag, Banner } from 'src/app/types/common.model';
import { HomeService } from 'src/app/services/home.service';
import { SingerService } from 'src/app/services/singer.service';
import { first } from 'rxjs/internal/operators';

type HomeDataType = [Banner[], HotTag[], SongSheet[], Singer[]]
@Injectable()
export class HomeResolverService implements Resolve<HomeDataType> {
    constructor(private homeSer: HomeService, private singerService: SingerService) { }

    resolve(): Observable<HomeDataType> {
        return forkJoin([
            this.homeSer.getBanners(),
            this.homeSer.getHotTags(),
            this.homeSer.getPerosonalSheetList(),
            this.singerService.getEnterSinger(),
        ]).pipe(first());
    }
}