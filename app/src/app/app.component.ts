import { Component } from '@angular/core';
import { PlayerService } from './services/players.service';
import { GameX01Options } from './models/games-options.model';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  gameOptions: any;
  gameLoaded = false;
  canLaunchGame = false;

  constructor(private playerService: PlayerService) {}
  
  ngOnInit(): void {
    this.playerService.nbPlayersChange.subscribe((value) => this.canLaunchGame = value > 0);
  }

  launchGame(gameOptions: any) {
    switch(gameOptions.gameMode) {
      case '301': 
        this.launch301Game(gameOptions.isDoubleOut, gameOptions.nbLegsToWin);
        return;
      case '501': 
        this.launch501Game(gameOptions.isDoubleOut, gameOptions.nbLegsToWin);
        return;
      case 'cricket': 
        this.launchCricketGame(gameOptions.nbLegsToWin);
        return;
      default: 
        this.launch301Game(gameOptions.isDoubleOut, gameOptions.nbLegsToWin);
        return;
    }
  }
  
  launch301Game(isDoubleOut: boolean, nbLegsToWin: number) {
    this.gameOptions = {gameType: '301', isDoubleOut: isDoubleOut, nbLegsToWin: nbLegsToWin};
    this.gameLoaded = true;
  }
  
  launch501Game(isDoubleOut: boolean, nbLegsToWin: number) {
    this.gameOptions = {gameType: '501', isDoubleOut: isDoubleOut, nbLegsToWin: nbLegsToWin};
    this.gameLoaded = true;
  }

  launchCricketGame(nbLegsToWin: number) {
    console.log("lancer le cricket");
  }

  showGameLoader() {
    this.gameLoaded = false;
  }
}
