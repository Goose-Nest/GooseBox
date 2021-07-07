export const log = function() { console.log(`[GooseBox]`, ...arguments); };

export const multi = (...lines) => {
  log(lines.shift());

  lines.forEach((x) => console.log(`         | ${x}`));

  console.log();
};