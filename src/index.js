const evalWrap = require('./evalWrap.js');
const permList = require('./perms.js');

const box = (jsCode, perms = []) => {
  const toNull = permList.filter((x) => !perms.includes(x.name)).reduce((a, v) => a.concat(v.props), []);

  console.log(toNull);

  evalWrap(jsCode, toNull);
};

console.log(box(`
console.log(fetch, window.fetch, globalThis.fetch);
console.log(console); 'foobar'`, [ 'network' ]));