import { Player, PlayerInGame } from "./player.model";

export class X01Player implements PlayerInGame {
  name: string;
  suggestion: false | any[];
  score: number;
  average: number;
  nbVolleys: number;
  nbDartsThrown: number; // utilisé pour le cigare
  totalpoints: number;
  finished: boolean;
  legs: number;
  rank: null | number;
  
  constructor(player: Player, startScore: number) {
    this.name = player.name;
    this.score = startScore;
    this.average = 0;
    this.nbVolleys = 0;
    this.nbDartsThrown = 0;
    this.suggestion = false;
    this.totalpoints = 0;
    this.finished = false;
    this.legs = 0;
    this.rank = null;
  }

  computeAverage(): void {
    let avg = 0;

    if (this.nbVolleys > 0) {
      avg = Math.round((this.totalpoints / this.nbVolleys) * 100) / 100;
    }

    this.average = avg;
  }

  get rankComputed(): string {
    let suffix: string;

    switch (this.rank) {
      case 1:
      case 21:
        suffix = "st";
        break;
      case 2:
      case 22:
        suffix = "nd";
        break;
      case 3:
      case 23:
        suffix = "rd";
        break;
      default:
        suffix = "th";
    }

    return this.rank + suffix;
  }

  get suggestionComputed(): string {
    let str = "";
    if (this.suggestion) {
      for (var i = 0; i < this.suggestion.length; i++) {
        str += this.suggestion[i].notation;
        if (!(i === this.suggestion.length - 1)) {
          str += " ";
        }
      }
    }
    return str;
  }

  reInitPlayer(startScore: number, keepAverage: boolean = false) {
    this.score = startScore;
    if (!keepAverage) {
      this.average = 0;
      this.nbVolleys = 0;
      this.totalpoints = 0;
    }
    this.nbDartsThrown = 0;
    this.suggestion = false;
    this.finished = false;
    this.rank = null;
  }
}