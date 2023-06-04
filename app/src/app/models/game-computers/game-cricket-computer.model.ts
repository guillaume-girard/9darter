import { InputTargetService } from "src/app/services/input-target.service";
import { PlayerService } from "src/app/services/players.service";
import { GameComputer } from "./game-computer.model";
import { CricketPlayer } from "../cricket-player.model";

export class GameCricketComputer extends GameComputer {
  gameType!: string;
  players!: CricketPlayer[];
  currentPlayer!: CricketPlayer;
  nbDartsLeftToCurrentPlayer!: number;
  isReverse: boolean = false;
  targets: string[];
  targetsClosed: string[];
  scoreHtml: string;

  constructor(
    override playerService: PlayerService,
    override inputTargetService: InputTargetService
  ) {
    super(playerService, inputTargetService);
    this.targets = [];
    this.targetsClosed = [];
    this.scoreHtml = "";
  }

  private get nbPlayers() {
    return this.players.length;
  }

  initGame(reverse: boolean, crazy: boolean, nbLegsToWin: number) {
    this.nbLegsToWin = nbLegsToWin;
    this.isReverse = reverse;
    this.targets = this.getCricketTargets(crazy);
    this.players = this.playerService.getPlayersForCricketGame(this.targets);
    this.currentIndex = 0;
    this.currentPlayer = this.players[0];
    this.nbDartsLeftToCurrentPlayer = 3;
  }

  reInitGame(playerOrder: 'LOSER_FIRST' | 'WINNER_FIRST' | 'RANDOM' | 'SAME_ORDER'): void {
    this.setPlayersOrder(playerOrder);
    this.players.forEach((player) => player.reInitPlayer(this.targets));
    this.targetsClosed = [];
    this.currentIndex = 0;
    this.currentPlayer = this.players[0];
    this.nbDartsLeftToCurrentPlayer = 3;
    this.isGameFinished = false;
  }

  protected override createSnapshot(): void {
    console.warn('method createSnapshot does not exist in GameCricketComputer');
  }
  protected override restoreSnapshot(): void {
    console.warn('method restoreSnapshot does not exist in GameCricketComputer');
  }

  protected override addDart(value: string): void {
      this.nbDartsLeftToCurrentPlayer--;

      let firstChar = (value.slice(0, 1)).toLowerCase();
      let multiplyBy = firstChar === "d" ? 2 : (firstChar === "t" ? 3 : 1);
      value = multiplyBy > 1 ? value.slice(1) : value;
      let targetValue: string = value === "b" ? "Bull's eye" : value;

      // van gerwen
      // if (value === 20 && multiplyBy === 3) {
      //   // van gerwen grosse gueule
      //   var imgvangerwen = document.createElement('img');
      //   imgvangerwen.src = "./img/van_gerwen_grosse_gueule.png";
      //   imgvangerwen.className = "grosvangerwen";
      //   document.body.appendChild(imgvangerwen);
      // }

      if (this.targets.indexOf(targetValue) >= 0) {
        this.score(multiplyBy, targetValue);
      }

      if (this.currentPlayer.finished) {
        this.currentPlayer.rank = this.currentRank++;
      }
      // verify if any player has finished
      var recommence = false;
      do {
        recommence = false;
        for (var i = 0; i < this.nbPlayers; i++) {
          let pl = this.players[i];
          let allOpened = pl.targetsState.every((el) => el.state === 3);

          if (allOpened && !pl.finished) {
            pl.finished = this.players.every((el) => {
              let returnValue = null;
              if (!this.isReverse) {
                returnValue = (el === pl || el.finished || el.score <= pl.score);
              } else {
                returnValue = (el === pl || el.finished || el.score >= pl.score);
              }
              return returnValue;
            });
            if (pl.finished) {
              pl.rank = this.currentRank++;
              recommence = true;
            }
          }
        }
      } while (recommence)

      if (this.currentPlayer.finished) {
        if (!this.players.every((el) => el.finished)) {
          this.nextPlayer();
        } else {
          this.finishGame();
        }
      }
  }

  private score(multiple: number, target: string) {
    let targetValue: number = (target === "Bull's eye" ? 25 : Number.parseInt(target))
    let i = 0;
    do {
      let currentTargetStateObj = this.currentPlayer.targetsState.find((el) => el.target === target);
      if (currentTargetStateObj) {
        switch (currentTargetStateObj.state) {
          case 0:
          case 1:
          case 2:
            currentTargetStateObj.state++;
            break;
          case 3:
          default:
            if (this.targetsClosed.indexOf(target) < 0) {
              let needToClose = true;
              for (var playerIndex = 0; playerIndex < this.nbPlayers; playerIndex++) {
                if (this.players[playerIndex] !== this.currentPlayer) {
                  var statteteet = this.players[playerIndex].targetsState.find((el) => el.target === target);
                  if (statteteet && statteteet.state !== 3) {
                    needToClose = false;
                  }
                }
              }
              if (needToClose) {
                this.targetsClosed.push(target);
              } else {
                if (!this.isReverse) {
                  this.currentPlayer.score += targetValue;
                } else {
                  for (let k = 0; k < this.nbPlayers; k++) {
                    let otherPlayer = this.players[k];
                    if (otherPlayer !== this.currentPlayer) {
                      let chips = otherPlayer.targetsState.find((el) => el.target === target);
                      if (chips && chips.state !== 3) {
                        otherPlayer.score += targetValue;
                      }
                    }
                  }
                }
              }
            }
        }
      }
      i++;
    } while (i < multiple);

    // Est-ce que le joueur a fini
    let allOpened = this.currentPlayer.targetsState.every((el) => el.state === 3);
    if (allOpened) {
      let playerScore = this.currentPlayer.score;
      this.currentPlayer.finished = this.players.every((el) => {
        let returnValue = null;
        if (!this.isReverse) {
          returnValue = (el === this.currentPlayer || el.finished || el.score <= playerScore);
        } else {
          returnValue = (el === this.currentPlayer || el.finished || el.score >= playerScore);
        }
        return returnValue;
      });
    }
  }

  override finishGame(): void {
    this.isGameFinished = true;
    this.players.forEach((player) => {
      if (player.rank === null) {
        player.rank = this.currentRank++;
        player.finished = true;
      }
    })
  }

  private getCricketTargets(crazy: boolean = false): string[] {
    let arrNumber: number[] = [];
    if (crazy) {
      do {
        var nb = Math.floor(Math.random() * 20) + 1;
        if (arrNumber.indexOf(nb) < 0) {
          arrNumber.push(nb);
        }
      } while (arrNumber.length < 6)

      arrNumber.sort(function (a, b) {
        return b - a;
      });
    } else {
      arrNumber = [20, 19, 18, 17, 16, 15];
    }
    let arr: string[] = arrNumber.map((value) => value.toString());
    arr.push("Bull's eye");
    return arr;
  }
}