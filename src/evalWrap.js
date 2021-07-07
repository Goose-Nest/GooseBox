export default (jsCode, perms) => {
  const context = {};
  for (const k of Reflect.ownKeys(window)) {
    context[k] = null;
  }

  context.GooseBox = true;

  with (context) {
    return eval(jsCode);
  }
};