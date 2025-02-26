/* eslint-disable no-restricted-syntax */
/* eslint-disable no-await-in-loop */
const axios = require('axios');
const log = require('../lib/log');

async function getRequest(url) {
  const axiosConfig = {
    headers: {
      zelid: '1CbErtneaX2QVyUfwU7JGB7VzvPgrgc3uC',
      zelcore: 'ZelCore-v5.19.6',
    },
  };
  const response = await axios.get(url, axiosConfig);
  return response.data;
}

const statuses = {
  ok: [],
  errors: [],
};

function checkWordpress(i, name) {
  const response = i;
  if (response.includes('wp-content')) {
    return true;
  }
  throw new Error(`checkWordpress ${name}`);
}

const checks = [];

async function checkServices() {
  try {
    const wps = [];
    const response = await getRequest('https://api.runonflux.io/apps/globalappsspecifications');
    const wordpresses = response.data.filter((app) => app.name.startsWith('wordpress1'));
    // eslint-disable-next-line no-restricted-syntax
    for (const wordpress of wordpresses) {
      wps.push({
        name: `https://${wordpress.name}_${wordpress.compose[0].ports[0]}.app.runonflux.io`,
        type: 'wordpress',
        urls: [`https://${wordpress.name}_${wordpress.compose[0].ports[0]}.app.runonflux.io`],
      });
      if (wordpress.compose[0].domains[0]) {
        wps.push({
          name: wordpress.compose[0].domains[0].includes('http') ? wordpress.compose[0].domains[0] : `https://${wordpress.compose[0].domains[0]}`,
          type: 'wordpress',
          urls: [wordpress.compose[0].domains[0].includes('http') ? wordpress.compose[0].domains[0] : `https://${wordpress.compose[0].domains[0]}`],
        });
      }
    }
    console.log(wps);
    wps.forEach((wp) => {
      checks.push(wp);
    });
  } catch (error) {
    console.log(error);
  }
  for (const check of checks) {
    try {
      if (check.type === 'wordpress') { // must have 1 domain
        const responseA = await getRequest(check.urls[0]);
        checkWordpress(responseA, check.name);
      }

      if (!statuses.ok.includes(check.name)) {
        statuses.ok.push(check.name);
      }
      if (statuses.errors.includes(check.name)) {
        const index = statuses.errors.findIndex((item) => item === check.name);
        statuses.errors.splice(index, 1);
      }
    } catch (error) {
      log.error(error);
      if (!statuses.errors.includes(check.name)) {
        statuses.errors.push(check.name);
      }
      if (statuses.ok.includes(check.name)) {
        const index = statuses.ok.findIndex((item) => item === check.name);
        statuses.ok.splice(index, 1);
      }
    }
  }
  setTimeout(() => {
    checkServices();
  }, 30 * 1000);
}

checkServices();

function infraStatuses(req, res) {
  res.json(statuses);
}

module.exports = {
  infraStatuses,
};
