const rgb = (r, g, b, text) => `\x1b[38;2;${r};${g};${b}m${text}\x1b[0m`;
const log = function() { console.log(`[${rgb(250, 250, 0, 'GooseBox')}]`, ...arguments); };

module.exports = {
  log,

  multi: (...lines) => {
    log(lines.shift());

    lines.forEach((x) => console.log(`         | ${x}`));

    console.log();
  }
};