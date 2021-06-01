module.exports = (originalFunc) => ((...elements) => {
  originalFunc.apply(this, elements);
});