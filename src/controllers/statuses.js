const zelcoreStats = require('../services/zelcoreStats');
const log = require('../lib/log');

exports.statuses = (req, res, next) => {
  log.debug('Checkings Stats information from APIs');
  zelcoreStats.getAll().then((response) => {
    res.json(response);
  }).catch(next);
};
