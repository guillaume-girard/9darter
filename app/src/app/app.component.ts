import { Component } from '@angular/core';
import { PlayerService } from './services/players.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  targetValues: string[] = [];
  gameLoaded = false;
  canLaunchGame = false;


  constructor(private playerService: PlayerService) {}
  
  ngOnInit(): void {
    this.playerService.nbPlayersChange.subscribe((value) => this.canLaunchGame = value > 0);
  }

  targetValueInput(targetValue: string): void {
    this.targetValues.push(targetValue);
  }

  launch301Game() {
    this.gameLoaded = true;
  }
}
