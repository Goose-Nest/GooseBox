const { readFileSync, writeFileSync } = require('fs');

let js = readFileSync(__dirname + '/src/index.js', 'utf8');

while (js.includes('require')) {
  js = js.replace(/require\(['"`](.*)['"`]\);?/g, (_, file) => {
    const fileJs = readFileSync(__dirname + '/src/' + file, 'utf8').replace('module.exports = ', '');

    return fileJs;
  });
}

console.log(js);

writeFileSync(__dirname + '/out.js', js);