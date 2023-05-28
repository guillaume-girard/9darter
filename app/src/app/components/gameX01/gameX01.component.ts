import { Component, Input, OnInit } from '@angular/core';
import { FormBuilder, FormControl } from '@angular/forms';
import { GameX01Computer } from 'src/app/models/game-computers/gameX01-computer.model';
import { GameX01Options } from 'src/app/models/games-options.model';
import { InputTargetService } from 'src/app/services/input-target.service';
import { PlayerService } from 'src/app/services/players.service';

@Component({
  selector: 'app-gameX01',
  templateUrl: './gameX01.component.html',
  styleUrls: ['./gameX01.component.scss']
})
export class GameX01Component implements OnInit {
  computer: GameX01Computer;
  revengeType: FormControl;
  keepAverage: FormControl;
  @Input() gameOptions!: GameX01Options;

  constructor(
    playerService: PlayerService,
    inputTargetService: InputTargetService,
    private formBuilder: FormBuilder
  ) {
    this.computer = new GameX01Computer(playerService, inputTargetService);
    this.revengeType = this.formBuilder.control('LOSER_FIRST');
    this.keepAverage = this.formBuilder.control(true);
  }

  ngOnInit(): void {
    this.computer.initGame(this.gameOptions.gameType, this.gameOptions.isDoubleOut, this.gameOptions.nbLegsToWin);
  }

  launchRevenge() {
    this.computer.reInitGame(this.revengeType.value, this.keepAverage.value);
  }
}


