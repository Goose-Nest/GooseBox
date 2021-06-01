module.exports = (jsCode, stop) => {
  if (typeof window === 'undefined') { // Running in Node.js testing
    global.fetch = () => {};

    window = global;
  }

  let context = {};

  for (const k of Reflect.ownKeys(window)) {
    context[k] = stop.includes(k) ? null : window[k];
  }

  context.window = context;
  context.globalThis = context;

  console.log(context);

  with (context) {
    return eval(jsCode);
  }
};