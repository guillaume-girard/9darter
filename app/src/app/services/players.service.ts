import { Injectable } from "@angular/core";
import { Player } from "../models/player.model";
import { Subject } from "rxjs";
import { X01Player } from "../models/x01player.model";
import { CricketPlayer } from "../models/cricket-player.model";

@Injectable({
  providedIn: 'root'
})
export class PlayerService {
  availablePlayers: Player[] = [];
  selectedPlayers: Player[] = [];
  $availablePlayers: Subject<Player[]> = new Subject<Player[]>();
  $selectedPlayers: Subject<Player[]> = new Subject<Player[]>();
  private lastPlayerId = 0;
  nbPlayersChange: Subject<number> = new Subject<number>();

  constructor() {
    // Permet de trigger le subject.next() après les ngOninit @TODO comportement à optimiser
    setTimeout(() => {
      let storedPlayers = localStorage.getItem("9darterplayers") || "";
      if (storedPlayers.length > 0) {
        let storedPlayersJSON: string[] = JSON.parse(storedPlayers);

        for(let name of storedPlayersJSON) {
          this.addPlayer(name);
        }
      }
    })
  }

  private storePlayers(): void {
    localStorage.setItem("9darterplayers", JSON.stringify(this.availablePlayers.map(p => p.name)));
  }

  public addPlayer(playerName: string): void {
    let newPlayer: Player = { id: this.lastPlayerId++, name: playerName };
    this.availablePlayers.push(newPlayer); // this.$available.value à voir
    this.$availablePlayers.next(this.availablePlayers);
    
    this.nbPlayersChange.next(this.availablePlayers.length);

    this.storePlayers();
  }

  public removePlayer(playerId: number): void {
    let playerToRemove = this.availablePlayers.find(player => player.id === playerId);

    if (playerToRemove) {
      let playerIndexToRemove = this.availablePlayers.indexOf(playerToRemove);
      this.availablePlayers.splice(playerIndexToRemove, 1);
      this.nbPlayersChange.next(this.availablePlayers.length);
    }

    this.storePlayers();
  }

  public getAvailablePlayers(): Player[] {
    return this.availablePlayers;
  }

  public getSelectedPlayers(): Player[] {
    return this.selectedPlayers;
  }

  public setSelectedPlayers(players: Player[]) {
    this.selectedPlayers = players;
  }

  public getPlayersForX01Game(startScore: number): X01Player[] {
    let x01Players: X01Player[] = [];

    for (let player of this.selectedPlayers) {
      x01Players.push(new X01Player(player, startScore));
    }

    return x01Players;
  }

  getPlayersForCricketGame(targets: string[]): CricketPlayer[] {
    let cricketPlayers: CricketPlayer[] = [];

    for (let player of this.selectedPlayers) {
      cricketPlayers.push(new CricketPlayer(player, targets));
    }

    return cricketPlayers;
  }
}