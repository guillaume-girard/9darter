const GAME_301 = { gameMode: '301', isDoubleOut: false, nbLegsToWin: 1 };
const GAME_301_DOUBLEOUT = { gameMode: '301', isDoubleOut: true, nbLegsToWin: 1 };
const GAME_501 = { gameMode: '501', isDoubleOut: false, nbLegsToWin: 1 };
const GAME_501_DOUBLEOUT = { gameMode: '501', isDoubleOut: true, nbLegsToWin: 1 };
const GAME_CRICKET = { gameMode: 'cricket', isReverse: false, isCrazy: false, nbLegsToWin: 1 };
const GAME_REVERSE_CRICKET = { gameMode: 'cricket', isReverse: true, isCrazy: false, nbLegsToWin: 1 };
const GAME_CRAZY_CRICKET = { gameMode: 'cricket', isReverse: false, isCrazy: true, nbLegsToWin: 1 };
const GAME_REVERSE_CRAZY_CRICKET = { gameMode: 'cricket', isReverse: true, isCrazy: true, nbLegsToWin: 1 };

export const LOAD_GAME_STATE = {
  START: "START",
  PROGRESS: "PROGRESS",
  FINISH: "FINISH"
}

export const environment = {
  production: false,
  loadDebug: true,
  loadNbPlayers: 4,
  loadGame: GAME_301,
  loadGameState: LOAD_GAME_STATE.START
};

