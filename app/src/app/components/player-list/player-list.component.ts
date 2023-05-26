import { Component, Input } from '@angular/core';
import { Player } from 'src/app/models/player.model';
import { PlayerService } from 'src/app/services/players.service';

@Component({
  selector: 'app-player-list',
  templateUrl: './player-list.component.html',
  styleUrls: ['./player-list.component.scss']
})
export class PlayerListComponent {
  players!: Player[];
  playerName: string = '';

  constructor(private service: PlayerService) { }

  ngOnInit(): void {
    this.players = this.service.getPlayers();
  }

  removePlayer(playerId: number): void {
    this.service.removePlayer(playerId);
  }

  onSubmitNewPlayer(): void {
    if (this.playerName.length > 0) {
      this.service.addPlayer(this.playerName);
      this.playerName = '';
    }
  }
}
