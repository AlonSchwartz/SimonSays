import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'welcome-page',
  templateUrl: './welcome-page.component.html',
  styleUrls: ['./welcome-page.component.css']
})
export class WelcomePageComponent implements OnInit {

  constructor(private route: ActivatedRoute, private router: Router) { }
  playerName = '';
  ngOnInit(): void {
  }

  submit() {
    this.router.navigate(['game'], { skipLocationChange: true, queryParams: { playername: this.playerName } })
  }
}
