import { Injectable } from "@angular/core";
import { Player } from "../models/player.model";
import { Subject } from "rxjs";

@Injectable({
  providedIn: 'root'
})
export class PlayerService {
  players: Player[] = [];
  private lastPlayerId = 0;
  nbPlayersChange: Subject<number> = new Subject<number>();

  constructor(){ }

  public addPlayer(playerName: string): void {
    let newPlayer: Player = { id: this.lastPlayerId++, name: playerName };
    this.players.push(newPlayer);
    this.nbPlayersChange.next(this.players.length);
  }

  public removePlayer(playerId: number): void {
    let playerToRemove = this.players.find(player => player.id === playerId);

    if (playerToRemove) {
      let playerIndexToRemove = this.players.indexOf(playerToRemove);
      this.players.splice(playerIndexToRemove, 1);
      this.nbPlayersChange.next(this.players.length);
    }
  }

  public getPlayers(): Player[] {
    return this.players;
  }
}