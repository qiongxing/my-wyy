import { NgModule } from '@angular/core';
import { StoreModule } from '@ngrx/store';
import { playerReducer } from './reducers/plaer.reducer';
import { memberReducer } from './reducers/member.reducer';
import { StoreDevtoolsModule } from '@ngrx/store-devtools';
import { environment } from 'src/environments/environment';

@NgModule({
    declarations: [],
    imports: [
        StoreModule.forRoot({ player: playerReducer, member: memberReducer }, {
            runtimeChecks: {
                strictStateImmutability: true,
                strictActionImmutability: true,
                strictStateSerializability: true,
                strictActionSerializability: true,
            }
        }),
        StoreDevtoolsModule.instrument({
            maxAge: 25, // Retains last 25 states
            logOnly: environment.production, // Restrict extension to log-only mode
        }),
    ],
    exports: [],
    providers: [],
})
export class AppStoreModule { }