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
console.log(fetch, window.fetch, globalThis.fetch);
console.log(console); 'foobar'`, [ 'network' ]));