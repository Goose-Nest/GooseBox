const evalWrap = require('./evalWrap.js');
const permList = require('./perms.js');

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
// Network - fetch
console.log('fetch', fetch, window.fetch, globalThis.fetch);
console.log('XMLHttpRequest', XMLHttpRequest, window.XMLHttpRequest, globalThis.XMLHttpRequest);

// DOM - document
console.log('document', document, window.document, globalThis.document);
console.log('Node', Node, window.Node, globalThis.Node);

// localstorage - localStorage
console.log('localStorage', localStorage, window.localStorage, globalThis.localStorage);

'foobar'`, [ ]));