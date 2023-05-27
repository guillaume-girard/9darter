import { Component, Input } from '@angular/core';
import { GameComputerComponent } from 'src/app/models/game-computer.model';
import { X01Player } from 'src/app/models/x01player.model';
import { InputTargetService } from 'src/app/services/input-target.service';
import { PlayerService } from 'src/app/services/players.service';

@Component({
  selector: 'app-gameX01',
  templateUrl: './gameX01.component.html',
  styleUrls: ['./gameX01.component.scss']
})
export class GameX01Component extends GameComputerComponent {
  players: X01Player[];
  currentPlayer: X01Player;
  currentPlayerScoreAtFirst: number;
  isDoubleOut = false;
  nbDartsLeftToCurrentPlayer: number;

  constructor(
    override playerService: PlayerService,
    override inputTargetService: InputTargetService
  ) {
    super(playerService, inputTargetService);
    this.players = this.playerService.getPlayersForX01Game(301);  // tableau des instance de joueurs dans le jeu
    this.currentPlayer = this.players[0]; // Joueur en train de jouer
    this.currentPlayerScoreAtFirst = 301;
    this.nbDartsLeftToCurrentPlayer = 3;
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
      var imgvangerwen = document.createElement('img');
      imgvangerwen.src = "./assets/van_gerwen_grosse_gueule.png";
      imgvangerwen.className = "grosvangerwen";
      document.body.appendChild(imgvangerwen);
    }

    valueNumber *= multiplyBy;

    this.currentPlayer.nbDarts++;
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
        var spanBust = document.createElement('span');
        spanBust.innerText = "BUST!";
        spanBust.className = "spanbust";
        document.body.appendChild(spanBust);

        this.currentPlayer.score = this.currentPlayerScoreAtFirst;
        this.endCurrentPlayerRound();
        this.nextPlayer();
      } else if (this.currentPlayer.score === 0) {
        this.currentPlayerHasFinished(); // le next player est dedans
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

  override endCurrentPlayerRound() {
    this.currentPlayer.nbVolleys++;
    this.currentPlayer.computeAverage();
    this.currentPlayer.suggestion = this.findSuggestedFinish(this.currentPlayer.score, 3);
  }

  override finishGame(): void {
    this.currentPlayer.suggestion = false;
  }

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
    console.warn('method createSnapshot does not exist in GameComputerComponent')
  }
  
  restoreSnapshot(): void {
    console.warn('method restoreSnapshot does not exist in GameComputerComponent')
  }
}


