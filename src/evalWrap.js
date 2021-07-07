const patcherCore = ['patch', 'inject', 'uninject'];

export default (jsCode, perms) => {
  const context = {};

  for (const k of Reflect.ownKeys(window)) {
    context[k] = null;
  }

  if (perms.includes('webpack')) context.Webpack = goosemod.webpackModules;
  if (perms.includes('patcher')) context.Patcher = patcherCore.reduce((acc, v) => { acc[v] = goosemod.patcher[v]; return acc; }, {});

  for (const key of Object.keys(goosemod.patcher).filter((x) => !patcherCore.includes(x))) {
    const permKey = key.replace(/[a-z][A-Z]/g, (_) => `${_[0]}-${_[1]}`); // contextMenu -> context-menu, username -> username
    if (!perms.includes(permKey)) continue;

    const globalKey = key[0].toUpperCase() + key.substring(1); // eg: contextMenu -> ContextMenu, username -> Username
    context[globalKey] = goosemod.patcher[key];
  }

  context.GooseBox = true;

  with (context) {
    return eval(jsCode);
  }
};