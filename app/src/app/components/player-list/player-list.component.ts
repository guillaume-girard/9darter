import { ChangeDetectorRef, Component, Input } from '@angular/core';
import { Player } from 'src/app/models/player.model';
import { PlayerService } from 'src/app/services/players.service';


@Component({
  selector: 'app-player-list',
  templateUrl: './player-list.component.html',
  styleUrls: ['./player-list.component.scss']
})
export class PlayerListComponent {
  availablePlayers!: Player[];
  selectedPlayers!: Player[];
  playerName: string = '';

  constructor(private playerService: PlayerService) { 
    console.log(this.playerService.getAvailablePlayers());
    setTimeout(() => {
      this.availablePlayers = this.playerService.getAvailablePlayers();
    }, 1000);
  }

  ngOnInit(): void {
      this.playerService.$availablePlayers.subscribe((players) => {
      this.availablePlayers = players;
      console.log("init player list subscribe", this.availablePlayers);
    });
    this.selectedPlayers = [];
  }

  removePlayer(playerId: number): void {
    this.playerService.removePlayer(playerId);
  }

  updateSelectedPlayers(): void {
    this.playerService.setSelectedPlayers(this.selectedPlayers);
  }

  onSubmitNewPlayer(): void {
    let trimName = this.playerName.trim();
    if (trimName.length > 0) {
      this.playerService.addPlayer(trimName);
      this.playerName = '';
    }
  }
}
