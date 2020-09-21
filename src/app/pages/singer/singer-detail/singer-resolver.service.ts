import { Injectable } from '@angular/core';
import { Resolve, ActivatedRouteSnapshot } from '@angular/router';
import { Singer, SingerDetail } from 'src/app/types/common.model';
import { forkJoin, Observable } from 'rxjs';
import { SingerService } from 'src/app/services/singer.service';
import { first } from 'rxjs/internal/operators';

type SingerDetailDataModel = [SingerDetail, Singer[]]

@Injectable()
export class SingerResolverService implements Resolve<SingerDetailDataModel> {
    constructor(
        private singerServe: SingerService
    ) { }
    resolve(route: ActivatedRouteSnapshot): Observable<SingerDetailDataModel> {
        const id = route.paramMap.get('id');
        return forkJoin([
            this.singerServe.getSingerDetail(id),
            this.singerServe.getSimiSinger(id)
        ]).pipe(first());
    }

}