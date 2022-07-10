import { Component, Input, OnInit } from '@angular/core';
import { Router } from '@angular/router';


@Component({
  selector: 'sidebar',
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.css']
})
export class SidebarComponent implements OnInit {

  constructor(private router: Router) { }
  @Input() leaderboard = new Array<any>();
  @Input() gameStarted: boolean = false;

  ngOnInit(): void {
  }

  goToHomepage() {
    this.router.navigate([''], { skipLocationChange: true })
  }
}
