export interface Player {
  id: number;
  name: string;
}

export interface PlayerInGame {
  name: string;
  nbDartsThrown: number;
  legs: number;
  finished: boolean;
  rank: null | number;

  reInitPlayer(...args: any): void;
}