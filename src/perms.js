module.exports = [
  {
    name: 'network',
    props: ['fetch', 'XMLHttpRequest']
  },

  {
    name: 'dom',
    props: ['document']
  },

  {
    name: 'localstorage',
    props: ['localStorage']
  },

  /* Discord / some sites specific */
  {
    name: 'sentry',
    props: ['__SENTRY__', 'DiscordSentry']
  },

  {
    name: 'discordnative',
    props: ['DiscordNative']
  },

  {
    name: 'globalenv',
    props: ['GLOBAL_ENV']
  }
];