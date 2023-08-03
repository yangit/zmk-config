import { odd, m } from './config';
import { type LayerConfig } from './types';
import { addModifierToLayer, or, reverseLayerFrom, unwrapPlus } from './util';

const keymap: Record<string, LayerConfig> = {
  default: {
    keys: [
      ['Q,LG(SLASH),LA(LG(Q))', 'W,LG(W),LG(Q)', 'F,LG(F),LA(LG(F))', 'P,LG(P),LS(LG(P))', '&none,&tog config'],
      ['+A', '+R', '+S', '+T', 'G,LG(G),LG(LS(G))'],
      ['Z', 'X', 'C', '+D', 'B,LG(B),LG(LS(B))'],

      ['&mo windows', '&mo arrows', '&mo numbers'],
      ['&mo symbols', '&mo default_mirror', '&mo colemak_shift'],

      ['&none,&tog config', '+L', '+U', '+Y', 'N1,N2,N3'],
      ['+M', 'N,LG(N),LG(LS(N))', 'E,LG(E),LS(LG(E))', 'I,LG(I),LG(LA(I))', '+O'],
      ['+J', '+H', '+V', '+K', '&none'],

      ['SPACE', '&mo symbols', '&mo colemak_shift'],
      ['&trans', '&trans', '&mo config'],
      ['&kp K_MUTE'],
    ],
    sensor: '&yan_encoder',
    combos: [
      { keys: [8, 13], binding: `${odd.paste},${odd.pasteMulti}` },
      { keys: [7, 12], binding: odd.copy },
      { keys: [6, 11], binding: odd.cut },
      { keys: [38, 37], binding: odd.deleteWord },
      { keys: [4, 21], binding: '&tog qwerty' },
    ],
  },
  russian: (configLocal) => {
    const keysSeed = [
      ['Q', 'W', 'E', 'R', 'T,BACKSLASH'],
      ['A', 'S', 'D', 'F', 'G'],
      ['Z', 'X', 'C', 'V', 'B'],

      ['&windows_rus', '&arrowsr_rus', '&numbers_rus'],
      ['&symbols_rus', '&mo russian_mirror', '&mo russian_shift'],

      ['Y', 'U', 'I', 'O', 'P'],
      ['H', 'J', 'K', 'L', 'SEMICOLON'],
      ['N', 'M,RIGHT_BRACKET', 'COMMA', 'PERIOD', 'SINGLE_QUOTE,LEFT_BRACKET'],

      ['&trans', '&symbols_rus', '&mo russian_shift'],
      ['&trans', '&numbers_rus', '&trans'],
    ];

    // Copy hold and tapHold macros from default layer
    const keys = keysSeed.map((line, lineIndex) => line.map((key, keyIndex) => {
      const [tap, hold, tapHold, doubleTap] = key.split(',');
      let defaultKey = configLocal.keymap.default.keys[lineIndex][keyIndex];
      if (defaultKey.startsWith('+')) {
        defaultKey = unwrapPlus(defaultKey);
      }
      if (defaultKey.includes(',') && !key.startsWith('&') && !defaultKey.startsWith('&')) {
        const [dTap, dHold, dTapHold, dDoubleTap] = defaultKey.split(',');
        const result = [or(tap, dTap), or(hold, dHold), or(tapHold, dTapHold), or(doubleTap, dDoubleTap)].filter((value) => value).join(',');
        return result;
      }
      return key;
    }));
    return {
      keys,
      combos: configLocal.keymap.default.combos,
    };
  },
  russian_mirror: reverseLayerFrom('russian'),
  russian_shift: (configLocal) => {
    const { keys } = addModifierToLayer('russian', 'LS')(configLocal);
    keys[0][4] = 'LS(T),LS(BACKSLASH)';
    keys[7][1] = 'LS(M),LS(RIGHT_BRACKET)';
    keys[7][4] = 'LS(SINGLE_QUOTE),LS(LEFT_BRACKET)';

    return { keys };
  },
  default_mirror: reverseLayerFrom('default'),
  qwerty: {
    keys: [
      ['Q', 'W', 'E', 'R', 'T'],
      ['A', 'S', 'D', 'F', 'G'],
      ['Z', 'X', 'C', 'V', 'B'],

      ['&none', '&trans', '&trans'],
      ['&none', '&none', '&none'],

      ['Y', 'U', 'I', 'O', 'P'],
      ['H', 'J', 'K', 'L', 'SEMICOLON'],
      ['N', 'M', 'COMMA', 'PERIOD', 'SLASH'],

      ['&trans', '&trans', '&trans'],
      ['&trans', '&trans', '&trans'],
    ],
    combos: [
      { keys: [4, 21], binding: '&tog qwerty' },
    ],
  },
  colemak: {
    keys: [
      ['Q', 'W', 'F', 'P', '&none'],
      ['A', 'R', 'S', 'T', 'G'],
      ['Z', 'X', 'C', 'D', 'B'],

      ['&trans', '&trans', '&trans'],
      ['&trans', '&trans', '&trans'],

      ['&none', 'L', 'U', 'Y', '&none'],
      ['M', 'N', 'E', 'I', 'O'],
      ['J', 'H', 'V', 'K', '&none'],

      ['&trans', '&trans', '&trans'],
      ['&trans', '&trans', '&trans'],
    ],
  },
  colemak_shift: addModifierToLayer('colemak', 'LS'),
  colemak_shift_mirror: reverseLayerFrom('colemak_shift'),
  numbers: () => {
    // const reverseNumbersRow = (row: string[]): string[] => {
    //   const [one, two, three, four, five] = row;
    //   return [five, two, three, four, one];
    // };
    const keys = [
      ['KP_MULTIPLY,KP_DIVIDE,COLON', 'N7', 'N8', 'N9', '&trans'],
      ['KP_PLUS,KP_MINUS', 'N1', 'N2', 'N3', 'N0'],
      ['KP_DOT,COMMA', 'N4', 'N5', 'N6', 'KP_EQUAL'],

      ['&trans', '&trans', '&trans'],
      ['&trans', '&trans', '&trans'],

      //   ['=', '=', '=', '=', '='],
      //   ['=', '=', '=', '=', '='],
      //   ['=', '=', '=', '=', '='],
      ['F1', 'F2', 'F3', 'F4', 'F5'],
      ['F6', 'F7', 'F8', 'F9', 'F10'],
      ['F11', 'F12', 'F13', 'F14', 'F15'],

      ['&trans', '&trans', '&trans'],
      ['&trans', '&trans', '&trans'],
    ];

    // // mirror numbers layer
    // keys[5] = reverseNumbersRow(keys[0]);
    // keys[6] = reverseNumbersRow(keys[1]);
    // keys[7] = reverseNumbersRow(keys[2]);
    return { keys };
  },
  arrows: {
    keys: [
      ['&none', 'SPACE', 'DELETE', '&enable_rus', 'K_VOLUME_UP'],
      ['ESCAPE', 'TAB', 'BACKSPACE', 'RETURN,LS(RETURN),LG(RETURN)', 'K_VOLUME_DOWN'],
      ['LEFT_ALT', 'LEFT_CONTROL', 'LEFT_SHIFT', 'LEFT_COMMAND', `${odd.alfred},${odd.lockScreen}`],

      ['&trans', '&trans', '&trans'],
      ['&trans', '&trans', '&trans'],

      ['&none', 'HOME', 'UP_ARROW', 'PAGE_UP', '&none'],
      ['&none', 'LEFT_ARROW', 'DOWN_ARROW', 'RIGHT_ARROW', '&none'],
      ['&none', 'END', '&none', 'PAGE_DOWN', '&none'],

      ['&trans', '&trans', '&trans'],
      ['&trans', '&trans', '&trans'],
    ],
    combos: [
      { keys: [0, 3], binding: `&kp ${odd.toggleLanguage}` },
    ],
  },
  colemak_control: addModifierToLayer('colemak', 'LC'),
  arrows_mirror: (configLocal) => {
    const { keys } = reverseLayerFrom('arrows')(configLocal);

    keys[1][1] = 'LEFT_ARROW';
    keys[1][3] = 'RIGHT_ARROW';
    return { keys };
  },
  arrowsr: {
    keys: [
      ['&disable_rus', '&trans', '&trans', '&none', '&trans'],
      ['&trans', '&trans', '&trans', '&trans', '&trans'],
      ['&trans', '&trans', '&trans', '&trans', '&trans'],

      ['&trans', '&trans', '&trans'],
      ['&trans', '&trans', '&trans'],

      ['&trans', '&trans', '&trans', '&trans', '&trans'],
      ['&trans', '&trans', '&trans', '&trans', '&trans'],
      ['&trans', '&trans', '&trans', '&trans', '&trans'],

      ['&trans', '&trans', '&trans'],
      ['&trans', '&trans', '&trans'],
    ],
  },
  symbols: {
    keys: [
      ['SLASH', 'LEFT_PARENTHESIS', 'RIGHT_PARENTHESIS', 'MINUS', 'PLUS'],
      ['LEFT_BRACKET', 'RIGHT_BRACKET', 'LEFT_BRACE', 'RIGHT_BRACE', 'ASTERISK'],
      ['DOLLAR', 'LESS_THAN', 'EQUAL', 'GREATER_THAN', 'AT_SIGN'],

      ['&trans', '&trans', '&trans'],
      ['&trans', '&trans', '&trans'],

      ['EXCLAMATION', 'QUESTION', 'COLON', 'SEMICOLON', 'BACKSLASH,PIPE'],
      ['TILDE', 'PERIOD', 'COMMA', 'GRAVE', 'SINGLE_QUOTE'],
      ['PERCENT,CARET', 'HASH', 'UNDERSCORE', 'AMPERSAND', 'DOUBLE_QUOTES'],

      ['&trans', '&trans', '&trans'],
      ['&trans', '&trans', '&trans'],
    ],
  },
  symbols_mirror: reverseLayerFrom('symbols'),
  windows: {
    keys: [
      [odd.historyBack, odd.tabsBack, odd.appWindowBack, m.macAppsPrev, odd.fontBigger],
      [m.finder, m.vsCode, m.terminal, `${m.browser},${m.browser2}`, `${m.slack},${m.insomnia}`],
      [odd.undo, '&none', `${m.telegram},${m.whatsup},${m.signal}`, `${m.sublime},${m.notes}`, m.chatGpt],

      ['&trans', '&trans', '&trans'],
      ['&trans', '&trans', '&trans'],

      ['&trans', '&trans', '&trans', '&trans', '&trans'],
      ['&trans', '&trans', '&trans', '&trans', '&trans'],
      ['&trans', '&trans', '&trans', '&trans', '&trans'],

      ['&trans', '&trans', '&trans'],
      ['&trans', '&trans', '&trans'],
    ],
  },
  windows2: {
    keys: [
      [odd.historyForward, odd.tabsForward, odd.appWindowForward, m.macAppsNext, odd.fontSmaller],
      [`${m.showApps},${m.showDesktop}`, `${m.winL_M},${m.winL_L},${m.winL_XL},${m.winL_S}`, `${m.winR_M},${m.winR_L},${m.winR_XL},${m.winR_S}`, `${m.winCenter_S},${m.winCenter_M},${m.winCenter_L}`, '&none'],
      [odd.redo, '&shellrepeat', '&awesome', '&none', odd.screenshot],

      ['&trans', '&trans', '&trans'],
      ['&trans', '&trans', '&trans'],

      ['&trans', '&trans', '&trans', '&trans', '&trans'],
      ['&trans', '&trans', '&trans', '&trans', '&trans'],
      ['&trans', '&trans', '&trans', '&trans', '&trans'],

      ['&trans', '&trans', '&trans'],
      ['&trans', '&trans', '&trans'],
    ],
  },
  //   numbersf: {
  //     keys: [
  //       ['&none', 'F7', 'F8', 'F9', 'F11'],
  //       ['&none', 'F1', 'F2', 'F3', 'F10'],
  //       ['&none', 'F4', 'F5', 'F6', 'F12'],

  //       ['&none', '&none', '&none'],
  //       ['&none', '&none', '&none'],

  //       ['&none', '&none', '&none', '&none', '&none'],
  //       ['&none', '&none', '&none', '&none', '&none'],
  //       ['&none', '&none', '&none', '&none', '&none'],

  //       ['&none', '&none', '&none'],
  //       ['&none', '&kp CAPS', '&none'],
  //     ],
  //   },
  config: {
    keys: [
      ['&bootloader', '&sys_reset', '&bt BT_CLR', 'N1', '&tog config'],
      ['&bts0', '&bts1', '&bts2', '&bts3', '&bts4'],
      ['&bt BT_PRV', '&bt BT_NXT', '&out OUT_BLE', 'N1', '&out OUT_USB'],

      ['&none', '&none', '&none'],
      ['&none', '&none', '&none'],

      ['&tog config', 'N1', '&none', '&sys_reset', '&bootloader'],
      ['&none', '&none', '&none', '&none', '&none'],
      ['&none', 'N1', '&none', '&none', '&none'],

      ['&none', '&none', '&none'],
      ['&none', '&none', '&none'],

    ],
  },
};

export default keymap;
