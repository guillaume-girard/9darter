import { Component, Input } from '@angular/core';
import { FormControl, FormBuilder } from '@angular/forms';
import { GameCricketComputer } from 'src/app/models/game-computers/game-cricket-computer.model';
import { GameCricketOptions } from 'src/app/models/games-options.model';
import { InputTargetService } from 'src/app/services/input-target.service';
import { PlayerService } from 'src/app/services/players.service';

@Component({
  selector: 'app-game-cricket',
  templateUrl: './game-cricket.component.html',
  styleUrls: ['./game-cricket.component.scss']
})
export class GameCricketComponent {
  computer: GameCricketComputer;
  revengeType: FormControl;
  @Input() gameOptions!: GameCricketOptions;

  constructor(
    playerService: PlayerService,
    inputTargetService: InputTargetService,
    private formBuilder: FormBuilder
  ) {
    this.computer = new GameCricketComputer(playerService, inputTargetService);
    this.revengeType = this.formBuilder.control('LOSER_FIRST');
  }

  ngOnInit(): void {
    this.computer.initGame(this.gameOptions.isReverse, this.gameOptions.isCrazy, this.gameOptions.nbLegsToWin);
  }

  launchRevenge() {
    this.computer.reInitGame(this.revengeType.value);
  }
}
