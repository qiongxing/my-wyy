import { Injectable, Inject } from "@angular/core";
import { ServicesModule, API_CONFIG } from './services.module';
import { Observable } from 'rxjs';
import { Banner, HotTag, SongSheet } from '../types/common.model';
import { HttpClient } from '@angular/common/http';
import { map } from 'rxjs/internal/operators';
import { LoginParams } from '../share/wy-ui/wy-layer/wy-layer-login/wy-layer-login.component';
import { User } from './data-types/member.type';

@Injectable({
    providedIn: ServicesModule
})
export class MemberService {
    constructor(
        private http: HttpClient,
        @Inject(API_CONFIG) private url: string
    ) { }

    /**登录 */
    login(formValue: LoginParams): Observable<User> {
        return
    }
}