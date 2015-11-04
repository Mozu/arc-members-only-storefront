module.exports = {
  'enableOnInstall': {
      actionName: 'embedded.platform.applications.install',
      customFunction: require('./domains/platform.applications/enableOnInstall')
  }
};
