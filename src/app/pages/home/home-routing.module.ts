import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { HomeComponent } from './home.component';
import { HomeResolverService } from './home-resolve.service';


const routes: Routes = [
  { path: '', component: HomeComponent, data: { title: '发现' }, resolve: { homeDatas: HomeResolverService } }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class HomeRoutingModule { }
