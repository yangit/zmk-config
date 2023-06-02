import { quickTap, tapDanceTerm, tappingTerm, tappingTerm2 } from './config';
import { type Config, type ConfigParsed, type LayerConfigObject } from './types';

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
