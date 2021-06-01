const { log } = require('../log.js');

module.exports = (originalFunc, stop) => (function (...elements) {
  console.log(this, elements);

  originalFunc.apply(this, elements);

  for (const el of elements) {
    if (!el.contentWindow) return;

    // just mutilate the embed's window (to null stop props)

    for (const k of stop) {
      Object.defineProperty(el.contentWindow, k, { value: null });
    }

    if (el.contentWindow.Node?.prototype?.appendChild) {
      log(`trying ee_replaceFunc`);

      el.contentWindow.Node.prototype.appendChild = module.exports(el.contentWindow.Node.prototype.appendChild, stop);
      el.contentWindow.Node.prototype.append = module.exports(el.contentWindow.Node.prototype.append, stop);
    } else {
      log(`not trying ee_replaceFunc (could not find Node.protoptype.appendChild)`);
    }
  }
});