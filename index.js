const {
  config: authentication,
  befores = [],
  afters = [],
} = require('./authentication');
const updateGoal = require('./creates/update_goal');
const updateColor = require('./creates/update_color');
const updateProgress = require('./creates/update_progress');
const addProgress = require('./creates/add_progress');
const adjustProgress=require('./creates/adjust_progress.js')
const meters = require('./triggers/meters');
module.exports = {
  // This is just shorthand to reference the installed dependencies you have.
  // Zapier will need to know these before we can upload.
  version: require('./package.json').version,
  platformVersion: require('zapier-platform-core').version,

  authentication,

  beforeRequest: [...befores],

  afterResponse: [...afters],

  // If you want your trigger to show up, you better include it here!
  triggers: {
    [meters.key]: meters
  },

  // If you want your searches to show up, you better include it here!
  searches: {},

  // If you want your creates to show up, you better include it here!
  creates: {
    [updateGoal.key]: updateGoal,
    [updateProgress.key]: updateProgress,
    [updateColor.key]: updateColor,
    [addProgress.key]: addProgress,
    [adjustProgress.key]:adjustProgress
  },

  resources: {},
};
