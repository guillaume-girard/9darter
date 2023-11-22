import { Injectable } from "@angular/core";
import { Player } from "../models/player.model";
import { BehaviorSubject, Subject } from "rxjs";
import { X01Player } from "../models/x01player.model";
import { CricketPlayer } from "../models/cricket-player.model";

@Injectable({
  providedIn: 'root'
})
export class PlayerService {
  private allPlayers: Player[] = [];
  private availablePlayers: Player[] = [];
  private selectedPlayers: Player[] = [];

  $availablePlayers: BehaviorSubject<Player[]>;
  $selectedPlayers: BehaviorSubject<Player[]>;
  private lastPlayerId = 0;
  $nbPlayersChange: Subject<number> = new Subject<number>();

  constructor() {
    this.$availablePlayers = new BehaviorSubject(this.availablePlayers);
    this.$selectedPlayers = new BehaviorSubject(this.selectedPlayers);

    const storedPlayers = localStorage.getItem("9darterplayers") || "";
    if (storedPlayers.length > 0) {
      let storedPlayersJSON: string[] = JSON.parse(storedPlayers);

      for(let name of storedPlayersJSON) {
        this.addAvailablePlayer(name, false);
      }
    }

    this.allPlayers = this.availablePlayers.concat(this.selectedPlayers);
    this.$availablePlayers.next(this.availablePlayers);
  }

  private storePlayers(): void {
    localStorage.setItem("9darterplayers", JSON.stringify(this.allPlayers.map(p => p.name)));
  }

  public addAvailablePlayer(playerName: string, done: boolean = true): void {
    let newPlayer: Player = { id: this.lastPlayerId++, name: playerName };
    this.availablePlayers.push(newPlayer);
    
    if(done) {
      this.allPlayers = this.availablePlayers.concat(this.selectedPlayers);
      this.$availablePlayers.next(this.availablePlayers);
      this.storePlayers();
    }
  }

  public deletePlayer(playerId: number): void {
    let playerToDelete = this.availablePlayers.find(player => player.id === playerId);
    console.log("going to delete: ", playerToDelete);
    
    if (playerToDelete) {
      let playerIndexToDelete = this.availablePlayers.indexOf(playerToDelete);
      console.log("index in availablePlayers and availablePlayers statebefore", playerIndexToDelete, "length:", this.availablePlayers.length, JSON.stringify(this.availablePlayers));
      this.availablePlayers.splice(playerIndexToDelete, 1);
      console.log("availablePlayers stateafter: ", this.availablePlayers.length, JSON.stringify(this.availablePlayers));
      
      console.log("allplayer before", this.allPlayers);
      this.allPlayers = this.availablePlayers.concat(this.selectedPlayers);
      console.log("allplayer after", this.allPlayers);

      this.$availablePlayers.next(this.availablePlayers);

      this.storePlayers();
    }
  }

  public setDebugPlayers(nbPlayers: number): void {
    let limit = nbPlayers;
    if (nbPlayers > this.availablePlayers.length) {
      let limit = this.availablePlayers.length;
      console.warn("Pas assez de joueurs disponibles, seulement " + limit + " ajoutés")
    }
    let players: Player[] = [];
    for(let i = 0; i < limit; i++) {
      let pl: Player|undefined = this.availablePlayers.shift();
      if (pl) {
        players.push(pl);
      }
    }
    this.setSelectedPlayers(players);
  }

  public setSelectedPlayers(players: Player[]) {
    this.selectedPlayers = players;
    this.$selectedPlayers.next(this.selectedPlayers);
    this.$nbPlayersChange.next(this.selectedPlayers.length);
  }

  public setAvailablePlayers(players: Player[]) {
    this.availablePlayers = players;
    this.$availablePlayers.next(this.availablePlayers);
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