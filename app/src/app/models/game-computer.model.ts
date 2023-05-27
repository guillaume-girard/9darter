import { Component, OnInit } from "@angular/core";
import { InputTargetService } from "../services/input-target.service";
import { PlayerService } from "../services/players.service";
import { PlayerInGame } from "./player.model";

@Component({
  template: ''
})
export abstract class GameComputerComponent implements OnInit {
  abstract players: PlayerInGame[];
  abstract currentPlayer: PlayerInGame;
  currentIndex: number;
  currentRank: number;

  constructor(
    protected playerService: PlayerService,
    protected inputTargetService: InputTargetService
  ) {
    this.currentIndex = 0;
    this.currentRank = 1;
  }

  ngOnInit() {
    this.inputTargetService.targetInputed.subscribe((value) => { this.createSnapshot; this.addDart(value) });
    this.inputTargetService.nextPlayer.subscribe(() => { this.endCurrentPlayerRound(); this.nextPlayer(); });
    this.inputTargetService.cancel.subscribe(() => this.restoreSnapshot());
  }

  protected abstract createSnapshot(): void;

  protected abstract restoreSnapshot(): void;

  protected abstract addDart(value: string): void;

  protected abstract finishGame(): void;

  protected startCurrentPlayerRound(): void {
    return;
  }

  protected endCurrentPlayerRound(): void {
    return;
  }

  protected nextPlayer(): void {
    this.inputTargetService.temporaryDisableNextPlayerButton();

    this.currentIndex++;

    if (this.currentIndex >= this.players.length) {
      this.currentIndex = 0;
    }

    if (this.players[this.currentIndex].finished) {
      this.nextPlayer();
    } else {
      this.currentPlayer = this.players[this.currentIndex];
      this.startCurrentPlayerRound();
    }
    return;
  }

  protected currentPlayerHasFinished(): void {
    this.endCurrentPlayerRound();
    this.currentPlayer.finished = true;
    this.currentPlayer.rank = this.currentRank++;

    if (this.currentRank === this.players.length) {
      this.finishGame();
    } else {
      this.nextPlayer();
    }
  }
}