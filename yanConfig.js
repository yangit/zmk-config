// Description: Yan's config file for ZMK
const fs = require('fs');
const tappingTerm = 3000
const doubleTapTerm = 200
const quickTap = tappingTerm


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
    bindings = <&kp LG(LEFT_BRACKET)>, <&kp LG(RIGHT_BRACKET)>;
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

                ['&mo config', '+L', '+U', '+Y', '&none'],
                ['+M', '+N', '+E', 'I,LG(I),LG(LA(I))', '+O'],
                ['+J', '+H', '+V', 'K,LG(K)', '&none'],

                ['&kp SPACE', '&mo symbols', '&shift_colemak'],
                ['&none', '&mo numbers', '&none']
            ],
            sensor: '&yan_encoder',
        },
        'russian': {
            keys: [
                ['&kp Q', '&kp W', '&kp E', '&kp R', '&gqth T SLASH'],
                ['&kp A', '&kp S', '&kp D', '&kp F', '&kp G'],
                ['&kp Z', '&kp X', '&kp C', '&kp V', '&kp B'],

                ['&trans', '&trans', '&trans'],
                ['&trans', '&trans', '&trans'],

                ['&kp Y', '&kp U', '&kp I', '&kp O', '&kp P'],
                ['&kp H', '&kp J', '&kp K', '&kp L', '&kp SEMICOLON'],
                ['&kp N', '&gqth M RIGHT_BRACKET', '&kp COMMA', '&kp PERIOD', '&gqth SINGLE_QUOTE LEFT_BRACKET'],

                ['&trans', '&trans', '&trans'],
                ['&trans', '&trans', '&trans'],
            ]
        },
        // 'action': {
        //     keys: [
        //         ['=', '=', '=', '=', '='],
        //         ['=', '=', '=', '=', '='],
        //         ['=', '=', '=', '=', '='],

        //         ['&none', '&none', '&none'],
        //         ['&none', '&none', '&none'],

        //         ['=', '=', '=', '=', '='],
        //         ['=', '=', '=', '=', '='],
        //         ['=', '=', '=', '=', '='],

        //         ['&none', '&none', '&none'],
        //         ['&none', '&none', '&none'],
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
                ['&kp LC(EQUAL)', '&kp SPACE', '&kp DELETE', '&kp LC(EQUAL)', '&kp K_VOLUME_UP'],
                ['&kp ESCAPE', '&kp TAB', '&kp BACKSPACE', 'RETURN,LS(RETURN),LG(RETURN)', '&kp K_VOLUME_DOWN'],
                ['&sk LEFT_ALT', '&sk LEFT_CONTROL', '&sk LEFT_SHIFT', '&sk LEFT_COMMAND', 'LG(SPACE),LC(LG(Q))'],

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
                ['&kp LG(LEFT_BRACKET)', '&kp LS(LC(TAB))', '&kp LG(GRAVE)', 'LA(LC(LS(G))),LG(LA(LC(LS(G))))', '&none'],
                ['&kp LG(KP_N0)', '&kp LG(KP_N1)', '&kp LG(KP_N2)', '&kp LG(KP_N3)', '&kp LG(KP_N4)'],
                ['&kp LG(EQUAL)', 'LG(KP_N6),LG(LS(KP_N6))', 'LG(KP_N7),LG(LS(KP_N7))', 'LG(KP_N8),LG(LS(KP_N8))', 'LG(KP_N9),LG(LS(KP_N9))'],

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
                ['&kp LG(RIGHT_BRACKET)', '&kp LC(TAB)', '&kp LS(LG(GRAVE))', '&kp LA(LG(LC(LS(G))))', '&kp LC(LS(N0))'],
                ['LA(LG(LC(LS(Z)))),LA(LG(LC(LS(V)))),LA(LG(LC(LS(KP_N3))))', 'LA(LG(LC(LS(X)))),LA(LG(LC(LS(K))))', 'LA(LG(LC(LS(C)))),LA(LG(LC(LS(KP_N0))))', 'LA(LG(LC(LS(B)))),LA(LG(LC(LS(KP_N1)))),LA(LG(LC(LS(KP_N2))))', 'LG(KP_N9),LS(LG(KP_N9))'],
                ['&kp LG(MINUS)', '&shellrepeat', '&awesome', 'LA(LG(LC(LS(M)))),LA(LG(LC(LS(L)))),LA(LG(LC(LS(N))))', '&kp LG(LS(N4))'],


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
    // if (!tapHold) {
    //     return `&gqth ${hold} ${tap}`
    // }
    if (doubleTap) {
        throw new Error(`double tap is not implemented yet at: ${JSON.stringify(location)}`);
    }
    const macroIndex = macroCounter++
    config.behaviors.push(`
td_${macroIndex}: td_${macroIndex} {
    compatible = "zmk,behavior-tap-dance";
    label = "td_${macroIndex}";
    #binding-cells = <0>;
    tapping-term-ms = <${doubleTapTerm}>;
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
    bindings = <&macro_tap &kp ${tapHold||'X'}>;
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

