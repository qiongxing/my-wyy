import { NgModule, InjectionToken } from '@angular/core';
import { CommonModule } from '@angular/common';

export const API_CONFIG=new InjectionToken('ApiConfigToken')

@NgModule({
  declarations: [],
  imports: [
    CommonModule
  ],
  providers:[
    {provide:API_CONFIG,useValue:'http://localhost:3000/'}
  ]
})
export class ServicesModule { }
