const evalWrap = (jsCode, stop) => {
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
const permList = [
  {
    name: 'network',
    props: ['fetch', 'XMLHttpRequest']
  },

  {
    name: 'dom',
    props: ['document']
  },

  {
    name: 'localstorage',
    props: ['localStorage']
  },

  /* Discord / some sites specific */
  {
    name: 'sentry',
    props: ['__SENTRY__', 'DiscordSentry']
  },

  {
    name: 'discordnative',
    props: ['DiscordNative']
  },

  {
    name: 'globalenv',
    props: ['GLOBAL_ENV']
  }
];

/* restrictiveByDefault explaination:
If true: Null all props in perms which have not been specified (exclusive)
If false: Null all props in perms which have been specified (inclusive)
*/

const box = (jsCode, perms = [], restrictiveByDefault = true) => {
  const toNull = permList.filter((x) => restrictiveByDefault ? !perms.includes(x.name) : perms.includes(x.name)).reduce((a, v) => a.concat(v.props), []);

  console.log(toNull);

  evalWrap(jsCode, toNull);
};

console.log(box(`
console.log(fetch, window.fetch, globalThis.fetch);
console.log(console); 'foobar'`, [ 'network' ]));