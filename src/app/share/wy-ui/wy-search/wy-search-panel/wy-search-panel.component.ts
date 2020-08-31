import { Component, OnInit } from '@angular/core';
import { SearchResult } from 'src/app/types/common.model';
import { Router } from '@angular/router';

@Component({
  selector: 'app-wy-search-panel',
  templateUrl: './wy-search-panel.component.html',
  styleUrls: ['./wy-search-panel.component.less']
})
export class WySearchPanelComponent implements OnInit {
  searchResult: SearchResult;
  constructor(
    private router: Router
  ) { }

  ngOnInit() {
  }
  toInfo(path: [string, number]) {
    if (path[1]) {
      this.router.navigate(path)
    }
  }
}
