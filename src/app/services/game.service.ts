import { Injectable, OnDestroy } from '@angular/core';
import { Observable, Subject } from 'rxjs';
import { GameButton } from '../classes/GameButton';

@Injectable({
  providedIn: 'root'
})
export class GameService implements OnDestroy {

  readonly NUM_OF_BUTTONS = 6;
  readonly COLORS = ["red", "blue", "yellow", "green", "purple", "greenyellow"]
  gameButtons = new Array<GameButton>();
  playerGuess = new Array()
  lightSequence = new Array();
  level: number = 1;
  localStorage = window.localStorage;
  gameOver: boolean = false;
  playerName: string = '';
  leaderboard = new Array<any>();
  gameStarted: boolean = false;
  gameData: Subject<Object> = new Subject<Object>();

  constructor() { }

  /**
   * initialize the game
   * @returns game buttons
   */
  initGame() {
    for (let i = 0; i < this.COLORS.length; i++) {
      let button = new GameButton(this.COLORS[i]);
      this.gameButtons.push(button);
    }
    this.getLeaderboard();
    this.updateGameData(this.level, this.leaderboard, this.gameStarted);
    this.gameStarted = true;
    return this.gameButtons;
  }

  setPlayerName(name: string) {
    this.playerName = name;
  }

  /**
   * actions after a color button was clicked
   * @param color Index of the color that was clicked
   */
  buttonClick(color: number) {
    this.playerGuess.push(color);

    if (!this.compare()) {
      this.gameOver = true;
      setTimeout(() => {
        alert("GAME OVER")
      }, 100);
      this.playerGuess = [];
      this.lightSequence = [];
      this.level = 1;
      this.gameStarted = false;
      this.updateGameData(this.level, this.leaderboard, this.gameStarted);
      this.saveInLocalStorage();
    }
  }

  /**
   * Play animation of blinking buttons
   */
  play() {
    // Setting a timeout, so the user can notice which buttons blinked
    setTimeout(() => {
      this.addSequence()
      this.showSequence();
    }, 1000);

    this.saveInLocalStorage();/////////
  }

  /**
   * add a sequence to the blinking buttons
   */
  addSequence() {
    let colorIndex = Math.floor(Math.random() * this.COLORS.length);
    this.lightSequence.push(colorIndex)
  }

  async showSequence() {
    if (!this.gameOver) {

      for (let i = 0; i < this.lightSequence.length; i++) {
        let gameButtonPosition = this.lightSequence[i];

        setTimeout(() => {
          this.gameButtons[gameButtonPosition].isOn = true;
        }, 50);
        await this.turnButtonOff(gameButtonPosition)
      }

    }
  }

  /**
   * Turning off a button 
   * @param index the index of the button we want to turn off
   */
  turnButtonOff(index: number) {
    return new Promise(resolve => {
      setTimeout(() => {
        this.gameButtons[index].isOn = false;
        resolve(true)
      }, 500);
    })

  }

  /**
   * compares between the game sequence and sequence the player have entered
   * @returns boolean that indicates if the sequences are equals
   */
  compare(): boolean {
    for (let i = 0; i < this.playerGuess.length; i++) {
      if (this.playerGuess[i] !== this.lightSequence[i]) {
        return false;
      }
    }

    if (this.playerGuess.length === this.lightSequence.length) {
      this.updateLevel();
    }
    return true;
  }

  /**
   * Updates the level of the game
   */
  updateLevel() {
    this.level++;
    this.playerGuess = [];
    this.saveInLocalStorage();
    this.play();
    this.updateGameData(this.level, this.leaderboard, this.gameStarted);
  }

  /**
   * Save leaderboard in local storage
   */
  saveInLocalStorage() {
    let scoreValue = {
      name: this.playerName,
      highscore: this.level
    }

    //In case there are no records
    if (this.leaderboard.length == 0) {
      this.leaderboard.push(scoreValue)
    }
    else {
      // Search if the current player have a record, and if we need to update it
      if (this.leaderboard.length > 0) {
        var record = this.leaderboard.find((record: { name: string; }) => record.name === this.playerName);
        if (record) {
          if (record.highscore < this.level) {
            record.highscore = this.level;
          }
        }
        else {
          this.leaderboard.push(scoreValue)
        }
      }
    }

    // Sort the leaderboard so the highest score will remain on the top
    this.leaderboard.sort((a, b) => b.highscore - a.highscore)
    //Storing only top 5 records
    if (this.leaderboard.length >= 6) {
      this.leaderboard.pop()
    }
    this.localStorage.setItem("leaderboard", JSON.stringify(this.leaderboard))
  }

  /**
   * Load leaderboard from local storage
   * @returns leaderboard array, or an empty array - in case there is no leaderboard on storage
   */
  getLeaderboard() {
    let leaderboardString = this.localStorage.getItem("leaderboard");
    if (leaderboardString != null) {
      this.leaderboard = JSON.parse(leaderboardString);
      return JSON.parse(leaderboardString);
    }
    else
      return []
  }

  /**
   * Start the game
   */
  start() {
    this.level = 1;
    this.playerGuess = [];
    this.lightSequence = [];
    this.gameOver = false;
    this.gameStarted = true;
    this.updateGameData(this.level, this.leaderboard, this.gameStarted);
    this.play();
  }

  updateGameData(level: number, leaderboard: any, gameStarted: boolean) {
    this.gameData.next({ level: level, leaderboard: leaderboard, gameStarted: gameStarted })
  }

  /**Sends next turn information to the subscribers */
  getGameData(): Observable<any> {
    return this.gameData.asObservable()
  }

  ngOnDestroy() {
    this.playerGuess = [];
    this.lightSequence = [];
    this.level = 1;
    this.gameStarted = false;
    this.gameButtons = new Array<GameButton>();
    this.updateGameData(this.level, this.leaderboard, this.gameStarted);
  }
}
