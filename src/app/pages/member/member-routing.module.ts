import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { CenterResolverService } from './center/center-resolve.service';
import { CenterComponent } from './center/center.component';
import { RecordDetailComponent } from './record-detail/record-detail.component';
import { RecordResolverService } from './record-detail/record.service';


const routes: Routes = [
  { path: '', component: CenterComponent, data: { title: "个人中心" }, resolve: { user: CenterResolverService } },
  { path: 'records/:id', component: RecordDetailComponent, data: { title: "听歌记录" }, resolve: { user: RecordResolverService } },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
  providers: [CenterResolverService, RecordResolverService]
})
export class MemberRoutingModule { }
