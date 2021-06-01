const ae_replaceFunc = require('./solves/appendElement.js');
const ce_replaceFunc = require('./solves/appendElement.js');

const { log } = require('./log.js');

module.exports = (context) => {
  if (context.Node?.prototype?.appendChild) {
    log(`trying ee_replaceFunc`);

    context.Node.prototype.appendChild = ae_replaceFunc(context.Node.prototype.appendChild, stop);
    context.Node.prototype.append = ae_replaceFunc(context.Node.prototype.append, stop);
  } else {
    log(`not trying ee_replaceFunc (could not find Node.protoptype.appendChild)`);
  }
};