import { PlayerService } from "src/app/services/players.service";
import { X01Player } from "../x01player.model";
import { GameComputer } from "./game-computer.model";
import { InputTargetService } from "src/app/services/input-target.service";
import { grosvangerwen, wobblingwrapper } from "src/app/app.component";

export class GameX01Computer extends GameComputer {
  gameType!: string;
  players!: X01Player[];
  currentPlayer!: X01Player;
  currentPlayerScoreAtFirst!: number;
  isDoubleOut!: boolean;
  nbDartsLeftToCurrentPlayer!: number;

  constructor(
    override playerService: PlayerService,
    override inputTargetService: InputTargetService
  ) {
    super(playerService, inputTargetService);
  }

  initGame(gameType: string, isDoubleOut: boolean, nbLegsToWin: number) {
    this.nbLegsToWin = nbLegsToWin;
    this.isDoubleOut = isDoubleOut;
    this.gameType = gameType;
    let startScore = gameType === '501' ? 501 : 301;
    this.players = this.playerService.getPlayersForX01Game(startScore);  // tableau des instances de joueurs dans le jeu
    this.currentPlayer = this.players[0]; // Joueur en train de jouer
    this.currentPlayerScoreAtFirst = startScore;
    this.nbDartsLeftToCurrentPlayer = 3;
  }

  reInitGame(playerOrder: 'LOSER_FIRST' | 'WINNER_FIRST' | 'RANDOM' | 'SAME_ORDER', keepAverage: boolean = false): void {
    this.setPlayersOrder(playerOrder);
    let startScore = this.gameType === '501' ? 501 : 301;
    this.players.forEach((player) => player.reInitPlayer(startScore, keepAverage));
    this.currentPlayer = this.players[0];
    this.currentPlayerScoreAtFirst = startScore;
    this.nbDartsLeftToCurrentPlayer = 3;
    this.isGameFinished = false;
    this.currentIndex = 0;
    this.currentRank = 1;
  }

  addDart(value: string): void {
    this.nbDartsLeftToCurrentPlayer--;

    var firstChar = (value.slice(0, 1)).toLowerCase();
    var multiplyBy = firstChar === "d" ? 2 : (firstChar === "t" ? 3 : 1);
    value = multiplyBy > 1 ? value.slice(1) : value;
    let valueNumber = value === "b" ? 25 : Number.parseInt(value);

    // van gerwen
    if (valueNumber === 20 && multiplyBy === 3) {
      // van gerwen grosse gueule
      grosvangerwen.addEventListener('animationend', () => {
        grosvangerwen.classList.remove("animate");
      })
      grosvangerwen.classList.add("animate");
    }

    valueNumber *= multiplyBy;

    this.currentPlayer.nbDartsThrown++;
    this.currentPlayer.totalpoints += valueNumber;
    this.currentPlayer.score -= valueNumber;
    this.currentPlayer.suggestion = this.findSuggestedFinish(this.currentPlayer.score, this.nbDartsLeftToCurrentPlayer);

    // if (this.nbLegsGame === 1) {
    if (true) {
      /* Ancien code : dans le cas d'un jeu � 3+ joueurs en une seul leg, on continue
       * la partie tant que des joueurs n'ont pas fini
       */
      if (
        (this.currentPlayer.score === 0 && this.isDoubleOut && multiplyBy !== 2) ||
        this.currentPlayer.score < 0 ||
        (this.currentPlayer.score === 1 && this.isDoubleOut)) {

        // BUST!
        wobblingwrapper.innerText = "BUST !";
        wobblingwrapper.addEventListener("animationend", () => {
          wobblingwrapper.classList.remove("animate");
        })
        wobblingwrapper.classList.add("animate");

        this.currentPlayer.score = this.currentPlayerScoreAtFirst;
        this.endPlayerRound();
        this.nextPlayer();
      } else if (this.currentPlayer.score === 0) {
        this.playerHasFinished(); // le next player est dedans
      }
    } else {



      /* Nouveau code : dans le cas d'un jeu � plusieurs legs la leg se termine
       * d�s qu'un joueur atteint 301 et c'est au joueur suivant de commencer la
       * nouvelle leg. On continue de jouer jusqu'� ce que tous les joueurs (sauf un)
       * aient atteint le nombre requis de legs
       */
      /*
       if (
              (this.currentPlayer.score === 0 && this.isDoubleOut && multiplyBy !== 2) || 
              this.currentPlayer.score < 0 ||
              (this.currentPlayer.score === 1 && this.isDoubleOut)) {
          // BUST!
          var spanBust = document.createElement('span');
          spanBust.innerText = "BUST!";
          spanBust.className = "spanbust";
          document.body.appendChild(spanBust);

          this.currentPlayer.score = this.currentPlayerScoreAtFirst;
          this.nextPlayer();
      } else if (this.currentPlayer.score === 0) {
          // Le joueur a fini un x01 : leg++ et endGame?
          temporaryDisableNextPlayerButton();
          // LEG!
          var spanLeg = document.createElement('span');
          spanLeg.innerText = "LEG!";
          spanLeg.className = "spanbust";
          document.body.appendChild(spanLeg);

          this.currentPlayer.nbLegs++;
          this.currentPlayer.nbVolleys++;
          
          if (this.currentPlayer.nbLegs > this.nbLegsGame / 2) {
              this.currentPlayer.finished = true;
              this.currentPlayer.rank = this.currentRank++;
          }
          
          // leg +1 et reload du game
          this.indexFirstThrower++;
          if (this.indexFirstThrower >= this.nbPlayers) {
              this.indexFirstThrower = 0;
          }
          while (this.players[this.indexFirstThrower].finished) {
              this.indexFirstThrower++;
              if (this.indexFirstThrower >= this.nbPlayers) {
                  this.indexFirstThrower = 0;
              }
          }

          this.currentPlayer = this.players[this.indexFirstThrower];
          
          if (this.currentRank === this.nbPlayers) {
              this.currentPlayer.rank = this.currentRank;
              this.currentPlayer.suggestion = false;
              this.currentPlayer = null;
          } else {
              this.currentIndex = this.indexFirstThrower;
              this.nbDartsLeftToCurrentPlayer = 3;
              this.players.forEach(function(el) {
                  el.score = this.startScore;
                  el.suggestion = false;
                  el.nbDarts = 0;
              }.bind(this));
          } 
      } */
    }
  }

  protected override startCurrentPlayerRound(): void {
    this.currentPlayerScoreAtFirst = this.currentPlayer.score;
    this.nbDartsLeftToCurrentPlayer = 3;
  }

  override endPlayerRound() {
    this.currentPlayer.nbVolleys++;
    this.currentPlayer.computeAverage();
    this.currentPlayer.suggestion = this.findSuggestedFinish(this.currentPlayer.score, 3);
  }

  override finishGame(): void {
    this.isGameFinished = true;
    this.currentPlayer.suggestion = false;
    this.players.forEach((player) => {
      if (player.rank === null) {
        player.rank = this.currentRank++;
        player.suggestion = false;
        player.finished = true;
      }
    })
  }

  // @TODO déplacer la fonction dans X01Player
  findSuggestedFinish(score: number, nbDartsLeft: number) {
    if (score > 170 || nbDartsLeft <= 0) {
      return false;
    }

    var possibleDarts = [];
    for (var j = 3; j > 0; j--) {
      for (var i = 20; i > 0; i--) {
        possibleDarts.push({
          score: i * j,
          isDouble: j === 2,
          notation: (j === 3 ? "T" : (j === 2 ? "D" : "")) + i
        });
      }
    }
    possibleDarts.push({
      score: 25,
      isDouble: false,
      notation: "Bull"
    }, {
      score: 50,
      isDouble: true,
      notation: "Double Bull"
    });

    var found = possibleDarts.find((el: any) => {
      return el.score === score &&
        (!this.isDoubleOut || el.isDouble);
    });
    if (found) {
      return [found];
    } else if (nbDartsLeft > 1) {
      for (var i = 0; i < possibleDarts.length; i++) {
        var currentPossibleDart = possibleDarts[i];

        var intermediateTabResult = [currentPossibleDart];
        var intermediateScore = score - currentPossibleDart.score;

        var foundSecond = possibleDarts.find((el: any) => {
          return el.score === intermediateScore &&
            (!this.isDoubleOut || el.isDouble);
        });
        if (foundSecond) {
          intermediateTabResult.push(foundSecond);
          return intermediateTabResult;
        } else if (nbDartsLeft > 2) {
          for (var j = 0; j < possibleDarts.length; j++) {
            var currentPossibleDartDeux = possibleDarts[j];

            var intermediateTabResultDeux = intermediateTabResult.concat([currentPossibleDartDeux]);
            var intermediateScoreDeux = intermediateScore - currentPossibleDartDeux.score;

            var foundThird = possibleDarts.find((el: any) => {
              return el.score === intermediateScoreDeux &&
                (!this.isDoubleOut || el.isDouble);
            });
            if (foundThird) {
              intermediateTabResultDeux.push(foundThird);
              return intermediateTabResultDeux;
            }
          }
        }
      }
    }
    return false;
  }

  createSnapshot(): void {
    const snapshot = {
      "players": structuredClone(this.players),
      "currentRank": this.currentRank,
      "currentIndex": this.currentIndex,
      "nbDartsLeftToCurrentPlayer": this.nbDartsLeftToCurrentPlayer,
      "currentPlayerScoreAtFirst": this.currentPlayerScoreAtFirst,
      "isGameFinished": this.isGameFinished
    };

    this.snapshots.push(snapshot);
  }
  
  restoreSnapshot(): void {
    if (this.snapshots.length > 0) {
      let snapshot = this.snapshots.pop();

      this.players = snapshot.players;
      // Set du prototype pour que les méthodes de X01Player soient utilisables
      // @TODO y'a sans doute mieux à faire... 
      let proto = Object.getPrototypeOf(new X01Player({ id:0, name: "" }, 0));
      this.players.forEach((el) => Object.setPrototypeOf(el, proto));

      this.currentRank = snapshot.currentRank;
      this.currentIndex = snapshot.currentIndex;
      this.currentPlayer = this.players[this.currentIndex];
      this.nbDartsLeftToCurrentPlayer = snapshot.nbDartsLeftToCurrentPlayer;
      this.currentPlayerScoreAtFirst = snapshot.currentPlayerScoreAtFirst;

      this.isGameFinished = snapshot.isGameFinished;
    }
  }
}