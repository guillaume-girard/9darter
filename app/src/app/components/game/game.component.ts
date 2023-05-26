import { Component, Input } from '@angular/core';
import { Player } from 'src/app/models/player.model';
import { InputTargetService } from 'src/app/services/input-target.service';
import { PlayerService } from 'src/app/services/players.service';

@Component({
  selector: 'app-game',
  templateUrl: './game.component.html',
  styleUrls: ['./game.component.scss']
})
export class GameComponent {
  players: any;
  currentRank: number;
  currentPlayer: any;
  currentIndex: number;
  startScore: number;
  currentPlayerScoreAtFirst: number;
  isDoubleOut = false;

  constructor(
    private playerService: PlayerService, 
    private inputTargetService: InputTargetService
  ){ 
    this.players = [];
    this.currentRank = 1;
    this.currentPlayer = null;
    this.currentIndex = 0;
    this.startScore = 301;

    for (let i = 0; i < this.playerService.players.length; i++) {
      this.players[i] = {
        name: this.playerService.players[i].name,
        suggestion: false,
        score: this.startScore,
        nbVolleys: 0,
        nbDarts: 0,
        totalpoints: 0,
        average: 0,
        finished: false,
        rank: null
      };
    }

    this.currentPlayerScoreAtFirst = this.startScore;
    this.currentPlayer = this.players[0];
  }

  ngOnInit(): void {
    console.log(this.playerService.getPlayers());
    this.inputTargetService.targetInputed.subscribe((value) => this.addDart(value));
  }

  addDart(value: string): void {
    if (value === "c") {
            // this.restoreSnapshot();
        } else if (value === "n") {
            this.nextPlayer();
        } else if (/^[t,d]?[0-9b]+/i.test(value)) {
            // this.createSnapshot();

            // this.nbDartsLeftToCurrentPlayer--;

            var firstChar = (value.slice(0, 1)).toLowerCase();
            var multiplyBy = firstChar === "d" ? 2 : (firstChar === "t" ? 3 : 1);
            value = multiplyBy > 1 ? value.slice(1) : value;
            let valueNumber = value === "b" ? 25 : Number.parseInt(value);

            // van gerwen
            if (valueNumber === 20 && multiplyBy === 3) {
                // van gerwen grosse gueule
                var imgvangerwen = document.createElement('img');
                imgvangerwen.src = "./img/van_gerwen_grosse_gueule.png";
                imgvangerwen.className = "grosvangerwen";
                document.body.appendChild(imgvangerwen);
            }

            valueNumber *= multiplyBy;

            this.currentPlayer.nbDarts++;
            this.currentPlayer.totalpoints += value;
            this.currentPlayer.score -= valueNumber;
            // this.currentPlayer.suggestion = this.findSuggestedFinish(this.currentPlayer.score, this.nbDartsLeftToCurrentPlayer);

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
                    this.nextPlayer();
                } else if (this.currentPlayer.score === 0) {
                    this.currentPlayer.finished = true;
                    this.currentPlayer.rank = this.currentRank++;
                    this.nextPlayer();
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

            
        } else {
            console.warn("invalid score: " + value);
        }

    console.log(this);
  }
  
  nextPlayer() {
    temporaryDisableNextPlayerButton();

    this.currentIndex++;

    if (this.currentIndex >= this.players.length) {
        this.currentIndex = 0;
    }
    if (this.players[this.currentIndex].finished) {
        this.nextPlayer();
    } else {
        // this.currentPlayer?.nbVolleys++;
        // this.currentPlayer?.suggestion = this.findSuggestedFinish(this.currentPlayer.score, 3);
        this.currentPlayer = this.players[this.currentIndex];
        if (this.currentPlayer) {
          if (this.currentRank === this.players.length) {
              this.currentPlayer.rank = this.currentRank;
              // this.currentPlayer.suggestion = false;
              this.currentPlayer = null;
          } else {
              this.currentPlayerScoreAtFirst = this.currentPlayer.score;
              // this.nbDartsLeftToCurrentPlayer = 3;
          }
        }
    }
    return;
  }
}

function temporaryDisableNextPlayerButton() {
  console.error('Function temporaryDisableNextPlayerButton() not implemented.');
}

