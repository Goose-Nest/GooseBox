const modContext = require('./modContext.js');

module.exports = (jsCode, stop) => {
  const context = {};
  for (const k of Reflect.ownKeys(window)) {
    context[k] = stop.includes(k) ? null : window[k];
  }

  context.GooseBox = true;

  context[0] = context;
  context.top = context;
  context.self = context;
  context.window = context;
  context.globalThis = context;

  modContext(context);

  with (context) {
    return eval(jsCode);
  }
};