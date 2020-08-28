import { Injectable } from '@angular/core';
import { Resolve, ActivatedRouteSnapshot } from '@angular/router';
import { SingerDetail } from 'src/app/types/common.model';
import { Observable } from 'rxjs';
import { SingerService } from 'src/app/services/singer.service';

@Injectable()
export class SingerResolverService implements Resolve<SingerDetail> {
    constructor(
        private singerServe: SingerService
    ) { }
    resolve(route: ActivatedRouteSnapshot): Observable<SingerDetail> {
        const id = route.paramMap.get('id');
        return this.singerServe.getSingerDetail(id);
    }

}