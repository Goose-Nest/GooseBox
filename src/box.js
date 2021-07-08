// let patcherCore = ['patch', 'inject', 'uninject'];


let box = (jsCode, perms) => {
  const context = {};

  for (const k of Reflect.ownKeys(window)) {
    context[k] = null;
  }

  // GM APIs
  if (perms.includes('patcher')) context.Patcher = patcherCore.reduce((acc, v) => { acc[v] = goosemod.patcher[v]; return acc; }, {});

  if (perms.includes('webpack')) {
    const blocklist = [
      ['token', [ // Getting token
        '_dispatchToken', '_orderedCallbackTokens', // Flux
        'DEVICE_TOKEN', 'DEVICE_VOIP_TOKEN', 'IS_SEARCH_FILTER_TOKEN', 'IS_SEARCH_ANSWER_TOKEN', 'SearchTokenTypes', 'TOKEN_REGEX', 'TOKEN_KEY', // Constants
      ]],

      ['login', [ // Login
        'LoginStates', 'LoginSuccessfulSources' // Constants
      ]],

      ['window', [ // Sandbox escape / privilege escalation
        'WindowsKeyToCode', 'PopoutWindowKeys' // Constants
      ]]
    ];


    const returnProxy = (ret) => {
      for (const block of blocklist) {
        if (Reflect.ownKeys(ret).some((x) => x.toLowerCase().includes(block[0]) && !block[1].includes(x))) {
          console.warn('[GooseBox]', 'detected access to dangerous Webpack module - blocked module', ret, block, Object.keys(ret).filter((x) => x.toLowerCase().includes(block[0]) && !block[1].includes(x)));

          return null;
        }
      }

      return ret;
    };

    let wp_req = undefined;

    const wp_init = () => {
      wp_req = window.webpackJsonp.push([[], {__extra_id__: (module, exports, req) => module.exports = req}, [["__extra_id__"]]]);
  
      delete wp_req.m.__extra_id__;
      delete wp_req.c.__extra_id__;
  
      wp_generateCommons();
    };

    const wp_generateCommons = () => {
      obj.common.React = obj.findByProps('createElement');
      obj.common.ReactDOM = obj.findByProps('render', 'hydrate');
  
      obj.common.Flux = obj.findByProps('Store', 'CachedStore', 'PersistedStore');
      obj.common.FluxDispatcher = obj.findByProps('_waitQueue', '_orderedActionHandlers');
  
      obj.common.i18n = obj.findByProps('Messages', '_requestedLocale');
  
      obj.common.channels = obj.findByProps('getSelectedChannelState', 'getChannelId');
      obj.common.constants = obj.findByProps('API_HOST', 'CaptchaTypes');
    };

    const obj = { // https://github.com/rauenzi/BetterDiscordApp/blob/master/src/modules/webpackModules.js
      find: (filter) => {
        for (const i in wp_req.c) {
          if (wp_req.c.hasOwnProperty(i)) {
              const m = wp_req.c[i].exports;
              if (m && m.__esModule && m.default && filter(m.default)) return returnProxy(m.default);
              if (m && filter(m))	return returnProxy(m);
          }
        }
    
        return null;
      },
    
      findAll: (filter) => {
        const modules = [];
        for (const i in wp_req.c) {
            if (wp_req.c.hasOwnProperty(i)) {
                const m = wp_req.c[i].exports;
                if (m && m.__esModule && m.default && filter(m.default)) modules.push(returnProxy(m.default));
                else if (m && filter(m)) modules.push(returnProxy(m));
            }
        }
        return modules;
      },
    
      findByProps: (...propNames) => obj.find(module => propNames.every(prop => module[prop] !== undefined)),
      findByPropsAll: (...propNames) => obj.findAll(module => propNames.every(prop => module[prop] !== undefined)),
    
      findByPrototypes: (...protoNames) => obj.find(module => module.prototype && protoNames.every(protoProp => module.prototype[protoProp] !== undefined)),
    
      findByDisplayName: (displayName) => obj.find(module => module.displayName === displayName),

      common: {}
    };

    wp_init();

    context.Webpack = obj;
  }

  if (perms.includes('settings')) context.Settings = goosemod.settings;
  if (perms.includes('toast')) context.Toast = goosemod.showToast;
  if (perms.includes('confirm-dialog')) context.ConfirmDialog = goosemod.confirmDialog;

  for (const key of Object.keys(goosemod.patcher).filter((x) => !patcherCore.includes(x))) {
    const permKey = key.replace(/[a-z][A-Z]/g, (_) => `${_[0]}-${_[1]}`); // contextMenu -> context-menu, username -> username
    if (!perms.includes(permKey)) continue;

    const globalKey = key[0].toUpperCase() + key.substring(1); // eg: contextMenu -> ContextMenu, username -> Username
    context[globalKey] = goosemod.patcher[key];
  }


  // Native APIs
  if (perms.includes('console')) context.console = console;

  context.GooseBox = true;
  context.eval = window.eval;

  with (context) {
    return eval(jsCode);
  }
};

let blockAssert = (out, expected = true) => { // expected: if expected to be blcoked
  if (out !== null && expected) {
    console.error('[GooseBox Test]', 'Block test failed (was not blocked, expected blocked)', out);
  } else if (out === null && !expected) {
    console.error('[GooseBox Test]', 'Block test failed (was blocked, expected not blocked)', out);
  } else {
    // console.log('[GooseBox Test] Passed block test');
  }
};

// Testing examples

// Check some GM APIs
box(`console.log(Webpack, Toast, Patcher)`, ['console', 'webpack', 'toast', 'patcher']);


// Webpack blocking

// Window (window, global scope) being blocked
blockAssert(box(`Webpack.findByProps('console')`, ['webpack']));

// Login / token being blocked
blockAssert(box(`Webpack.findByProps('loginToken')`, ['webpack']));