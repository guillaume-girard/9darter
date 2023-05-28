import { Injectable } from "@angular/core";
import { Player } from "../models/player.model";
import { Subject } from "rxjs";
import { X01Player } from "../models/x01player.model";

@Injectable({
  providedIn: 'root'
})
export class PlayerService {
  players: Player[] = [];
  private lastPlayerId = 0;
  nbPlayersChange: Subject<number> = new Subject<number>();

  public addPlayer(playerName: string): void {
    let newPlayer: Player = { id: this.lastPlayerId++, name: playerName, order: this.players.length + 1 };
    this.players.push(newPlayer);
    this.nbPlayersChange.next(this.players.length);
  }

  public removePlayer(playerId: number): void {
    let playerToRemove = this.players.find(player => player.id === playerId);

    if (playerToRemove) {
      let playerIndexToRemove = this.players.indexOf(playerToRemove);
      this.players.splice(playerIndexToRemove, 1);

      for (let i = playerIndexToRemove; i < this.players.length; i++) {
        this.players[i].order--;
      }
      
      this.nbPlayersChange.next(this.players.length);
    }
  }

  public getPlayers(): Player[] {
    return this.players;
  }

  public getPlayersForX01Game(startScore: number): X01Player[] {
    let x01Players: X01Player[] = [];

    for (let i = 0; i < this.players.length; i++) {
      x01Players[i] = new X01Player(this.players[i], startScore);
    }

    return x01Players;
  }
}