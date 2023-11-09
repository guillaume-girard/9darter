import { Injectable, OnInit } from "@angular/core";
import { PlayerInGame } from "../player.model";
import { PlayerService } from "src/app/services/players.service";
import { InputTargetService } from "src/app/services/input-target.service";
import { Subscription } from "rxjs";

@Injectable()
export abstract class GameComputer {
  abstract players: PlayerInGame[];
  abstract currentPlayer: PlayerInGame;
  currentIndex: number;
  currentRank: number;
  nbLegsToWin: number;
  isGameFinished: boolean;
  protected snapshots: any[];
  protected subs: Subscription;

  constructor(
    protected playerService: PlayerService,
    protected inputTargetService: InputTargetService
  ) {
    this.isGameFinished = false;
    this.currentIndex = 0;
    this.currentRank = 1;
    this.nbLegsToWin = 1;
    this.snapshots = [];

    this.subs = new Subscription();

    this.subs.add(this.inputTargetService.targetInputed.subscribe((value) => { this.createSnapshot(); this.addDart(value) }));
    this.subs.add(this.inputTargetService.nextPlayer.subscribe(() => { this.endPlayerRound(); this.nextPlayer(); }));
    this.subs.add(this.inputTargetService.cancel.subscribe(() => this.restoreSnapshot()));
  }

  protected abstract createSnapshot(): void;

  protected abstract restoreSnapshot(): void;

  protected abstract initGame(...args: any): void;

  protected abstract reInitGame(...args: any): void;

  protected abstract addDart(value: string): void;

  protected abstract finishGame(): void;

  public destroyComputer(): void {
    this.subs.unsubscribe();
  }

  protected startCurrentPlayerRound(): void {
    return;
  }

  protected endPlayerRound(player: PlayerInGame = this.currentPlayer): void {
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

  protected playerHasFinished(player: PlayerInGame = this.currentPlayer): void {
    this.endPlayerRound(player);
    
    player.finished = true;
    player.rank = this.currentRank++;
    
    // >= nécessaire pour le cas un seul joueur [Issue #23]
    if (this.currentRank >= this.players.length) {
      this.finishGame();
    } else {
      this.nextPlayer();
    }
  }

  protected setPlayersOrder(sortType: 'LOSER_FIRST' | 'WINNER_FIRST' | 'RANDOM' | 'SAME_ORDER') {
    switch(sortType) {
      case 'LOSER_FIRST':
        this.players.sort((a, b) => {
          a.rank = a.rank === null ? Infinity : a.rank;
          b.rank = b.rank === null ? Infinity : b.rank;
          return b.rank - a.rank
        })
        return;
      case 'WINNER_FIRST':
        this.players.sort((a, b) => {
          a.rank = a.rank === null ? Infinity : a.rank;
          b.rank = b.rank === null ? Infinity : b.rank;
          return a.rank - b.rank
        })
        return;
      case 'RANDOM':
        this.players.sort(() => Math.random() - Math.random());
        return;
      case 'SAME_ORDER':
        return;
    }
  }
}