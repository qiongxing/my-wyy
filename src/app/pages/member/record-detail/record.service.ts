import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, Resolve, Router } from '@angular/router';
import { Observable, forkJoin } from 'rxjs';
import { Singer, SongSheet, HotTag, Banner } from 'src/app/types/common.model';
import { HomeService } from 'src/app/services/home.service';
import { SingerService } from 'src/app/services/singer.service';
import { first } from 'rxjs/internal/operators';
import { MemberService } from 'src/app/services/member.service';
import { RecordVal, User, UserSheet } from 'src/app/services/data-types/member.type';

type CenterDataType = [User, RecordVal[]]
@Injectable()
export class RecordResolverService implements Resolve<CenterDataType> {
    constructor(
        private router: Router,
        private memberServe: MemberService
    ) { }

    resolve(route: ActivatedRouteSnapshot): Observable<CenterDataType> {
        const uid = route.paramMap.get("id");
        if (uid) {
            return forkJoin([
                this.memberServe.getUserDetail(uid),
                this.memberServe.getUserRecord(uid),
            ]).pipe(first());
        } else {
            this.router.navigate(["/home"]);
        }
    }
}