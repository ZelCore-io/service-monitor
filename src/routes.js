const apicache = require('apicache');
const stats = require('./controllers/statuses');

const cache = apicache.middleware;

module.exports = (app) => {
  app.get('/', cache('5 minutes'), stats.statuses);
};
