import { Component } from '@angular/core';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.less']
})
export class AppComponent {
  title = 'WyyApp';
  menu = [
    {
      label: '发现',
      path: '/home'
    },
    {
      label:'歌单',
      path:'/sheet'
    }
  ]
}
