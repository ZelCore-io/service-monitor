const stats = require('./services/zelcoreStats');
const wordpress = require('./services/wordpressStats');

module.exports = (app) => {
  app.get('/wordpress', (req, res) => {
    wordpress.infraStatuses(req, res);
  });
  app.get('*', (req, res) => {
    stats.infraStatuses(req, res);
  });
};
