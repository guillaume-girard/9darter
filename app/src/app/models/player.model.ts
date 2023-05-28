export interface Player {
  id: number;
  name: string;
}

export interface PlayerInGame {
  name: string;
  finished: boolean;
  legs: number;
  rank: null | number;
}