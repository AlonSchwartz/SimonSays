import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Subscription } from 'rxjs';
import { GameButton } from '../classes/GameButton';
import { GameService } from '../services/game.service';

@Component({
  selector: 'app-game',
  templateUrl: './game.component.html',
  styleUrls: ['./game.component.css']
})
export class GameComponent implements OnInit, OnDestroy {

  constructor(private gameService: GameService, private route: ActivatedRoute) { }

  numOfGameButtons = this.gameService.NUM_OF_BUTTONS;
  colors = this.gameService.COLORS;
  gameButtons = new Array<GameButton>();
  colSize = this.colors.length / 2;
  rowSize = this.colors.length / this.colSize;
  level?: number;
  gameStarted: boolean = false;
  leaderboard = [];
  gameData_subscripition?: Subscription;

  ngOnInit(): void {
    //Subscribe to changes for game data
    this.gameData_subscripition = this.gameService.getGameData().subscribe(data => {
      this.level = data.level;
      this.leaderboard = data.leaderboard;
      this.gameStarted = data.gameStarted;
    })

    this.gameButtons = this.gameService.initGame();
    this.route.queryParams.subscribe(param => {
      this.gameService.setPlayerName(param.playername);
    })
  }

  buttonClick(color: number) {
    if (this.gameStarted) {
      this.gameService.buttonClick(color)
    }
  }

  /**
   * requesting the service to start the game
   */
  start() {
    this.gameService.start();
  }

  ngOnDestroy() {
    this.gameData_subscripition?.unsubscribe();
    this.gameService.ngOnDestroy();
  }

}
