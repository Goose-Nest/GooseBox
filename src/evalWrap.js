module.exports = (jsCode, stop) => {
  let context = {};
  for (const k of Reflect.ownKeys(window)) {
    context[k] = stop.includes(k) ? null : window[k];
  }

  context.window = context;
  context.globalThis = context;

  with (context) {
    return eval(jsCode);
  }
};