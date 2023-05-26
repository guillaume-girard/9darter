import { Component } from '@angular/core';
import { Player } from 'src/app/models/player.model';

@Component({
  selector: 'app-player-list',
  templateUrl: './player-list.component.html',
  styleUrls: ['./player-list.component.scss']
})
export class PlayerListComponent {
  players: Player[] = [];
  playerName: string = '';
  lastPlayerId = 0;
  
  addPlayer(player: Player): void {
    this.players.push(player);
  }

  removePlayer(playerId: number): void {
    let playerToRemove = this.players.find(player => player.id === playerId);

    if (playerToRemove) {
      let playerIndexToRemove = this.players.indexOf(playerToRemove);
      this.players.splice(playerIndexToRemove, 1);
    }
  }

  onSubmitNewPlayer(): void {
    if (this.playerName.length > 0) {
      let newPlayer: Player = { id: this.lastPlayerId++, name: this.playerName };
      this.addPlayer(newPlayer);
      this.playerName = '';
    }
  }
}
