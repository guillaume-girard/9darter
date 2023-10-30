import { Injectable } from "@angular/core";
import { environment } from "src/environments/environment.development";
import { PlayerService } from "./players.service";
import { AppComponent } from "../app.component";

@Injectable({
  providedIn: 'root'
})
export class DebugService {

  constructor(private playerService: PlayerService) {}

  loadState(appComponent: AppComponent): void {
    // Load des joueurs fictifs
    const nbPlayersToLoad = environment.loadNbPlayers;
    if (nbPlayersToLoad > 0) {
      this.playerService.addPlayer("Steve");
    }
    if (nbPlayersToLoad > 1) {
      this.playerService.addPlayer("Carlier");
    }
    if (nbPlayersToLoad > 2) {
      this.playerService.addPlayer("Roi à pois");
    }
    if (nbPlayersToLoad > 3) {
      this.playerService.addPlayer("Marion");
    }

    if (environment.loadGame) {
      // Load du jeu fictif
      appComponent.launchGame(environment.loadGame);
    }
  }
}