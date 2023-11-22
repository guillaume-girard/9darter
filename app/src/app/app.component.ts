import { Component } from '@angular/core';
import { PlayerService } from './services/players.service';
import { DebugService } from './services/debug.service';
import { environment } from 'src/environments/environment.development';

export const wobblingwrapper: HTMLSpanElement = (function() {
  const spanElmt = document.createElement("span");
  spanElmt.id = "wobblingwrapper";
  document.body.prepend(spanElmt);
  return spanElmt;
})();

export const grosvangerwen: HTMLImageElement = (function() {
  const imgElmt = document.createElement("img");
  imgElmt.id = "grosvangerwen";
  imgElmt.src = "./assets/van_gerwen_grosse_gueule.png";
  document.body.prepend(imgElmt);
  return imgElmt;
})();

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  gameOptions: any;
  gameLoaded = false;
  isX01Launched = false;
  isCricketLaunched = false;
  canLaunchGame = false;
  appVersion = environment.version;

  constructor(
      private playerService: PlayerService, 
      private debugService: DebugService
  ) {}
  
  ngOnInit(): void {
    // @TODO le playerService devrait sans doute être injecté dans le composant game-selector 
    // directement (utile seulement pour la variable canLaunchGame)
    this.playerService.$nbPlayersChange.subscribe((value) => this.canLaunchGame = value > 0);

    if (environment.loadDebug) {
      this.debugService.loadState(this);
    }
  }

  launchGame(gameOptions: any) {
    this.isX01Launched = false;
    this.isCricketLaunched = false;
    
    switch(gameOptions.gameMode) {
      case '301': 
        this.launch301Game(gameOptions.isDoubleOut, gameOptions.nbLegsToWin);
        break;
      case '501': 
        this.launch501Game(gameOptions.isDoubleOut, gameOptions.nbLegsToWin);
        break;
      case 'cricket': 
        this.launchCricketGame(gameOptions.isReverseCricket, gameOptions.isCrazyCricket, gameOptions.nbLegsToWin);
        break;
      default: 
        this.launch301Game(gameOptions.isDoubleOut, gameOptions.nbLegsToWin);
        break;
    }
  }
  
  launch301Game(isDoubleOut: boolean, nbLegsToWin: number) {
    this.gameOptions = {gameType: '301', isDoubleOut: isDoubleOut, nbLegsToWin: nbLegsToWin};
    this.gameLoaded = true;
    this.isX01Launched = true;
  }
  
  launch501Game(isDoubleOut: boolean, nbLegsToWin: number) {
    this.gameOptions = {gameType: '501', isDoubleOut: isDoubleOut, nbLegsToWin: nbLegsToWin};
    this.gameLoaded = true;
    this.isX01Launched = true;
  }
  
  launchCricketGame(isReverse: boolean, isCrazy: boolean, nbLegsToWin: number) {
    this.gameOptions = {isReverse: isReverse, isCrazy: isCrazy, nbLegsToWin: nbLegsToWin};
    this.gameLoaded = true;
    this.isCricketLaunched = true;
  }

  showGameLoader() {
    this.gameLoaded = false;
  }
}
