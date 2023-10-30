import { Player, PlayerInGame } from "./player.model";

export class CricketPlayer implements PlayerInGame {
  name: string;
  score: number;
  finished: boolean;
  legs: number;
  rank: null | number;
  targetsState: { target: string, state: number }[];

  constructor(player: Player, targets: string[]) {
    this.name = player.name;
    this.score = 0;
    this.targetsState = [];
    this.setInitialTargetsState(targets);
    this.finished = false;
    this.legs = 0;
    this.rank = null;
  }

  getTargetState(target: string): number {
    let laTarget = this.targetsState.filter((el) => el.target === target)[0];
    return laTarget.state;
  }

  reInitPlayer(targets: string[]): void {
    this.score = 0;
    this.targetsState = [];
    this.setInitialTargetsState(targets);
    this.finished = false;
    this.legs = 0;
    this.rank = null;
  }

  setInitialTargetsState(cricketTargets: string[]): void {
    for (var i = 0; i < cricketTargets.length; i++) {
      this.targetsState.push({
        target: cricketTargets[i],
        state: 0
      });
    }
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
}