import { Injectable } from '@angular/core';
import { Resolve, ActivatedRouteSnapshot } from '@angular/router';
import { SongSheet } from 'src/app/types/common.model';
import { Observable } from 'rxjs';
import { SheetService } from 'src/app/services/sheet.service';

@Injectable()
export class SheetInfoResolverService implements Resolve<SongSheet> {
    constructor(
        private sheetServe: SheetService
    ) { }
    resolve(route: ActivatedRouteSnapshot): Observable<SongSheet> {
        const id = route.paramMap.get('id');
        return this.sheetServe.getSongSheetDetail(Number(id));
    }

}