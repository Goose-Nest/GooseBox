const ee_replaceFunc = require('./solves/embedElements.js');

const { log } = require('./log.js');

module.exports = (jsCode, stop) => {
  const context = {};
  for (const k of Reflect.ownKeys(window)) {
    context[k] = stop.includes(k) ? null : window[k];
  }

  context[0] = context;
  context.top = context;
  context.self = context;
  context.window = context;
  context.globalThis = context;

  if (context.Node?.prototype?.appendChild) {
    log(`trying ee_replaceFunc`);

    context.Node.prototype.appendChild = ee_replaceFunc(context.Node.prototype.appendChild, stop);
    context.Node.prototype.append = ee_replaceFunc(context.Node.prototype.append, stop);
  } else {
    log(`not trying ee_replaceFunc (could not find Node.protoptype.appendChild)`);
  }

  with (context) {
    return eval(jsCode);
  }
};