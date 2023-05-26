import { Component, EventEmitter, Input, Output } from '@angular/core';
import { Player } from 'src/app/models/player.model';

@Component({
  selector: 'app-player-list-item',
  templateUrl: './player-list-item.component.html',
  styleUrls: ['./player-list-item.component.scss']
})
export class PlayerListItemComponent {
  @Input() player!: Player;
  @Output() deletePlayer = new EventEmitter<number>();

  onClickRemove() {
    this.deletePlayer.emit(this.player.id);
  }
}
