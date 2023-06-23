import { type ConfigParsed, type Combo, type Config } from './types';
import { addModifierToLayer, configToKeymap, configToOutput, configToParsed, keyMapper, layerToLayer, or, reverseLayerFrom, unwrapPlus } from './util';
import Path from 'path';
import _ from 'lodash';
import { mkdirp } from 'mkdirp';
import { rimrafSync } from 'rimraf';
// Description: Yan's config file for ZMK
import fs from 'fs';
import { comboTerm, conditionalLayers, m, mehArray, odd } from './config';
import { execSync } from 'child_process';

const config: Config = {
  header: `/*
 * Copyright (c) 2020 The ZMK Contributors
 *
 * SPDX-License-Identifier: MIT
 */

#include <behaviors.dtsi>
#include <dt-bindings/zmk/keys.h>
#include <dt-bindings/zmk/bt.h>
#include <dt-bindings/zmk/outputs.h>
`,
  postHeader: `

/* sticky keys timeout */
&sk {
    release-after-ms = <3000>;
};

/ {
`,
  combos: [],
  conditionalLayers: [],
  behaviors: [
        `
yan_encoder: yan_encoder {
    compatible = "zmk,behavior-sensor-rotate";
    label = "YAN_ENCODER";
    #sensor-binding-cells = <0>;
    bindings = <&kp K_VOLUME_DOWN>, <&kp K_VOLUME_UP>;
};
`],
  macros: [
    `
ZMK_MACRO(globeCaps,
    bindings
    = <&macro_press &mo ${layerToLayer('numbersf')} &kp CAPS>
    , <&macro_pause_for_release>
    , <&macro_release &mo ${layerToLayer('numbersf')} &kp CAPS>
    ;
)`,
`
ZMK_MACRO(awesome,
    wait-ms = <50>;
    bindings = <&macro_tap &kp M &kp O &kp O &kp N &kp L &kp A &kp N &kp D &kp E &kp R &kp LS(I) &kp S &kp A &kp W &kp E &kp S &kp RETURN>;
)
`, `
ZMK_MACRO(shellrepeat,
    wait-ms = <400>;
    bindings = <&macro_tap &kp ${m.terminal} &kp UP_ARROW &kp RETURN>;
)
`, `
ZMK_MACRO(enable_rus,
    wait-ms = <0>;
    bindings
        = <&macro_tap &to ${layerToLayer('russian')} &kp ${odd.toggleLanguage}>;
)
ZMK_MACRO(disable_rus,
    wait-ms = <0>;
    bindings
        = <&macro_tap &to ${layerToLayer('default')} &kp ${odd.toggleLanguage}>;
)
`,
  ],
  keymap: {
    default: {
      keys: [
        ['Q,LG(SLASH),LA(LG(Q))', 'W,LG(W),LG(Q)', 'F,LG(F),LA(LG(F))', 'P,LG(P),LS(LG(P))', '&mo config'],
        ['+A', '+R', '+S', '+T', 'G,LG(G),LG(LS(G))'],
        ['Z', 'X', 'C', '+D', 'B,LG(B),LG(LS(B))'],

        ['&mo windows', '&mo arrows', '&mo numbers'],
        ['&mo symbols', '&mo default_mirror', '&mo colemak_shift'],

        ['&mo config', '+L', '+U', '+Y', 'N1,N2,N3'],
        ['+M', 'N,LG(N),LG(LS(N))', 'E,LG(E),LS(LG(E))', 'I,LG(I),LG(LA(I))', '+O'],
        ['+J', '+H', '+V', '+K', '&none'],

        ['SPACE', '&mo symbols', '&mo colemak_shift'],
        ['&trans', '&trans', '&trans'],
        ['&kp K_MUTE'],
      ],
      sensor: '&yan_encoder',
      combos: [
        { keys: [8, 13], binding: `${odd.paste},${odd.pasteMulti}` },
        { keys: [7, 12], binding: odd.copy },
        { keys: [6, 11], binding: odd.cut },
        { keys: [38, 37], binding: odd.deleteWord },
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

        ['&trans', '&trans', '&trans'],
        ['&trans', '&trans', '&trans'],

        ['Y', 'U', 'I', 'O', 'P'],
        ['H', 'J', 'K', 'L', 'SEMICOLON'],
        ['N', 'M', 'COMMA', 'PERIOD', 'SLASH'],

        ['&trans', '&trans', '&trans'],
        ['&trans', '&trans', '&trans'],
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
    colemak_shift: (configLocal) => {
      const { keys } = addModifierToLayer('colemak', 'LS')(configLocal);
      keys[3][2] = '&mo numbersf';
      return { keys };
    },
    colemak_shift_mirror: reverseLayerFrom('colemak_shift'),
    numbers: () => {
      const reverseNumbersRow = (row: string[]): string[] => {
        const [one, two, three, four, five] = row;
        return [five, two, three, four, one];
      };
      const keys = [
        ['KP_MULTIPLY,KP_DIVIDE,COLON', 'N7', 'N8', 'N9', '&trans'],
        ['KP_PLUS,KP_MINUS', 'N1', 'N2', 'N3', 'N0'],
        ['KP_DOT,COMMA', 'N4', 'N5', 'N6', 'KP_EQUAL'],

        ['&trans', '&trans', '&trans'],
        ['&trans', '&trans', '&mo numbersf'],

        ['=', '=', '=', '=', '='],
        ['=', '=', '=', '=', '='],
        ['=', '=', '=', '=', '='],
        // ['F1', 'F2', 'F3', 'F4', 'F5'],
        // ['F6', 'F7', 'F8', 'F9', 'F10'],
        // ['F11', 'F12', 'F13', 'F14', 'F15'],

        ['&trans', '&trans', '&trans'],
        ['&trans', '&trans', '&trans'],
      ];

      // mirror numbers layer
      keys[5] = reverseNumbersRow(keys[0]);
      keys[6] = reverseNumbersRow(keys[1]);
      keys[7] = reverseNumbersRow(keys[2]);
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
        ['&trans', '&sk LEFT_COMMAND', '&sk LEFT_SHIFT', '&sk LEFT_CONTROL', '&sk LEFT_ALT'],

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
        [m.finder, m.terminal, m.vsCode, m.browser, `${m.slack},${m.insomnia}`],
        [odd.undo, '&none', `${m.telegram},${m.whatsup},${m.signal}`, `${m.sublime},${m.notes}`, m.chatGpt],

        ['&trans', '&trans', '&trans'],
        ['&trans', '&trans', '&trans'],

        ['&trans', '&trans', '&trans', '&trans', '&trans'],
        ['&trans', '&trans', '&trans', '&trans', '&trans'],
        ['&trans', '&trans', '&trans', '&trans', '&trans'],

        ['&trans', '&trans', '&trans'],
        ['&trans', '&trans', '&trans'],
      ],
      // combos: [
      //     { keys: [0, 3], binding: `&kp ${m.telegram}` },
      //     { keys: [0, 3], binding: `&kp ${m.whatsup}` },
      //     { keys: [0, 3], binding: `&kp ${}` },
      // ]
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
    numbersf: {
      keys: [
        ['&none', 'F7', 'F8', 'F9', 'F11'],
        ['&none', 'F1', 'F2', 'F3', 'F10'],
        ['&none', 'F4', 'F5', 'F6', 'F12'],

        ['&none', '&none', '&none'],
        ['&none', '&none', '&none'],

        ['&none', '&none', '&none', '&none', '&none'],
        ['&none', '&none', '&none', '&none', '&none'],
        ['&none', '&none', '&none', '&none', '&none'],

        ['&none', '&none', '&none'],
        ['&none', '&kp CAPS', '&none'],
      ],
    },
    config: {
      keys: [
        ['&bootloader', '&sys_reset', '&bt BT_CLR', '&none', '&none'],
        ['&bts0', '&bts1', '&bts2', '&bts3', '&bts4'],
        ['&bt BT_PRV', '&bt BT_NXT', '&out OUT_BLE', '&none', '&out OUT_USB'],

        ['&none', '&none', '&none'],
        ['&none', '&none', '&none'],

        ['&none', '&none', '&none', '&sys_reset', '&bootloader'],
        ['&none', '&none', '&none', '&none', '&none'],
        ['&none', '&none', '&none', '&none', '&none'],

        ['&none', '&none', '&none'],
        ['&none', '&none', '&none'],

      ],
    },

  },
};

// macros to switch blootooth devices in one click
[0, 1, 2, 3, 4].forEach(i => {
  config.macros.push(`  
  ZMK_MACRO(bts${i},
    wait-ms = <0>;
    bindings
        = <&macro_tap &out OUT_BLE &bt BT_SEL ${i}>;
)
`,
  );
});

const configParsed = configToParsed(config);

// Add macros to be used in russian layer
const rusLayers = ['symbols', 'windows', 'windows2', 'numbers', 'symbols_mirror', 'arrows_mirror', 'colemak_shift_mirror'];
rusLayers.forEach((layer) => {
  if (!configParsed.keymap[layer]) {
    throw new Error(`Layer for russification does not exists: ${layer}`);
  }
  configParsed.macros.push(`
ZMK_MACRO(${layer}_rus,
    wait-ms = <0>;
    bindings
        = <&macro_press &mo ${layerToLayer(layer)}>
        , <&macro_tap &kp ${odd.toggleLanguage}>
        , <&macro_pause_for_release>
        , <&macro_tap &kp ${odd.toggleLanguage}>
        , <&macro_release &mo ${layerToLayer(layer)}>;
)
 `);
});

// Since arrows layer contain toggles for language, we need to make it special
// There are two variants, russian one does not allow to enable russian again, and english does not all to enable english again
configParsed.macros.push(`
ZMK_MACRO(arrowsr_rus,
    wait-ms = <0>;
    bindings
        = <&macro_tap &kp ${odd.toggleLanguage}>        
        , <&macro_press &mo ${layerToLayer('arrows')} &mo ${layerToLayer('arrowsr')}>
        , <&macro_pause_for_release>        
        , <&macro_release &mo ${layerToLayer('arrows')} &mo ${layerToLayer('arrowsr')}>
        , <&macro_tap &kp ${odd.toggleLanguage}>;
)
 `);

// Combos
Object.entries(configParsed.keymap).forEach(([layer, layerConfig]) => {
  if (layerConfig.combos != null) {
    layerConfig.combos.forEach((combo: Combo, comboIndex: number) => {
      const { keys, binding } = combo;
      keys.forEach((key) => {
        const [_tap, _hold, tapHold] = layerConfig.keys.flatMap(a => a)[key].split(',');
        if (tapHold) {
          throw new Error(`Combo interferes with tapHold layer:${layer} key:${key} combo: ${JSON.stringify(combo)}`);
        }
      });
      configParsed.combos.push(`
compatible = "zmk,combos";
combo_${layer}_${comboIndex} {
    timeout-ms = <${comboTerm}>;
    key-positions = <${keys.join(' ')}>;
    bindings = <${keyMapper(configParsed, binding, { layer: `combo_${layer}`, row: 0, index: comboIndex })}>;
    layers = <${layerToLayer(layer)}>;
};
            `);
    });
  }
});

// Conditional layers 2
const layerOrder = Object.keys(configParsed.keymap);
conditionalLayers.forEach(({ layer, targets }, index) => {
  if (!configParsed.keymap[layer]) {
    throw new Error(`Layer for conditional layer does not exists: ${layer}`);
  }
  conditionalLayers[index].targets.forEach((target) => {
    if (!configParsed.keymap[target]) {
      throw new Error(`Target layer for conditional layer does not exists: ${target}`);
    }
  });
  const layerIndex = layerOrder.indexOf(layer);
  const targetsIndexes = targets.map((target) => layerOrder.indexOf(target));
  if (targetsIndexes.find((targetIndex) => targetIndex > layerIndex)) {
    throw new Error(`Conditional layer ${layer} should be defined after all targets ${targets}`);
  }
  configParsed.conditionalLayers.push(`
compatible = "zmk,conditional-layers";
    ${layer}__${targets.join('__')} {
        if-layers = <${layerToLayer(targets[0])} ${layerToLayer(targets[1])}>;
        then-layer = <${layerToLayer(layer)}>;
    };
`);
});

// verify all keys of configParsed.keymap contain 10 arrays and 5,5,5,3,3,5,5,5,3,3 elements in each array
for (const layer in configParsed.keymap) {
  if (configParsed.keymap[layer].keys.length > 12 || configParsed.keymap[layer].keys.length < 10) {
    throw new Error(`layer ${layer} does not contain 10 arrays it contains ${configParsed.keymap[layer].keys.length}`);
  }
  for (let row = 0; row < 9; row++) {
    if ([0, 1, 2, 5, 6, 7].includes(row) && configParsed.keymap[layer].keys[row].length !== 5) {
      throw new Error(`layer ${layer} row ${row} does not contain 5 elements it contains ${configParsed.keymap[layer].keys[row].length}`);
    }
    if ([3, 4, 8, 9].includes(row) && configParsed.keymap[layer].keys[row].length !== 3) {
      throw new Error(`layer ${layer} row ${row} does not contain 3 elements it contains ${configParsed.keymap[layer].keys[row].length}`);
    }
  }
}
const generateSvg = (): void => {
  // install binary from here
  // https://github.com/caksoylar/keymap-drawer
  rimrafSync(Path.join(__dirname, '/keymap/layers'));
  mkdirp.sync(Path.join(__dirname, '/keymap/layers'));
  const layerBlacklist = ['arrowsr', 'colemak_shift', 'colemak_shift_mirror', 'colemak_control', 'russian', 'russian_shift', 'russian_mirror', 'numbersf'];
  const configSubset = JSON.parse(JSON.stringify({ ...configParsed, keymap: _.omit(configParsed.keymap, layerBlacklist) }));
  for (const layer in configSubset.keymap) {
    fs.writeFileSync(`./yanConfig/keymap/layers/${layer}.yaml`, configToKeymap({ ...configParsed, keymap: { [layer]: configSubset.keymap[layer] } }));
    execSync(`/bin/bash -c "cd ${Path.join(__dirname, '/keymap')} &&ls && keymap -c config.yaml draw ./layers/${layer}.yaml > ./layers/${layer}.svg"`);
  }
  fs.writeFileSync('./yanConfig/keymap/layers/__combined.yaml', configToKeymap(configSubset));
  execSync(`/bin/bash -c "cd ${Path.join(__dirname, '/keymap')} &&ls && keymap -c config.yaml draw ./layers/__combined.yaml > ./layers/__combined.svg"`);
};
generateSvg();

// map every key under configParsed.keymap[layer][row] using keyMapper()
const configParsedMapped: ConfigParsed = JSON.parse(JSON.stringify(configParsed));
for (const layer in configParsedMapped.keymap) {
  configParsedMapped.keymap[layer].keys = configParsedMapped.keymap[layer].keys.map((rows, rowIndex) => rows.map((keyText, index) => keyMapper(configParsedMapped, keyText, { layer, row: rowIndex, index })));
}

fs.writeFileSync('./config/flactyl.keymap', configToOutput(configParsedMapped));

console.log(mehArray.filter(({ used }) => !used).map(item => item.value));
