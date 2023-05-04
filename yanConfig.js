// Description: Yan's config file for ZMK
const { log } = require('console');
const fs = require('fs');
const tappingTerm = 250
const tapDanceTerm = 200

/*
for
tappingTerm = 250
tapDanceTerm = 300

First tap < 250
First hold  = 550
Tap and hold = <300 and >250
Double tap = ??
*/
const quickTap = tappingTerm

const mehSeed = [
    'KP_N0', 'KP_N1', 'KP_N2', 'KP_N3', 'KP_N4', 'KP_N5', 'KP_N6', 'KP_N7', 'KP_N8', 'KP_N9',
    'KP_MINUS', 'KP_ASTERISK', 'KP_EQUAL',
    // used by mac for brightness and volume
    // 'F1', 'F2', 'F3', 'F4', 'F5', 'F6', 'F7', 'F8', 'F9', 'F10', 'F11', 'F12',
    'F13', 'F14', 'F15', 'F16', 'F17', 'F18', 'F19', 'F20', 'F21', 'F22', 'F23', 'F24',
    'LANG1', 'LANG2', 'LANG3', 'LANG4', 'LANG5', 'LANG6', 'LANG7', 'LANG8', 'LANG9',
    'N0', 'N1', 'N2', 'N3', 'N4', 'N5', 'N6', 'N7', 'N8', 'N9',
    'GRAVE', 'MINUS', 'EQUAL', 'LEFT_BRACKET', 'RIGHT_BRACKET', 'BACKSLASH', 'SEMI', 'SINGLE_QUOTE', 'COMMA', 'DOT', 'SLASH',
    'A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J',
    'K', 'L', 'M', 'N', 'O', 'P', 'Q', 'R', 'S', 'T',
    'U', 'V', 'W', 'X', 'Y', 'Z',
]

const mehArray = [];
mehSeed.forEach((key) => mehArray.push({ key, modifier: 'super', value: `LA(LG(LC(LS(${key}))))`, used: false }));
// mehSeed.forEach((key) => mehArray.push({ key, modifier: 'meh', value: `LA(LC(LS(${key})))`, used: false }));

const odd = {
    screenshot: 'LG(LS(N4))',
    fontBigger: 'LG(LS(EQUAL))',
    fontSmaller: 'LG(LS(MINUS))',
    toggleLanguage: 'LC(EQUAL)',
    historyBack: 'LG(LEFT_BRACKET)',
    historyForward: 'LG(RIGHT_BRACKET)',
    tabsBack: 'LS(LC(TAB))',
    tabsForward: 'LC(TAB)',
    appWindowBack: 'LS(LG(GRAVE))',
    appWindowForward: 'LG(GRAVE)',
    alfred: 'LG(SPACE)',
    lockScreen: 'LG(LC(Q))',
}

const m = {
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
    appInsomnia: 'LA(LG(LC(LS(LANG1))))',
    appSublime: 'LA(LG(LC(LS(KP_N9))))',
    appNotes: 'LA(LG(LC(LS(KP_MINUS))))',
    appSignal: 'LA(LG(LC(LS(KP_EQUAL))))',
    appTelegram: 'LA(LG(LC(LS(LANG2))))',
    appWhatsup: 'LA(LG(LC(LS(KP_ASTERISK))))',

    // windows
    winCenterSmall: 'LA(LG(LC(LS(N0))))',
    winCenterMed: 'LA(LG(LC(LS(F13))))',
    winCenterBig: 'LA(LG(LC(LS(F14))))',
    winLSmall: 'LA(LG(LC(LS(F15))))',
    // winLTop: 'LA(LG(LC(LS(F16))))',
    // winLBottom: 'LA(LG(LC(LS(F17))))',
    winLMed: 'LA(LG(LC(LS(F18))))',
    winLBig: 'LA(LG(LC(LS(F19))))',
    winRMed: 'LA(LG(LC(LS(F20))))',
    winRBig: 'LA(LG(LC(LS(N2))))',
    winRSmall: 'LA(LG(LC(LS(N3))))',
    // winRTop: 'LA(LG(LC(LS(F23))))',
    // winRBottom: 'LA(LG(LC(LS(F24))))',

}

const legalValues = mehArray.map((item) => item.value);
Object.values(m).forEach((value) => {
    const meh = mehArray.find((item) => item.value === value);
    if (!meh) {
        throw new Error(`Value ${value} is not legal`);
    } else {
        if (meh.used) {
            throw new Error(`Key is used already, possible duplicate MEH hotkeys on different switches ${meh.value}`);
        }
        meh.used = true;
    }

})

const config = {
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
    combos: [
        `
compatible = "zmk,combos";
combo_spc {
    timeout-ms = <50>;
    key-positions = <2 3>;
    bindings = <&kp SPACE>;
};
`
    ],
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
ZMK_MACRO(awesome,
    wait-ms = <50>;
    bindings = <&macro_tap &kp M &kp O &kp O &kp N &kp L &kp A &kp N &kp D &kp E &kp R &kp LS(I) &kp S &kp A &kp W &kp E &kp S &kp RETURN>;
)
`, `
ZMK_MACRO(shellrepeat,
    wait-ms = <400>;
    bindings = <&macro_tap &kp LG(KP_N1) &kp UP_ARROW &kp RETURN>;
)
`, `
ZMK_MACRO(ctrl_colemak,
    wait-ms = <0>;
    bindings 
        = <&macro_press &mo L_COLEMAK &kp LEFT_CONTROL>
        , <&macro_pause_for_release>
        , <&macro_release &mo L_COLEMAK &kp LEFT_CONTROL>;
)
ZMK_MACRO(shift_colemak,
    wait-ms = <0>;
    bindings 
        = <&macro_press &mo L_COLEMAK &kp LEFT_SHIFT>
        , <&macro_pause_for_release>
        , <&macro_release &mo L_COLEMAK &kp LEFT_SHIFT>;
)
`
    ],
    keymap: {
        'default': {
            keys: [
                ['Q,LG(SLASH),LA(LG(Q))', 'W,LG(W),LG(Q)', 'F,LG(F),LA(LG(F))', 'P,LG(P),LS(LG(P))', '&mo config'],
                ['+A', '+R', '+S', 'T,LG(T),LG(N)', 'G,LG(G),LG(D)'],
                ['Z,LG(Z),LG(LS(Z))', '+X', '+C', 'D,LG(V),LG(LS(V))', 'B,LG(B),LG(LS(B))'],

                ['&mo windows', '&mo arrows', '&mo numbers'],
                ['&mo windows2', '&mo mirror', '&ctrl_colemak'],

                ['&mo config', '+L', '+U', '+Y', 'N1,N2,N3'],
                ['+M', '+N', '+E', 'I,LG(I),LG(LA(I))', '+O'],
                ['+J', '+H', '+V', 'K,LG(K)', '&none'],

                ['&kp SPACE', '&mo symbols', '&shift_colemak'],
                ['&none', '&mo numbers', '&none']
            ],
            sensor: '&yan_encoder',
        },
        'russian': {
            keys: [
                ['&kp Q', '&kp W', '&kp E', '&kp R', 'T,SLASH'],
                ['&kp A', '&kp S', '&kp D', '&kp F', '&kp G'],
                ['&kp Z', '&kp X', '&kp C', '&kp V', '&kp B'],

                ['&trans', '&trans', '&trans'],
                ['&trans', '&trans', '&trans'],

                ['&kp Y', '&kp U', '&kp I', '&kp O', '&kp P'],
                ['&kp H', '&kp J', '&kp K', '&kp L', '&kp SEMICOLON'],
                ['&kp N', 'M,RIGHT_BRACKET', '&kp COMMA', '&kp PERIOD', 'SINGLE_QUOTE,LEFT_BRACKET'],

                ['&trans', '&trans', '&trans'],
                ['&trans', '&trans', '&trans'],
            ]
        },
        // 'test': {
        //     keys: [
        //         ['&kp LA(LG(LC(LS(F1))))', '&kp LA(LG(LC(LS(F2))))', '&kp LA(LG(LC(LS(F3))))', '&kp LA(LG(LC(LS(F4))))', '&kp LA(LG(LC(LS(F5))))'],
        //         ['&kp LA(LG(LC(LS(F6))))', '&kp LA(LG(LC(LS(F7))))', '&kp LA(LG(LC(LS(F8))))', '&kp LA(LG(LC(LS(F9))))', '&kp LA(LG(LC(LS(F10))))'],
        //         ['&kp LA(LG(LC(LS(F11))))', '&kp LA(LG(LC(LS(F12))))', '&none', '&none', '&none'],

        //         ['&trans', '&trans', '&trans'],
        //         ['&trans', '&trans', '&trans'],

        //         ['&kp LA(LG(LC(LS(F13))))', '&kp LA(LG(LC(LS(F14))))', '&kp LA(LG(LC(LS(F15))))', '&kp LA(LG(LC(LS(F16))))', '&kp LA(LG(LC(LS(F17))))'],
        //         ['&kp LA(LG(LC(LS(F18))))', '&kp LA(LG(LC(LS(F19))))', '&kp LA(LG(LC(LS(F20))))', '&kp LA(LG(LC(LS(F21))))', '&kp LA(LG(LC(LS(F22))))'],
        //         ['&kp LA(LG(LC(LS(F23))))', '&kp LA(LG(LC(LS(F24))))', '&none', '&none', '&none'],

        //         ['&trans', '&trans', '&trans'],
        //         ['&trans', '&trans', '&trans'],
        //     ]
        // },

        'mirror': {
            keys: [
                ['=', '=', '=', '=', '='],
                ['=', '=', '=', '=', '='],
                ['=', '=', '=', '=', '='],

                ['&none', '&none', '&none'],
                ['&none', '&none', '&none'],

                ['=', '=', '=', '=', '='],
                ['=', '=', '=', '=', '='],
                ['=', '=', '=', '=', '='],

                ['&none', '&none', '&none'],
                ['&none', '&none', '&none'],
            ]
        },
        'qwerty': {
            keys: [
                ['&kp Q', '&kp W', '&kp E', '&kp R', '&kp T'],
                ['&kp A', '&kp S', '&kp D', '&kp F', '&kp G'],
                ['&kp Z', '&kp X', '&kp C', '&kp V', '&kp B'],

                ['&trans', '&trans', '&trans'],
                ['&trans', '&trans', '&trans'],

                ['&kp Y', '&kp U', '&kp I', '&kp O', '&kp P'],
                ['&kp H', '&kp J', '&kp K', '&kp L', '&kp SEMICOLON'],
                ['&kp N', '&kp M', '&kp COMMA', '&kp PERIOD', '&kp SLASH'],

                ['&trans', '&trans', '&trans'],
                ['&trans', '&trans', '&trans'],
            ]
        },
        'colemak': {
            keys: [
                ['&kp Q', '&kp W', '&kp F', '&kp P', '&none'],
                ['&kp A', '&kp R', '&kp S', '&kp T', '&kp G'],
                ['&kp Z', '&kp X', '&kp C', '&kp D', '&kp B'],

                ['&trans', '&trans', '&trans'],
                ['&trans', '&trans', '&trans'],

                ['&none', '&kp L', '&kp U', '&kp Y', '&none'],
                ['&kp M', '&kp N', '&kp E', '&kp I', '&kp O'],
                ['&kp J', '&kp H', '&kp V', '&kp K', '&none'],

                ['&trans', '&trans', '&trans'],
                ['&trans', '&trans', '&trans'],
            ]
        },
        'numbers': {
            keys: [
                ['KP_MULTIPLY,KP_DIVIDE,COLON', '&kp N7', '&kp N8', '&kp N9', '&trans'],
                ['KP_PLUS,KP_MINUS', '&kp N1', '&kp N2', '&kp N3', '&kp N0'],
                ['KP_DOT,COMMA', '&kp N4', '&kp N5', '&kp N6', '&kp KP_EQUAL'],

                ['&trans', '&trans', '&trans'],
                ['&trans', '&trans', '&trans'],

                ['=', '=', '=', '=', '='],
                ['=', '=', '=', '=', '='],
                ['=', '=', '=', '=', '='],

                ['&trans', '&trans', '&trans'],
                ['&trans', '&trans', '&trans'],
            ]
        },
        'arrows': {
            keys: [
                [odd.toggleLanguage, '&kp SPACE', '&kp DELETE', odd.toggleLanguage, '&kp K_VOLUME_UP'],
                ['&kp ESCAPE', '&kp TAB', '&kp BACKSPACE', 'RETURN,LS(RETURN),LG(RETURN)', '&kp K_VOLUME_DOWN'],
                ['&sk LEFT_ALT', '&sk LEFT_CONTROL', '&sk LEFT_SHIFT', '&sk LEFT_COMMAND', `${odd.alfred},${odd.lockScreen}`],

                ['&trans', '&trans', '&trans'],
                ['&trans', '&trans', '&trans'],

                ['&none', '&kp HOME', '&kp UP_ARROW', '&kp PAGE_UP', '&none'],
                ['&none', '&kp LEFT_ARROW', '&kp DOWN_ARROW', '&kp RIGHT_ARROW', '&none'],
                ['&none', '&kp END', '&none', '&kp PAGE_DOWN', '&none'],

                ['&trans', '&trans', '&trans'],
                ['&trans', '&trans', '&trans'],
            ]
        },
        'symbols': {
            keys: [
                ['&kp SLASH', '&kp LEFT_PARENTHESIS', '&kp RIGHT_PARENTHESIS', '&kp MINUS', '&kp PLUS'],
                ['&kp LEFT_BRACKET', '&kp RIGHT_BRACKET', '&kp LEFT_BRACE', '&kp RIGHT_BRACE', '&kp ASTERISK'],
                ['&kp DOLLAR', '&kp LESS_THAN', '&kp EQUAL', '&kp GREATER_THAN', '&kp AT_SIGN'],

                ['&trans', '&trans', '&trans'],
                ['&trans', '&trans', '&trans'],

                ['&kp EXCLAMATION', '&kp QUESTION', '&kp COLON', '&kp SEMICOLON', 'BACKSLASH,PIPE'],
                ['&kp TILDE', '&kp PERIOD', '&kp COMMA', '&kp GRAVE', '&kp SINGLE_QUOTE'],
                ['PERCENT,CARET', '&kp HASH', '&kp UNDERSCORE', '&kp AMPERSAND', '&kp DOUBLE_QUOTES'],

                ['&trans', '&trans', '&trans'],
                ['&trans', '&trans', '&trans'],
            ]
        },
        'windows': {
            keys: [
                [odd.historyBack, odd.tabsBack, odd.appWindowBack, m.macAppsWitchBackward, '&none'],
                [m.appFinder, m.appTerminal, m.appVsCode, m.appBrowser, m.appSlack],

                [odd.fontBigger, m.appSignal, `${m.appTelegram},${m.appWhatsup}`, `${m.appSublime},${m.appNotes}`, `${m.showApps},${m.showDesktop}`],

                ['&trans', '&trans', '&trans'],
                ['&trans', '&trans', '&trans'],

                ['&trans', '&trans', '&trans', '&trans', '&trans'],
                ['&trans', '&trans', '&trans', '&trans', '&trans'],
                ['&trans', '&trans', '&trans', '&trans', '&trans'],

                ['&trans', '&trans', '&trans'],
                ['&trans', '&trans', '&trans'],
            ]
        },
        'windows2': {
            keys: [
                [odd.historyForward, odd.tabsForward, odd.appWindowForward, m.macAppsWitchForward, '&none'],
                [m.winLSmall, `${m.winLMed},${m.winLBig}`, `${m.winRMed},${m.winRBig}`, m.winRSmall, '&none'],
                [odd.fontSmaller, '&shellrepeat', '&awesome', `${m.winCenterSmall},${m.winCenterMed},${m.winCenterBig}`, odd.screenshot],


                ['&trans', '&trans', '&trans'],
                ['&trans', '&trans', '&trans'],

                ['&trans', '&trans', '&trans', '&trans', '&trans'],
                ['&trans', '&trans', '&trans', '&trans', '&trans'],
                ['&trans', '&trans', '&trans', '&trans', '&trans'],

                ['&trans', '&trans', '&trans'],
                ['&trans', '&trans', '&trans'],
            ]
        },
        'config': {
            keys: [
                ['&bootloader', '&none', '&none', '&none', '&none'],
                ['&sys_reset', '&none', '&none', '&none', '&none'],
                ['&bt BT_PRV', '&bt BT_NXT', '&bt BT_CLR', '&out OUT_USB', '&out OUT_BLE'],

                ['&none', '&none', '&none'],
                ['&none', '&none', '&none'],

                ['&none', '&none', '&none', '&none', '&bootloader'],
                ['&none', '&none', '&none', '&none', '&sys_reset',],
                ['&none', '&none', '&none', '&none', '&none',],

                ['&none', '&none', '&none'],
                ['&none', '&none', '&none'],

            ]
        },

    }
};

//layer #defines


//use generated hotkey combinations such that I do not have to invent them

// verify all keys of config.keymap contain 10 arrays and 5,5,5,3,3,5,5,5,3,3 elements in each array
for (let layer in config.keymap) {
    if (config.keymap[layer].keys.length !== 10) {
        throw new Error(`layer ${layer} does not contain 10 arrays it contains ${config.keymap[layer].keys.length}`);
    }
    for (let row = 0; row < 9; row++) {
        if ([0, 1, 2, 5, 6, 7].includes(row) && config.keymap[layer].keys[row].length !== 5) {
            throw new Error(`layer ${layer} row ${row} does not contain 5 elements it contains ${config.keymap[layer].keys[row].length}`);
        }
        if ([3, 4, 8, 9].includes(row) && config.keymap[layer].keys[row].length !== 3) {
            throw new Error(`layer ${layer} row ${row} does not contain 3 elements it contains ${config.keymap[layer].keys[row].length}`);
        }
    }
}





// mirror numbers layer
config.keymap.numbers.keys[5] = config.keymap.numbers.keys[0].slice().reverse();
config.keymap.numbers.keys[6] = config.keymap.numbers.keys[1].slice().reverse();
config.keymap.numbers.keys[7] = config.keymap.numbers.keys[2].slice().reverse();

//add mirror layer
config.keymap.mirror.keys[0] = config.keymap.default.keys[5].slice().reverse();
config.keymap.mirror.keys[1] = config.keymap.default.keys[6].slice().reverse();
config.keymap.mirror.keys[2] = config.keymap.default.keys[7].slice().reverse();
config.keymap.mirror.keys[5] = config.keymap.default.keys[0].slice().reverse();
config.keymap.mirror.keys[6] = config.keymap.default.keys[1].slice().reverse();
config.keymap.mirror.keys[7] = config.keymap.default.keys[2].slice().reverse();


// #define L_DEFAULT 0
// #define L_ARROWS   1
// #define L_SYMBOLS 2
const defines = Object.keys(config.keymap).map((layer, index) => `#define L_${layer.toUpperCase()} ${index}`).join('\n')
let macroCounter = 0
const unwrapTapDance = (keyText, location) => {
    const [tap, hold, tapHold, doubleTap] = keyText.split(',');
    if (doubleTap) {
        throw new Error(`double tap is not implemented yet at: ${JSON.stringify(location)}`);
    }
    const macroIndex = macroCounter++
    config.behaviors.push(`
td_${macroIndex}: td_${macroIndex} {
    compatible = "zmk,behavior-tap-dance";
    label = "td_${macroIndex}";
    #binding-cells = <0>;
    tapping-term-ms = <${tapDanceTerm}>;
    bindings = <&td_${macroIndex}_first 0 ${tap}>, <&td_${macroIndex}_second 0 0>;
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
};
td_${macroIndex}_second: td_${macroIndex}_second {
    compatible = "zmk,behavior-hold-tap";
    label = "td_${macroIndex}_second";
    #binding-cells = <2>;
    flavor = "tap-preferred";
    tapping-term-ms = <${tappingTerm}>;
    quick-tap-ms = <${quickTap}>;
    global-quick-tap;
    bindings = <&td_${macroIndex}_hold_second>, <&td_${macroIndex}_repeat>;
};
`)

    config.macros.push(`
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
`)
    if (!tapHold) {
        return `&td_${macroIndex}_first 0 ${tap}`
    }
    return `&td_${macroIndex}`

}

const keyMapper = (keyText, location) => {

    //layer switcher &mo L_LAYER
    if (keyText.startsWith('&mo ')) {
        const [, layer] = keyText.split(' ')
        if (!Object.keys(config.keymap).includes(layer)) {
            throw new Error(`layer ${layer} does not exist at keyText: ${keyText} :${JSON.stringify(location)}`)
        }
        return `&mo L_${layer.toUpperCase()}`
    }
    if (keyText === '=') {
        throw new Error(`keyText ${keyText} is not allowed at ${JSON.stringify(location)}`)
    }
    if (keyText.startsWith('+')) {
        const symbol = keyText.slice(1)
        return unwrapTapDance(`${symbol},LG(${symbol})`);
    }
    if (keyText.includes(',')) {
        return unwrapTapDance(keyText);
    }
    if (!keyText.startsWith('&')) {
        return `&kp ${keyText}`;
    }
    return keyText;
}

//map every key under config.keymap[layer][row] using keyMapper()
for (let layer in config.keymap) {
    config.keymap[layer].keys = config.keymap[layer].keys.map((rows, rowIndex) => rows.map((keyText, index) => keyMapper(keyText, { layer, row: rowIndex, index })))
}
console.log(config.keymap);

const tab = (str, pad) => str.split('\n').map(line => `${pad}${line}`).join('\n')

const output = `${config.header}
${defines}
${config.postHeader}
    combos {
${tab(config.combos.map(macro => macro.trim()).join('\n'), '        ')}
    };
    behaviors {
${tab(config.behaviors.map(macro => macro.trim()).join('\n'), '        ')}
    };
    macros {
${tab(config.macros.map(macro => macro.trim()).join('\n'), '        ')}
    };
    keymap {
        compatible = "zmk,keymap";
        ${Object.keys(config.keymap).map((layer, index) => `
        /* ${layer} ${index} */
        ${layer}_layer {
            bindings = <
${config.keymap[layer].keys.map(row => row.join('\t')).join('\n')}
            >;${config.keymap[layer].sensor ? `\n sensor-bindings = <${config.keymap[layer].sensor}>;` : ''}            
        };
    `).join('\n')}
    };
};
`

fs.writeFileSync('./config/flactyl.keymap', output)
console.log(output);

console.log(mehArray.filter(({ used }) => !used).map(item => item.value));