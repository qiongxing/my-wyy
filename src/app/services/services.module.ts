import { NgModule, InjectionToken, PLATFORM_ID } from '@angular/core';
import { CommonModule, isPlatformBrowser } from '@angular/common';
import { httpInterceptorProvides } from './http-interceptors';
import { environment } from 'src/environments/environment';

export const API_CONFIG = new InjectionToken('ApiConfigToken')
export const WINDOW = new InjectionToken('WindowToken')

@NgModule({
  declarations: [],
  imports: [
    CommonModule
  ],
  providers: [
    { provide: API_CONFIG, useValue: '/api/' },
    {
      provide: WINDOW,
      useFactory: (platformId): Window | Object => {
        return isPlatformBrowser(platformId) ? window : {}
      },
      deps: [PLATFORM_ID]
    },
    httpInterceptorProvides,
  ]
})
export class ServicesModule { }
