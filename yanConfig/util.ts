import { quickTap, tapDanceTerm, tappingTerm, tappingTerm2, m, odd, conditionalLayers } from './config';
import { type Config, type ConfigParsed, type LayerConfigObject } from './types';
import yaml, { loadAll } from 'js-yaml';
interface KeyLocation { layer: string, row: number, index: number };

let macroCounter = 0;
export const layerToLayer = (layer: string) => `L_${layer.toUpperCase()}`;
export const unwrapPlus = (string: string) => `${string.slice(1)},LG(${string.slice(1)})`;
export const unwrapTapDance = (configParsed: ConfigParsed, keyText: string, _location: KeyLocation) => {
  const [tap, hold, tapHold, doubleTap] = keyText.split(',');
  // if (doubleTap) {
  //     throw new Error(`double tap is not implemented yet at ${keyText} ${JSON.stringify(location)}`);
  // }
  const macroIndex = macroCounter++;

  configParsed.behaviors.push(`
td_${macroIndex}: td_${macroIndex} {
    compatible = "zmk,behavior-tap-dance";
    label = "td_${macroIndex}";
    #binding-cells = <0>;
    tapping-term-ms = <${tapDanceTerm}>;
    bindings = <&td_${macroIndex}_first 0 ${tap}>, ${tapHold ? `<&td_${macroIndex}_second 0 ${doubleTap || 0}>` : `<&td_${macroIndex}_repeat>`};
};
td_${macroIndex}_first: td_${macroIndex}_first {
    compatible = "zmk,behavior-hold-tap";
    label = "td_${macroIndex}_first";
    #binding-cells = <2>;
    flavor = "tap-preferred";
    tapping-term-ms = <${tappingTerm}>;
    quick-tap-ms = <${quickTap}>;
    global-quick-tap;
    bindings = <&td_${macroIndex}_hold_first>, <&kp>;
};`);
  if (tapHold) {
    configParsed.behaviors.push(`
td_${macroIndex}_second: td_${macroIndex}_second {
    compatible = "zmk,behavior-hold-tap";
    label = "td_${macroIndex}_second";
    #binding-cells = <2>;
    flavor = "tap-preferred";
    tapping-term-ms = <${tappingTerm2}>;
    quick-tap-ms = <${quickTap}>;
    global-quick-tap;
    bindings = <&td_${macroIndex}_hold_second>, <${doubleTap ? '&kp' : `&td_${macroIndex}_repeat`}>;
};`);
  }

  configParsed.macros.push(`
ZMK_MACRO(td_${macroIndex}_hold_first,
    wait-ms = <0>;
    bindings = <&macro_tap &kp ${hold}>;
)
ZMK_MACRO(td_${macroIndex}_hold_second,
    wait-ms = <0>;
    bindings = <&macro_tap &kp ${tapHold || 'X'}>;
)
ZMK_MACRO(td_${macroIndex}_repeat,
    wait-ms = <0>;
    bindings = <&macro_tap &kp ${tap} &kp ${tap}>;
)
`);
  return `&td_${macroIndex}`;
};

export const keyMapper = (configParsed: ConfigParsed, keyText: string, location: KeyLocation) => {
  // layer switcher &mo L_LAYER
  if (keyText.startsWith('&mo ')) {
    const [, layer] = keyText.split(' ');
    if (!Object.keys(configParsed.keymap).includes(layer)) {
      console.log(configParsed.keymap);

      throw new Error(`layer ${layer} does not exist at keyText: ${keyText} :${JSON.stringify(location)}`);
    }
    return `&mo L_${layer.toUpperCase()}`;
  }
  if (keyText === '=') {
    throw new Error(`keyText ${keyText} is not allowed at ${JSON.stringify(location)}`);
  }
  if (keyText.startsWith('+')) {
    return unwrapTapDance(configParsed, unwrapPlus(keyText), location);
  }
  if (keyText.includes(',')) {
    return unwrapTapDance(configParsed, keyText, location);
  }
  if (!keyText.startsWith('&')) {
    return `&kp ${keyText}`;
  }
  return keyText;
};

export const reverseLayerFrom = (layer: string) => (configLocal: ConfigParsed): LayerConfigObject => {
  if (!configLocal.keymap[layer]) {
    throw new Error(`Layer ${layer} is not defined`);
  }

  const [r1, r2, r3, _r4, _r5, r6, r7, r8, _r9, _r10] = configLocal.keymap[layer].keys.map((row) => row.slice().reverse());
  return {
    keys: [
      r6,
      r7,
      r8,
      ['&trans', '&trans', '&trans'],
      ['&trans', '&trans', '&trans'],
      r1,
      r2,
      r3,
      ['&trans', '&trans', '&trans'],
      ['&trans', '&trans', '&trans'],
    ],
  };
};
export const or = (a: string | undefined, b: string): string => typeof a === 'string' ? a : b;

export const addModifierToLayer = (layer: string, modifier: string) => (configLocal: ConfigParsed) => {
  if (typeof configLocal.keymap[layer] === 'undefined') {
    throw new Error(`Layer ${layer} is not defined`);
  }
  const keys = configLocal.keymap[layer].keys.map(row => row.map(key => {
    if (key.startsWith('&')) { return key; }
    return `${modifier}(${key.split(',')[0]})`;
  }));
  return { keys };
};

export const tab = (str: string, pad: string) => str.split('\n').map(line => `${pad}${line}`).join('\n');

export const configToParsed = (config: Config): ConfigParsed => {
  // invoke layer config with configLocal
  const configParsed: ConfigParsed = { ...config, keymap: {} };
  Object.entries(config.keymap).forEach(([layer, layerConfig]) => {
    if (typeof layerConfig === 'function') {
      // console.log(layer, Object.keys(config.keymap), config.keymap.russian);
      configParsed.keymap[layer] = layerConfig(configParsed);
    } else {
      // @ts-expect-error
      configParsed.keymap[layer] = config.keymap[layer];
    }
  });
  return configParsed;
};

export const configToOutput = (configParsed: ConfigParsed) => {
  const defines = Object.keys(configParsed.keymap).map((layer, index) => `#define ${layerToLayer(layer)} ${index}`).join('\n');
  return `${configParsed.header}
${defines}
${configParsed.postHeader}
    conditional_layers {
${tab(configParsed.conditionalLayers.map(macro => macro.trim()).join('\n'), '        ')}
    };
    combos {
${tab(configParsed.combos.map(combo => combo.trim()).join('\n'), '        ')}
    };
    behaviors {
${tab(configParsed.behaviors.map(macro => macro.trim()).join('\n'), '        ')}
    };
    macros {
${tab(configParsed.macros.map(macro => macro.trim()).join('\n'), '        ')}
    };
    keymap {
        compatible = "zmk,keymap";
        ${Object.keys(configParsed.keymap).map((layer, index) => `
        /* ${layer} ${index} */
        ${layer}_layer {
            bindings = <
${configParsed.keymap[layer].keys.map(row => row.join('\t')).join('\n')}
            >;${configParsed.keymap[layer].sensor ? `\n sensor-bindings = <${configParsed.keymap[layer].sensor}>;` : ''}            
        };
    `).join('\n')}
    };
};
`;
};
const findInHotkeys = (key: string): string => {
  for (const [k, v] of Object.entries(m)) {
    if (v === key) {
      return k;
    }
  }
  for (const [k, v] of Object.entries(odd)) {
    if (v === key) {
      return k;
    }
  }

  return key;
};

export const configToKeymap = (config: ConfigParsed): string => {
  const layers: any = {

  };

  type RenderKey = string | { h?: string, t?: string, s?: string };
  const keymap: Record<string, RenderKey> = {
    LEFT_SHIFT: { t: '$$mdi:apple-keyboard-shift$$' },
    LEFT_COMMAND: { t: '$$mdi:apple-keyboard-command$$' },
    LEFT_CONTROL: { t: '$$mdi:apple-keyboard-control$$' },
    LEFT_ALT: { t: '$$mdi:apple-keyboard-option$$' },
    '&trans': '',
    '&kp CAPS': { t: '$$mdi:web$$' },
    '&none': { t: '$$mdi:cancel$$' },
    RETURN: { t: '$$mdi:keyboard-return$$' },
    ESCAPE: { t: 'ESC' },
    PAGE_UP: { t: 'PAGE UP' },
    PAGE_DOWN: { t: 'PAGE DOWN' },
    K_VOLUME_UP: { t: '$$mdi:volume-high$$' },
    K_VOLUME_DOWN: { t: '$$mdi:volume-medium$$' },
    '&mkp LCLK': { t: '$$tabler:mouse$$', h: 'click l' },
    '&mkp RCLK': { t: '$$tabler:mouse$$', h: 'click r' },
    UP_ARROW: { t: '$$tabler:arrow-up$$' },
    DOWN_ARROW: { t: '$$tabler:arrow-down$$' },
    LEFT_ARROW: { t: '$$tabler:arrow-left$$' },
    RIGHT_ARROW: { t: '$$tabler:arrow-right$$' },
    '&sys_reset': { t: 'reset', h: 'keyboard' },
    '&bootloader': 'bootloader',
    '&bts0': { t: '$$mdi:bluetooth$$', h: 'BLE 1' },
    '&bts1': { t: '$$mdi:bluetooth$$', h: 'BLE 2' },
    '&bts2': { t: '$$mdi:bluetooth$$', h: 'BLE 3' },
    '&bts3': { t: '$$mdi:bluetooth$$', h: 'BLE 4' },
    '&bts4': { t: '$$mdi:bluetooth$$', h: 'BLE 5' },
    '&bt BT_PRV': { t: '$$mdi:bluetooth$$', h: 'BLE prev' },
    '&bt BT_NXT': { t: '$$mdi:bluetooth$$', h: 'BLE next' },
    '&bt BT_CLR': { t: '$$mdi:bluetooth$$', h: 'BLE clear' },
    '&out OUT_USB': { t: '$$mdi:usb$$', h: 'select USB' },
    '&out OUT_BLE': { t: '$$mdi:bluetooth$$', h: 'select BLE' },
    '&enable_rus': { t: '$$mdi:web$$', h: 'russian' },
    N1: '1',
    N2: '2',
    N3: '3',
    N4: '4',
    N5: '5',
    N6: '6',
    N7: '7',
    N8: '8',
    N9: '9',
    N0: '0',
    KP_MINUS: '-',
    KP_PLUS: '+',
    KP_DOT: '.',
    KP_DIVIDE: '/',
    KP_MULTIPLY: '*',
    KP_EQUAL: '=',
    RIGHT_SHIFT: { t: '$$tabler:hand-move$$', h: 'scroll' },
    SPACE: { t: '$$tabler:space$$' },
    BACKSPACE: { t: '$$mdi:backspace-outline$$' },
    DELETE: { t: '$$mdi:backspace-reverse-outline$$' },
    EXCLAMATION: '!',
    EXCL: '!',
    AT_SIGN: '@',
    AT: '@',
    HASH: '#',
    POUND: '#',
    DOLLAR: '$',
    DLLR: '$',
    PERCENT: '%',
    PRCNT: '%',
    CARET: '^',
    AMPERSAND: '&',
    AMPS: '&',
    ASTERISK: '*',
    ASTRK: '*',
    STAR: '*',
    LEFT_PARENTHESIS: '(',
    LPAR: '(',
    RIGHT_PARENTHESIS: ')',
    RPAR: ')',
    EQUAL: '=',
    PLUS: '+',
    MINUS: '-',
    UNDERSCORE: '_',
    UNDER: '_',
    SLASH: '/',
    FSLH: '/',
    QUESTION: '?',
    QMARK: '?',
    BACKSLASH: '\\',
    BSLH: '\\',
    PIPE: '|',
    NON_US_BACKSLASH: '\\',
    PIPE2: '|',
    NON_US_BSLH: '|',
    SEMICOLON: ';',
    SEMI: ';',
    COLON: ':',
    SINGLE_QUOTE: "'",
    SQT: "'",
    APOSTROPHE: '<',
    APOS: '.',
    DOUBLE_QUOTES: '"',
    DQT: '"',
    COMMA: ',',
    LESS_THAN: '<',
    LT: '<',
    PERIOD: '.',
    DOT: '.',
    GREATER_THAN: '>',
    GT: '>',
    LEFT_BRACKET: '[',
    LBKT: '[',
    LEFT_BRACE: '{',
    LBRC: '{',
    RIGHT_BRACKET: ']',
    RBKT: ']',
    RIGHT_BRACE: '}',
    RBRC: '}',
    GRAVE: '`',
    TILDE: '~',
    NON_US_HASH: '#',
    NUHS: '#',
    TILDE2: '~',
  };

  const decodeModifier = (key: string): string => {
    const localKey = findInHotkeys(key);
    return localKey.replace(/\)/g, '').split('(').map(modOrKey => {
      if (modOrKey === 'LS') {
        return 'SFT';
      }
      if (modOrKey === 'LA') {
        return 'ALT';
      }
      if (modOrKey === 'LG') {
        return 'CMD';
      }
      if (modOrKey === 'LC') {
        return 'CTL';
      }
      return modOrKey;
    })
      .join('-');
  };
  const tryKey = (key: string): string => {
    if (Object.keys(keymap).includes(key)) {
      const result = keymap[key];
      if (typeof result === 'string') {
        return result;
      }
    }
    return decodeModifier(key);
  };

  const keyToKeyLabel = (key: string): RenderKey => {
    if (key.startsWith('&mo ')) {
      if (key.includes('_mirror')) {
        return { t: '$$mdi:mirror-rectangle$$' };
      }
      if (key.includes('_shift')) {
        return { t: '$$mdi:apple-keyboard-shift$$' };
      }
      if (key.includes('_control')) {
        return { t: '$$mdi:apple-keyboard-control$$' };
      }

      return { h: key.slice(4), t: '$$tabler:box-multiple$$' };
    }
    if (Object.keys(keymap).includes(key)) {
      // eslint-disable-next-line
      if (typeof keymap[key]!=='undefined') { 
        return keymap[key];
      }
    }

    if (key.startsWith('+')) {
      return { t: tryKey(key.slice(1)), h: `CMD-${tryKey(key.slice(1))}` };
    }
    if (key.includes(',')) {
      const [t, h, s] = key.split(',').map(tryKey);

      return { t, h, s };
    }
    return decodeModifier(key);
  };
  Object.keys(config.keymap).forEach((layer) => {
    layers[layer] = config.keymap[layer].keys.slice(0, 10).flatMap(val => val.map(keyToKeyLabel));
  });

  const findKeyIndex = (key: string): number => {
    let index = -1;
    Object.entries(config.keymap).forEach(([layer, layerConfig]) => {
      const found = layerConfig.keys.flatMap(val => val).findIndex(val => val === key);
      if (found > -1) {
        index = found;
      }
    });
    return index;
  };

  const json: any = {
    layout: {
      qmk_info_json: './flactyl_layout.json',
      qmk_layout: 'default',
    },
    layers,
    combos: []
    ,
  };

  if (Object.keys(config.keymap).length === 1 && Boolean(config.keymap.default)) {
    config.keymap.default.combos?.forEach(combo => json.combos.push({ p: combo.keys, k: keyToKeyLabel(combo.binding) }));
    conditionalLayers.forEach((layer) => {
      if (layer.targets.findIndex(target => target.includes('russian')) === -1) {
        json.combos.push({ p: layer.targets.map(target => findKeyIndex(`&mo ${target}`)), k: keyToKeyLabel(`&mo ${layer.layer}`) });
      }
    });
  }

  return yaml.dump(json, { noRefs: true });
};
