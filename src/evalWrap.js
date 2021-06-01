module.exports = (jsCode, stop) => {
  if (typeof window === 'undefined') { // Running in Node.js testing
    global.fetch = () => {};

    window = global;
  }

  let nullObj = stop.reduce((a, v) => { a[v] = null; return a; }, {});

  console.log(nullObj);

  let context = {
    ...window,
    ...nullObj
  };

  context.window = context;
  context.globalThis = context;

  console.log(context);

  with (context) {
    return eval(jsCode);
  }
};