const stats = require('./services/zelcoreStats');

module.exports = (app) => {
  app.get('*', (req, res) => {
    stats.infraStatuses(req, res);
  });
};
