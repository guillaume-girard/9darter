import { Component } from '@angular/core';
import { ConfirmationService } from 'primeng/api';
import { Player } from 'src/app/models/player.model';
import { PlayerService } from 'src/app/services/players.service';

@Component({
  selector: 'app-players-selector',
  templateUrl: './players-selector.component.html',
  styleUrls: ['./players-selector.component.scss'],
  providers: [ConfirmationService]
,
})
export class PlayersSelectorComponent {
  availablePlayers!: Player[];
  selectedPlayers!: Player[];
  playerName: string = '';

  constructor(
    private playerService: PlayerService,
    private confirmationService: ConfirmationService
    ) { }

  ngOnInit(): void {
    this.playerService.$availablePlayers.subscribe((players) => {
      this.availablePlayers = [...players];
    });
    this.playerService.$selectedPlayers.subscribe((players) => {
      this.selectedPlayers = [...players];
    });
  }

  deletePlayer(event: any, playerId: number): void {
    this.confirmationService.confirm({
      target: event.target as EventTarget,
      message: 'Supprimer le joueur ?',
      icon: 'pi pi-exclamation-triangle',
      accept: () => {
        this.playerService.deletePlayer(playerId);
        console.log("supprimé");
        // this.messageService.add({ severity: 'info', summary: 'Confirmed', detail: 'You have accepted' });
      },
      reject: () => {
        console.log("annulé")
          // this.messageService.add({ severity: 'error', summary: 'Rejected', detail: 'You have rejected' });
      }
    });
  }

  reorderSelectedPlayers(): void {
    this.playerService.setSelectedPlayers(this.selectedPlayers);
  }

  updateSelectedPlayers(): void {
    this.playerService.setSelectedPlayers(this.selectedPlayers);
    this.playerService.setAvailablePlayers(this.availablePlayers);
  }

  onSubmitNewPlayer(): void {
    let trimName = this.playerName.trim();
    if (trimName.length > 0) {
      this.playerService.addAvailablePlayer(trimName);
      this.playerName = '';
    }
  }
}
