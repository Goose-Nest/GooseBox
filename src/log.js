const rgb = (r, g, b, text) => `\x1b[38;2;${r};${g};${b}m${text}\x1b[0m`;

module.exports = {
  log: function() { console.log(`[${rgb(250, 250, 0, 'GooseBox')}]`, ...arguments); },

  multi: (...lines) => {
    console.log(`[${rgb(250, 250, 0, 'GooseBox')}]`, lines.shift());
    lines.forEach((x) => console.log(`         | ${x}`));
    console.log();
  }
};