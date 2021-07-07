import evalWrap from './evalWrap';

import { multi } from './log';

if (typeof window === 'undefined') { // Running in Node.js testing
  multi('node detected:', 'filling global scope with fillers', 'cloning global scope as window');

  for (const p of permList.reduce((a, v) => a.concat(v.props), [])) {
    global[p] = 'filler';
  }

  global.window = global;
}

const box = (jsCode, perms = []) => {
  multi('boxing code:',
    `with perms: ${JSON.stringify(perms).replace(/,/g, ', ')}`);

  evalWrap(jsCode, perms);
};

console.log(box(`
console.log('GooseBox', GooseBox, window.GooseBox, globalThis.GooseBox);

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

console.log('bypass check 1', frame.ownerDocument.defaultView.localStorage, frame.ownerDocument.defaultView.fetch);

console.log('bypass check 2', frame.contentWindow.localStorage, frame.contentWindow.fetch);

'foobar'`, [ 'dom' ]));