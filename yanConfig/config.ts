// perceived value
const timeToHold = 350;

// calculated values
export const tapDanceTerm = 200;
export const tappingTerm = timeToHold - tapDanceTerm;
export const tappingTerm2 = timeToHold;
export const quickTap = tappingTerm;
export const comboTerm = 100;
if (tappingTerm < 0 || tappingTerm2 < 0 || tapDanceTerm < 0) {
  throw new Error('tappingTerm or tapDanceTerm is negative');
}
/*
for
tappingTerm = 150
tapDanceTerm = 250

First tap will not fire until 250 wait expired (the tap dance term)
First tap will fire if held shorter than < 400
First hold will fire if held longer than > 400
Tap and hold will fire in 400 if tapped previously
Double tap = ??
*/

const mehSeed = [
  'KP_N0', 'KP_N1', 'KP_N2', 'KP_N3', 'KP_N4', 'KP_N5', 'KP_N6', 'KP_N7', 'KP_N8', 'KP_N9',
  // below are first class citizens of numpad
  'KP_MINUS', 'KP_MULTIPLY', 'KP_EQUAL', 'KP_DOT',

  // do not work with Divy
  // 'KP_DIVIDE', 'KP_PLUS',

  // used by mac for brightness and volume
  // 'F1', 'F2', 'F3', 'F4', 'F5', 'F6', 'F7', 'F8', 'F9', 'F10', 'F11', 'F12',

  'F13', 'F14', 'F15', 'F16', 'F17', 'F18', 'F19', 'F20',

  // the ones below do not work with Divy maybe work with Alfred
  // 'F21', 'F22', 'F23', 'F24',

  // LANG does not work on alfred and divvy
  // 'LANG1', 'LANG2', 'LANG3', 'LANG4', 'LANG5', 'LANG6', 'LANG7', 'LANG8', 'LANG9',
  'N0', 'N1', 'N2', 'N3', 'N4', 'N5', 'N6', 'N7', 'N8', 'N9',

  // Below are first class symbols
  'GRAVE', 'MINUS', 'EQUAL', 'LEFT_BRACKET', 'RIGHT_BRACKET', 'BACKSLASH', 'SEMI', 'SINGLE_QUOTE', 'COMMA', 'DOT', 'SLASH',
  'A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J',
  'K', 'L', 'M', 'N', 'O', 'P', 'Q', 'R', 'S', 'T',
  'U', 'V', 'W', 'X', 'Y', 'Z',
];

export const mehArray: Array<{ key: string, modifier: string, value: string, used: boolean }> = [];
mehSeed.forEach((key) => mehArray.push({ key, modifier: 'hyper', value: `LA(LG(LC(LS(${key}))))`, used: false }));
mehSeed.forEach((key) => mehArray.push({ key, modifier: 'meh', value: `LA(LG(LC(${key})))`, used: false }));

export const odd = {
  screenshot: 'LG(LS(N4))',
  fontBigger: 'LG(EQUAL)',
  fontSmaller: 'LG(MINUS)',
  toggleLanguage: 'LC(EQUAL)',
  historyBack: 'LG(LEFT_BRACKET)',
  historyForward: 'LG(RIGHT_BRACKET)',
  tabsBack: 'LS(LC(TAB))',
  tabsForward: 'LC(TAB)',
  appWindowBack: 'LS(LG(GRAVE))',
  appWindowForward: 'LG(GRAVE)',
  alfred: 'LG(SPACE)',
  lockScreen: 'LG(LC(Q))',
  undo: 'LG(Z)',
  redo: 'LG(LS(Z))',
};

export const m = {
  macAppsWitchBackward: 'LA(LG(LC(LS(KP_N0))))',
  macAppsWitchForward: 'LA(LG(LC(LS(KP_N1))))',

  showApps: 'LA(LG(LC(LS(KP_N2))))',
  showDesktop: 'LA(LG(LC(LS(KP_N3))))',

  // apps
  appFinder: 'LA(LG(LC(LS(KP_N4))))',
  appTerminal: 'LA(LG(LC(LS(KP_N5))))',
  appVsCode: 'LA(LG(LC(LS(KP_N6))))',
  appBrowser: 'LA(LG(LC(LS(KP_N7))))',
  appSlack: 'LA(LG(LC(LS(KP_N8))))',
  appInsomnia: 'LA(LG(LC(LS(F16))))',
  appSublime: 'LA(LG(LC(LS(KP_N9))))',
  appNotes: 'LA(LG(LC(LS(KP_MINUS))))',
  appSignal: 'LA(LG(LC(LS(KP_EQUAL))))',
  appTelegram: 'LA(LG(LC(LS(F17))))',
  appWhatsup: 'LA(LG(LC(LS(KP_MULTIPLY))))',
  appRecordStart: 'LA(LG(LC(LS(G))))',
  appRecordStop: 'LA(LG(LC(G)))',

  // windows
  divvy: 'LA(LG(LC(LS(N1))))',
  winCenter_S: 'LA(LG(LC(LS(N0))))',
  winCenter_M: 'LA(LG(LC(LS(F13))))',
  winCenter_L: 'LA(LG(LC(LS(F14))))',
  winL_S: 'LA(LG(LC(LS(F15))))',
  winL_M: 'LA(LG(LC(LS(F18))))',
  winL_L: 'LA(LG(LC(LS(F19))))',
  winL_XL: 'LA(LG(LC(LS(N4))))',
  winR_XL: 'LA(LG(LC(LS(N5))))',
  winR_L: 'LA(LG(LC(LS(N2))))',
  winR_M: 'LA(LG(LC(LS(F20))))',
  winR_S: 'LA(LG(LC(LS(N3))))',
};

Object.values(m).forEach((value) => {
  const meh = mehArray.find((item) => item.value === value);
  if (meh == null) {
    throw new Error(`Value ${value} is not legal`);
  } else {
    if (meh.used) {
      throw new Error(`Key is used already, possible duplicate MEH hotkeys on different switches ${meh.value}`);
    }
    meh.used = true;
  }
});
