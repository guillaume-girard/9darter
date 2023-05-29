export interface Player {
  id: number;
  name: string;
  order: number;
}

export interface PlayerInGame {
  name: string;
  finished: boolean;
  legs: number;
  rank: null | number;

  reInitPlayer(...args: any): void;
}