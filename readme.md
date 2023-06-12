# ZMK-CONFIG generator

This is my `zmk-config` generator, it is written in TS and is located under `./yanConfig/index.ts`

## Why

Basic layers, are ok to write by hand, but tap dances are just horrible in both ZMK and QMK, my config generator of 128 lines in JavaScript generates `.keymap`  4719 lines long. How am I supposed to maintain it manually?

## Features

- Mirror layer
- Create layer from another, but with modifier
- Easily define macros, tap-dance etc
- Combos are defined per layer and are human readable.
- layers defined using their names, and if I ever need to rearrange layer I would not have to kill myself

I.e. tap-dance for key like `'E,LG(E),LS(LG(E))'` means emit `E` on press `LG(E)` on hold and `LS(LG(E))` on tap-and-hold.  
`'+L'` means emit `L` on tap and `LG(L)` on hold.

## Example

```javascript
 var keymap = {
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
        ['&mo numbersf', '&mo numbers', '&globeCaps'],
      ],
      sensor: '&yan_encoder',
      combos: [
        { keys: [8, 13], binding: 'LG(V),LG(LS(V))' },
        { keys: [7, 12], binding: 'LG(C)' },
        { keys: [6, 11], binding: 'LG(X)' },
      ],
    },
    ...
```