export interface Player {
  id: number;
  name: string;
}

export interface PlayerInGame {
  name: string;
  finished: boolean;
  rank: null | number;
}