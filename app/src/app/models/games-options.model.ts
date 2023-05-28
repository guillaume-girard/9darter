export interface GameX01Options {
  gameType: '301' | '501';
  isDoubleOut: boolean;
  nbLegsToWin: number;
}

export interface GameCricketOptions {
  isReverse: boolean;
  isCrazy: boolean;
  isWild: boolean;
}