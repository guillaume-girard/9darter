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

  constructor(private playerService: PlayerService) { }

  ngOnInit(): void {
    this.players = this.playerService.getPlayers();
  }

  removePlayer(playerId: number): void {
    this.playerService.removePlayer(playerId);
  }

  onSubmitNewPlayer(): void {
    if (this.playerName.length > 0) {
      this.playerService.addPlayer(this.playerName);
      this.playerName = '';
    }
  }
}
