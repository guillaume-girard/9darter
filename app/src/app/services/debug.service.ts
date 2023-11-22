import { Injectable } from "@angular/core";
import { environment } from "src/environments/environment.development";
import { PlayerService } from "./players.service";
import { AppComponent } from "../app.component";
import { fakerZU_ZA as faker } from '@faker-js/faker';

@Injectable({
  providedIn: 'root'
})
export class DebugService {

  constructor(private playerService: PlayerService) {}

  loadState(appComponent: AppComponent): void {
    // Load des joueurs
    const nbPlayersToLoad = environment.loadNbPlayers;
    this.playerService.setDebugPlayers(nbPlayersToLoad);

    // for (let i = 0; i < nbPlayersToLoad; i++) {
    //   this.playerService.addAvailablePlayer(faker.person.firstName());
    // }

    if (environment.loadGame) {
      // Load du jeu fictif
      appComponent.launchGame(environment.loadGame);
    }
  }
}