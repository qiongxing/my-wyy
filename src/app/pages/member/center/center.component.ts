import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { map } from 'rxjs/internal/operators';

@Component({
  selector: 'app-center',
  templateUrl: './center.component.html',
  styleUrls: ['./center.component.less']
})
export class CenterComponent implements OnInit {

  constructor(
    private router: Router,
    private route: ActivatedRoute
  ) {
    this.route.data.pipe(map(res => res.user)).subscribe(([user, userRecord, userSheet]) => {
      console.log("user", user);
      console.log("userRecord", userRecord);
      console.log("userSheet", userSheet);
    })
  }

  ngOnInit() {
  }

}
