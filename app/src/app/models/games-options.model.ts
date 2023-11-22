export interface GameX01Options {
  gameType: '301' | '501';
  isDoubleIn: boolean;
  isDoubleOut: boolean;
  isSplitBullseye: boolean;
  nbLegsToWin: number;
}

export interface GameCricketOptions {
  isReverse: boolean;
  isCrazy: boolean;
  isWild: boolean;
  nbLegsToWin: number;
}