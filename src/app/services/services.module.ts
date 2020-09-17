import { NgModule, InjectionToken, PLATFORM_ID } from '@angular/core';
import { CommonModule, isPlatformBrowser } from '@angular/common';
import { httpInterceptorProvides } from './http-interceptors';

export const API_CONFIG = new InjectionToken('ApiConfigToken')
export const WINDOW = new InjectionToken('WindowToken')

@NgModule({
  declarations: [],
  imports: [
    CommonModule
  ],
  providers: [
    { provide: API_CONFIG, useValue: 'http://localhost:3000/' },
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
