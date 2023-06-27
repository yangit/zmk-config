import { type ConfigParsed, type Combo, type Config } from './types';
import { configToKeymap, configToOutput, configToParsed, keyMapper, layerToLayer } from './util';
import Path from 'path';
import _ from 'lodash';
import { mkdirp } from 'mkdirp';
import { rimrafSync } from 'rimraf';
// Description: Yan's config file for ZMK
import fs from 'fs';
import { comboTerm, conditionalLayers, m, mehArray, odd } from './config';
import { execSync } from 'child_process';
import keymap from './keymap';

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
  keymap,
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
  if (typeof configParsed.keymap[layer] !== 'object') {
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
        const [,, tapHold] = layerConfig.keys.flatMap(a => a)[key].split(',');
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
  if (typeof configParsed.keymap[layer] !== 'object') {
    throw new Error(`Layer for conditional layer does not exists: ${layer}`);
  }
  conditionalLayers[index].targets.forEach((target) => {
    if (typeof configParsed.keymap[target] !== 'object') {
      throw new Error(`Target layer for conditional layer does not exists: ${target}`);
    }
  });
  const layerIndex = layerOrder.indexOf(layer);
  const targetsIndexes = targets.map((target) => layerOrder.indexOf(target));
  const found = targetsIndexes.find((targetIndex) => targetIndex > layerIndex);
  if (typeof found === 'number') {
    throw new Error(`Conditional layer ${layer} should be defined after all targets ${targets.join(', ')}`);
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
