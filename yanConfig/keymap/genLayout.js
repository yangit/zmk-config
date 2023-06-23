// This file is only used once to generate the layout for the keymap.
// If layout it the same you do not need to run it.

const layout = [];
const json = {
  url: 'https://github.com/yangit/flactyl',
  layouts: {
    default: {
      layout,
    },
  },
};

const cy = 17;
const staggerRing = cy;
const staggerMiddle = 3;
const staggerIndex = -6;
const staggerIndex2 = -3;
const stagger = [0, staggerRing, staggerMiddle, staggerIndex, staggerIndex2].map(val => val / cy);

// left
for (let row = 0; row < 3; row++) {
  for (let col = 0; col < 5; col++) {
    const offset = stagger.slice(0, col + 1).reduce((acc, val) => acc + val, 0);
    layout.push({ x: col, y: row - offset });
  }
}

// left thumb
for (let row = 0; row < 2; row++) {
  for (let col = 0; col < 3; col++) {
    layout.push({ x: col + 2, y: row + 3 });
  }
}

// right
for (let row = 0; row < 3; row++) {
  for (let col = 0; col < 5; col++) {
    const offset = [...stagger].reverse().slice(0, col).reduce((acc, val) => acc + val, 0);
    layout.push({ x: col + 6, y: row + offset - stagger.reduce((acc, val) => acc + val, 0) });
  }
}

// right thumb
for (let row = 0; row < 2; row++) {
  for (let col = 0; col < 3; col++) {
    layout.push({ x: col + 6, y: row + 3 });
  }
}

console.log(JSON.stringify(json, null, '\t'));
