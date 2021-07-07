export default (jsCode, stop) => {
  const context = {};
  for (const k of Reflect.ownKeys(window)) {
    context[k] = stop.includes(k) ? null : window[k];
  }

  context.GooseBox = true;

  with (context) {
    return eval(jsCode);
  }
};