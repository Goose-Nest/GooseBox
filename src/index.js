const evalWrap = require('./evalWrap.js');
const permList = require('./perms/index.js');

const { log, multi } = require('./log.js');

if (typeof window === 'undefined') { // Running in Node.js testing
  multi('node detected:', 'filling global scope with fillers', 'cloning global scope as window');

  for (const p of permList.reduce((a, v) => a.concat(v.props), [])) {
    global[p] = 'filler';
  }

  global.window = global;
}

/* restrictiveByDefault explaination:
If true: Null all props in perms which have not been specified (exclusive)
If false: Null all props in perms which have been specified (inclusive)
*/

const box = (jsCode, perms = [], restrictiveByDefault = true) => {
  const toNull = permList.filter((x) => restrictiveByDefault ? !perms.includes(x.name) : perms.includes(x.name)).reduce((a, v) => a.concat(v.props), []);

  multi('boxing code:',
    `with perms: ${JSON.stringify(perms).replace(/,/g, ', ')}`,
    `restrictiveByDefault: ${restrictiveByDefault}`,
    ``,
    `global kill props: ${JSON.stringify(toNull).replace(/,/g, ', ')}`);

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

const frame = document.createElement('frame');
frame.src = 'about:blank';

document.body.appendChild(frame);

console.log('bypass check', frame.contentWindow.localStorage, frame.contentWindow.fetch);

'foobar'`, [ 'dom' ]));