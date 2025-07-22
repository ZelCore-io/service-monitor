/* eslint-disable no-restricted-syntax */
/* eslint-disable no-await-in-loop */
const axios = require('axios');
const https = require('https');
const util = require('util');
const execShell = util.promisify(require('child_process').exec);
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

async function getRequestNoCert(url) {
  const agent = new https.Agent({
    rejectUnauthorized: false,
  });

  const axiosConfig = {
    headers: {
      zelid: '1CbErtneaX2QVyUfwU7JGB7VzvPgrgc3uC',
      zelcore: 'ZelCore-v5.19.6',
    },
    httpsAgent: agent,
  };
  const response = await axios.get(url, axiosConfig);
  return response.data;
}

async function postRequest(url, data) {
  const axiosConfig = {
    headers: {
      zelid: '1CbErtneaX2QVyUfwU7JGB7VzvPgrgc3uC',
      zelcore: 'ZelCore-v5.19.6',
    },
  };
  const response = await axios.post(url, data, axiosConfig);
  return response.data;
}

// async function getStatusCode(url) {
//   const axiosConfig = {
//     headers: {
//       zelid: '1CbErtneaX2QVyUfwU7JGB7VzvPgrgc3uC',
//       zelcore: 'ZelCore-v5.19.6',
//     },
//   };
//   const response = await axios.get(url, axiosConfig);
//   return response.status;
// }

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

function checkInsight(i, j, name) {
  if (i.transactions.length > 0 && j.status === 'finished') {
    return true;
  }
  throw new Error(`checkInsight ${name}`);
}

function checkInsightProxy(i, j, name) { // tests proxy blockbook - insight
  if (Array.isArray(i) && i.length >= 1 && j.info.blocks > 722564) {
    return true;
  }
  throw new Error(`checkInsightProxy ${name}`);
}

async function extendedInsightTest(url, blockUlr, txUrl, name) {
  const response = await getRequest(url);
  const blockUrlAdjusted = blockUlr + response.blocks[0].hash;
  const responseB = await getRequest(blockUrlAdjusted);
  const { txid } = responseB.txs[0];
  const adjustedUrlTx = txUrl + txid;
  const responseC = await getRequest(adjustedUrlTx);
  if (responseC.confirmations < -2) {
    throw new Error(`checkExtendedInsight ${name}`);
  }
  return true;
}

function checkBlockBook(i, j, name) {
  if (i.txids.length > 0 && j.blockbook.inSync === true && j.blockbook.bestHeight > (j.backend.blocks - 100)) {
    return true;
  }
  throw new Error(`checkBlockBook ${name}`);
}

function checkElectrumx(i, name) {
  if (i.length > 0) {
    return true;
  }
  throw new Error(`checkElectrumx ${name}`);
}

function checkVeriblockBalance(i, name) {
  const confirmedObject = i.result.confirmed.find((a) => a.address === 'V5h6udgGe6eL4M9cYGi776WCP75URm');
  const confirmedBal = confirmedObject.unlockedAmount;
  if (+confirmedBal > 500000) {
    return true;
  }
  throw new Error(`checkVeriblockBalance ${name}`);
}

function checkEthBalance(i, name) {
  const balOK = i.result.startsWith('0x');
  if (balOK && i.result.length > 4) {
    return true;
  }
  throw new Error(`checkEthBalance ${name}`);
}

function checkZelCorePlus(i, name) {
  if (i.validTill === 1760388896000) {
    return true;
  }
  throw new Error(`checkZelCorePlus ${name}`);
}

function checkRates(i, name) {
  if (Object.keys(i[2].errors).length === 0) {
    return true;
  }
  throw new Error(`checkRates ${name}`);
}

function checkMarkets(i, name) {
  if (Object.keys(i[1].errors).length === 0) {
    return true;
  }
  throw new Error(`checkMarkets ${name}`);
}

function checkSubstrate(i, name) {
  const { specVersion } = i.result;
  if (specVersion > 0 && typeof specVersion === 'number') {
    return true;
  }
  throw new Error(`checkSubstrate ${name}`);
}

function checkCardano(i, j, name) {
  const cardanoBalance = i.amount.find((amnt) => amnt.unit === 'lovelace');
  const txs = j;
  if (txs.length > 2 && cardanoBalance && +cardanoBalance.quantity > 0) {
    return true;
  }
  throw new Error(`checkCardano ${name}`);
}

function checkErgo(i, name) {
  const { boxes } = i.data;
  if (boxes[0].value > 100) {
    return true;
  }
  throw new Error(`checkErgo ${name}`);
}

function checkABE(i, j, name) {
  const history = i.data;
  const statusA = i.status;
  if (history.length < 420) {
    throw new Error(`checkABE ${name}`);
  }
  if (statusA !== 'success') {
    throw new Error(`checkABE ${name}`);
  }
  const sellassets = j.data;
  const { status } = j;
  if (sellassets.length > 100 && status === 'success') {
    return true;
  }
  throw new Error(`checkABE ${name}`);
}

function checkStats(i, name) {
  const response = i;
  if (response.data.length > 500) {
    return true;
  }
  throw new Error(`checkStats ${name}`);
}

function checkHashes(i, name) {
  const response = i;
  if (response.length >= 1) {
    return true;
  }
  throw new Error(`checkHashes ${name}`);
}

function checkFees(i, name) {
  const response = i;
  if (response.length > 30) {
    return true;
  }
  throw new Error(`checkFees ${name}`);
}

function checkFDM(i, name) {
  const response = i;
  const position = response.search('<b>uptime = </b>');
  const substr = response.substr(position, 40);
  const hPosition = substr.search('h');
  const timePosition = hPosition - 1;
  const numberOfHours = substr[timePosition];
  if (numberOfHours === '0' || numberOfHours === '1') {
    return true;
  }
  throw new Error(`checkFDM ${name}`);
}

function checkFusion(i, j, name) {
  if (i.status === 'success' && j.status === 'success') {
    return true;
  }
  throw new Error(`checkFees ${name}`);
}

// KADENA
function kadenaCheckHeight(height, ip) {
  // console.log(height);
  const currentTime = new Date().getTime();
  const baseTime = 1751604558000;
  const baseHeight = 119411967;
  const timeDifference = currentTime - baseTime;
  const blocksPassedInDifference = (timeDifference / 30000) * 20; // 20 chains with blocktime 30 seconds
  const currentBlockEstimation = baseHeight + blocksPassedInDifference;
  const minimumAcceptedBlockHeight = currentBlockEstimation - (5000); // allow being off sync for this amount of blocks
  if (height > minimumAcceptedBlockHeight) {
    return true;
  }
  log.info(`${ip}: ${height}, min is: ${minimumAcceptedBlockHeight}`);
  return false;
}

function kadenaCheckPeers(peers) {
  try {
    const goodPeers = peers.filter((peer) => peer.address.hostname.includes('chainweb')); // has outside of flux too
    if (goodPeers.length > 1) { // at least 2 chainweb peers
      return true;
    }
    const goodPeersPort = peers.filter((peer) => peer.address.port !== 31350); // has outside of flux too
    if (goodPeersPort.length > 4) { // at least 5 different than flux peers
      return true;
    }
    return false;
  } catch (error) {
    log.error(error);
    return true;
  }
}
async function kadenaGetHeight(domain) {
  try {
    const { CancelToken } = axios;
    const source = CancelToken.source();
    let isResolved = false;
    setTimeout(() => {
      if (!isResolved) {
        source.cancel('Operation canceled by the user.');
      }
    }, 25000 * 2);
    const kadenaData = await axios.get(`${domain}/chainweb/0.0/mainnet01/cut`, { timeout: 25000, cancelToken: source.token });
    isResolved = true;
    return kadenaData.data.height;
  } catch (e) {
    log.error(e);
    return -1;
  }
}

async function kadenaGetConenctions(domain) {
  try {
    const { CancelToken } = axios;
    const source = CancelToken.source();
    let isResolved = false;
    setTimeout(() => {
      if (!isResolved) {
        source.cancel('Operation canceled by the user.');
      }
    }, 15000 * 2);
    const kadenaData = await axios.get(`${domain}/chainweb/0.0/mainnet01/cut/peer`, { timeout: 15000, cancelToken: source.token });
    isResolved = true;
    return kadenaData.data.items;
  } catch (e) {
    log.error(e);
    return [];
  }
}

async function checkKadenaApplication(ip) {
  try {
    const height = await kadenaGetHeight(ip);
    if (kadenaCheckHeight(height, ip)) {
      // eslint-disable-next-line no-await-in-loop
      const peers = await kadenaGetConenctions(ip);
      if (kadenaCheckPeers(peers)) {
        return true;
      }
    }
    return false;
  } catch (error) {
    log.error(error);
    return false;
  }
}

// KADENA CHAINWEB DATA
async function kadenaRecentTxs(domain) {
  try {
    const { CancelToken } = axios;
    const source = CancelToken.source();
    let isResolved = false;
    setTimeout(() => {
      if (!isResolved) {
        source.cancel('Operation canceled by the user.');
      }
    }, 15000 * 2);
    const kadenaData = await axios.get(`${domain}/txs/recent`, { timeout: 15000, cancelToken: source.token });
    isResolved = true;
    return kadenaData.data;
  } catch (e) {
    log.error(e);
    return [];
  }
}

async function kadenaSearchTxs(domain) {
  try {
    const { CancelToken } = axios;
    const source = CancelToken.source();
    let isResolved = false;
    setTimeout(() => {
      if (!isResolved) {
        source.cancel('Operation canceled by the user.');
      }
    }, 15000 * 2);
    const kadenaData = await axios.get(`${domain}/txs/account/fluxswap?token=runonflux.flux`, { timeout: 15000, cancelToken: source.token });
    isResolved = true;
    return kadenaData.data;
  } catch (e) {
    log.error(e);
    return [];
  }
}

async function kadenaSearchTxsB(domain) {
  try {
    const { CancelToken } = axios;
    const source = CancelToken.source();
    let isResolved = false;
    setTimeout(() => {
      if (!isResolved) {
        source.cancel('Operation canceled by the user.');
      }
    }, 12000 * 2);
    const kadenaData = await axios.get(`${domain}/txs/account/fluxteam?limit=200000&token=coin`, { timeout: 11000, cancelToken: source.token });
    isResolved = true;
    return kadenaData.data;
  } catch (e) {
    // log.error(e);
    return [];
  }
}

async function checkKadenaDataApplication(domain) {
  try {
    const currentTime = new Date().getTime();
    const searchTxs = await kadenaRecentTxs(domain);
    const lastTx = new Date(searchTxs[0].creationTime);
    const lastTimeTx = lastTx.getTime();
    const diffTen = 10 * 24 * 60 * 60 * 1000;
    if (currentTime - diffTen < lastTimeTx) {
      const searchTxsB = await kadenaSearchTxsB(domain);
      if (searchTxsB.length < 229) {
        return false;
      }
      const searchTxsAcc = await kadenaSearchTxs(domain);
      const lastTxB = new Date(searchTxsAcc[0].blockTime);
      const lastTimeTxB = lastTxB.getTime();
      if (currentTime - diffTen < lastTimeTxB) {
        return true;
      }
      return false;
    }
    return false;
  } catch (error) {
    return false;
  }
}

async function checkKadenaTxsApp(domain) {
  try {
    const { CancelToken } = axios;
    const source = CancelToken.source();
    let isResolved = false;
    setTimeout(() => {
      if (!isResolved) {
        source.cancel('Operation canceled by the user.');
      }
    }, 12000 * 2);
    const kadenaData = await axios.get(`${domain}/v1/txs/fluxteam/coin/2050`, { timeout: 11000, cancelToken: source.token });
    isResolved = true;
    if (kadenaData.data.length > 200) {
      return true;
    }
    return false;
  } catch (error) {
    return false;
  }
}
async function checkKDA(i, name) {
  const chainwebNode = await checkKadenaApplication(i);
  if (chainwebNode === true) {
    return true;
  }
  throw new Error(`checkKDA ${name}`);
}

async function checkKDAData(i, name) {
  const chainwebData = await checkKadenaDataApplication(i);
  if (chainwebData === true) {
    return true;
  }
  throw new Error(`checkKDAData ${name}`);
}

async function checkKDATxs(i, name) {
  const chainwebData = await checkKadenaTxsApp(i);
  if (chainwebData === true) {
    return true;
  }
  throw new Error(`checkKDAData ${name}`);
}

async function checkFluxStorage(i, name) {
  try {
    await axios.get(i);
    throw new Error(`checkFluxStorage ${name}`);
  } catch (error) {
    log.error(error);
    log.error(error.response);
    log.error(error.response.status);
    log.error(error.response.statusText);
    log.error(error.response.data);
    if (error.response.data === 'Forbidden') {
      return true;
    }
    throw new Error(`checkFluxStorage ${name}`);
  }
}

async function checkSimplex(i, name) {
  try {
    const exec = `sh ~/service-monitor/src/services/simplex-check_script.sh ${i}`;
    const cmdres = await execShell(exec, { maxBuffer: 1024 * 1024 * 10 });
    const parsed = cmdres.stdout;
    if (parsed.includes('pass')) {
      return true;
    }
    throw new Error(`checkSimplex ${name}`);
  } catch (error) {
    throw new Error(`checkSimplex ${name}`);
  }
}

const checks = [
  {
    name: 'explorer.runonflux.io',
    type: 'insight',
    urls: ['https://explorer.runonflux.io/api/addr/t3c51GjrkUg7pUiS8bzNdTnW2hD25egWUih', 'https://explorer.runonflux.io/api/sync'],
  },
  {
    name: 'explorer1.runonflux.io',
    type: 'insight',
    urls: ['https://explorer1.runonflux.io/api/addr/t3c51GjrkUg7pUiS8bzNdTnW2hD25egWUih', 'https://explorer1.runonflux.io/api/sync'],
  },
  {
    name: 'explorer2.runonflux.io',
    type: 'insight',
    urls: ['https://explorer2.runonflux.io/api/addr/t3c51GjrkUg7pUiS8bzNdTnW2hD25egWUih', 'https://explorer2.runonflux.io/api/sync'],
  },
  {
    name: 'explorer2.flux.zelcore.io',
    type: 'insight',
    urls: ['https://explorer2.flux.zelcore.io/api/addr/t3c51GjrkUg7pUiS8bzNdTnW2hD25egWUih', 'https://explorer2.flux.zelcore.io/api/sync'],
  },
  {
    name: 'explorer1.flux.zelcore.io',
    type: 'insight',
    urls: ['https://explorer1.flux.zelcore.io/api/addr/t3c51GjrkUg7pUiS8bzNdTnW2hD25egWUih', 'https://explorer1.flux.zelcore.io/api/sync'],
  },
  {
    name: 'explorer.flux.zelcore.io',
    type: 'insight',
    urls: ['https://explorer.flux.zelcore.io/api/addr/t3c51GjrkUg7pUiS8bzNdTnW2hD25egWUih', 'https://explorer.flux.zelcore.io/api/sync'],
  },
  {
    name: 'explorer.flux-1.zelcore.io',
    type: 'insight',
    urls: ['https://explorer.flux-1.zelcore.io/api/addr/t3c51GjrkUg7pUiS8bzNdTnW2hD25egWUih', 'https://explorer.flux-1.zelcore.io/api/sync'],
  },
  {
    name: 'explorer.flux-2.zelcore.io',
    type: 'insight',
    urls: ['https://explorer.flux-2.zelcore.io/api/addr/t3c51GjrkUg7pUiS8bzNdTnW2hD25egWUih', 'https://explorer.flux-2.zelcore.io/api/sync'],
  },
  {
    name: 'explorer.flux-3.zelcore.io',
    type: 'insight',
    urls: ['https://explorer.flux-3.zelcore.io/api/addr/t3c51GjrkUg7pUiS8bzNdTnW2hD25egWUih', 'https://explorer.flux-3.zelcore.io/api/sync'],
  },
  {
    name: 'explorer.flux-4.zelcore.io',
    type: 'insight',
    urls: ['https://explorer.flux-4.zelcore.io/api/addr/t3c51GjrkUg7pUiS8bzNdTnW2hD25egWUih', 'https://explorer.flux-4.zelcore.io/api/sync'],
  },
  {
    name: 'explorer.flux-5.zelcore.io',
    type: 'insight',
    urls: ['https://explorer.flux-5.zelcore.io/api/addr/t3c51GjrkUg7pUiS8bzNdTnW2hD25egWUih', 'https://explorer.flux-5.zelcore.io/api/sync'],
  },
  {
    name: 'explorer.flux-6.zelcore.io',
    type: 'insight',
    urls: ['https://explorer.flux-6.zelcore.io/api/addr/t3c51GjrkUg7pUiS8bzNdTnW2hD25egWUih', 'https://explorer.flux-6.zelcore.io/api/sync'],
  },
  {
    name: 'explorer.flux-1.zelcore.io-ext',
    type: 'extendedInsight',
    urls: ['https://explorer.flux-1.zelcore.io/api/blocks?limit=1', 'https://explorer.flux-1.zelcore.io/api/txs/?block=', 'https://explorer.flux-1.zelcore.io/api/tx/'],
  },
  {
    name: 'explorer.flux-2.zelcore.io-ext',
    type: 'extendedInsight',
    urls: ['https://explorer.flux-2.zelcore.io/api/blocks?limit=1', 'https://explorer.flux-2.zelcore.io/api/txs/?block=', 'https://explorer.flux-2.zelcore.io/api/tx/'],
  },
  {
    name: 'explorer.flux-3.zelcore.io-ext',
    type: 'extendedInsight',
    urls: ['https://explorer.flux-3.zelcore.io/api/blocks?limit=1', 'https://explorer.flux-3.zelcore.io/api/txs/?block=', 'https://explorer.flux-3.zelcore.io/api/tx/'],
  },
  {
    name: 'explorer.flux-4.zelcore.io-ext',
    type: 'extendedInsight',
    urls: ['https://explorer.flux-4.zelcore.io/api/blocks?limit=1', 'https://explorer.flux-4.zelcore.io/api/txs/?block=', 'https://explorer.flux-4.zelcore.io/api/tx/'],
  },
  {
    name: 'explorer.flux-5.zelcore.io-ext',
    type: 'extendedInsight',
    urls: ['https://explorer.flux-5.zelcore.io/api/blocks?limit=1', 'https://explorer.flux-5.zelcore.io/api/txs/?block=', 'https://explorer.flux-5.zelcore.io/api/tx/'],
  },
  {
    name: 'explorer.flux-6.zelcore.io-ext',
    type: 'extendedInsight',
    urls: ['https://explorer.flux-6.zelcore.io/api/blocks?limit=1', 'https://explorer.flux-6.zelcore.io/api/txs/?block=', 'https://explorer.flux-6.zelcore.io/api/tx/'],
  },
  {
    name: 'explorer1.flux.zelcore.io-ext',
    type: 'extendedInsight',
    urls: ['https://explorer1.flux.zelcore.io/api/blocks?limit=1', 'https://explorer1.flux.zelcore.io/api/txs/?block=', 'https://explorer1.flux.zelcore.io/api/tx/'],
  },
  {
    name: 'explorer2.flux.zelcore.io-ext',
    type: 'extendedInsight',
    urls: ['https://explorer2.flux.zelcore.io/api/blocks?limit=1', 'https://explorer2.flux.zelcore.io/api/txs/?block=', 'https://explorer2.flux.zelcore.io/api/tx/'],
  },
  {
    name: 'explorer.anon.zelcore.io',
    type: 'insight',
    urls: ['https://explorer.anon.zelcore.io/api/addr/AnY5LGSDdUgawBW8TQuFL1fJeTbswo65xeK', 'https://explorer.anon.zelcore.io/api/sync'],
  },
  {
    name: 'explorer.anon-1.zelcore.io',
    type: 'insight',
    urls: ['https://explorer.anon-1.zelcore.io/api/addr/AnY5LGSDdUgawBW8TQuFL1fJeTbswo65xeK', 'https://explorer.anon-1.zelcore.io/api/sync'],
  },
  {
    name: 'explorer.anon-2.zelcore.io',
    type: 'insight',
    urls: ['https://explorer.anon-2.zelcore.io/api/addr/AnY5LGSDdUgawBW8TQuFL1fJeTbswo65xeK', 'https://explorer.anon-2.zelcore.io/api/sync'],
  },
  {
    name: 'explorer.firo.zelcore.io',
    type: 'insight',
    urls: ['https://explorer.firo.zelcore.io/api/addr/aBEJgEP2b7DP7tyQukv639qtdhjFhWp2QE', 'https://explorer.firo.zelcore.io/api/sync'],
  },
  {
    name: 'explorer.firo-1.zelcore.io',
    type: 'insight',
    urls: ['https://explorer.firo-1.zelcore.io/api/addr/aBEJgEP2b7DP7tyQukv639qtdhjFhWp2QE', 'https://explorer.firo-1.zelcore.io/api/sync'],
  },
  {
    name: 'explorer.firo-2.zelcore.io',
    type: 'insight',
    urls: ['https://explorer.firo-2.zelcore.io/api/addr/aBEJgEP2b7DP7tyQukv639qtdhjFhWp2QE', 'https://explorer.firo-2.zelcore.io/api/sync'],
  },
  {
    name: 'explorer.btcz.zelcore.io',
    type: 'insight',
    urls: ['https://explorer.btcz.zelcore.io/api/addr/t1UPSwfMYLe18ezbCqnR5QgdJGznzCUYHkj', 'https://explorer.btcz.zelcore.io/api/sync'],
  },
  {
    name: 'explorer.btcz-1.zelcore.io',
    type: 'insight',
    urls: ['https://explorer.btcz-1.zelcore.io/api/addr/t1UPSwfMYLe18ezbCqnR5QgdJGznzCUYHkj', 'https://explorer.btcz-1.zelcore.io/api/sync'],
  },
  {
    name: 'explorer.btcz-2.zelcore.io',
    type: 'insight',
    urls: ['https://explorer.btcz-2.zelcore.io/api/addr/t1UPSwfMYLe18ezbCqnR5QgdJGznzCUYHkj', 'https://explorer.btcz-2.zelcore.io/api/sync'],
  },
  {
    name: 'explorer.zer.zelcore.io',
    type: 'insight',
    urls: ['https://explorer.zer.zelcore.io/api/addr/t1UPSwfMYLe18ezbCqnR5QgdJGznzCUYHkj', 'https://explorer.zer.zelcore.io/api/sync'],
  },
  {
    name: 'explorer.zer-1.zelcore.io',
    type: 'insight',
    urls: ['https://explorer.zer-1.zelcore.io/api/addr/t1UPSwfMYLe18ezbCqnR5QgdJGznzCUYHkj', 'https://explorer.zer-1.zelcore.io/api/sync'],
  },
  {
    name: 'explorer.zer-2.zelcore.io',
    type: 'insight',
    urls: ['https://explorer.zer-2.zelcore.io/api/addr/t1UPSwfMYLe18ezbCqnR5QgdJGznzCUYHkj', 'https://explorer.zer-2.zelcore.io/api/sync'],
  },
  {
    name: 'explorer.kmd.zelcore.io',
    type: 'insight',
    urls: ['https://explorer.kmd.zelcore.io/api/addr/RKo31qpgy9278MuWNXb5NPranc4W6oaUFf', 'https://explorer.kmd.zelcore.io/api/sync'],
  },
  {
    name: 'explorer.kmd-1.zelcore.io',
    type: 'insight',
    urls: ['https://explorer.kmd-1.zelcore.io/api/addr/RKo31qpgy9278MuWNXb5NPranc4W6oaUFf', 'https://explorer.kmd-1.zelcore.io/api/sync'],
  },
  {
    name: 'explorer.kmd-2.zelcore.io',
    type: 'insight',
    urls: ['https://explorer.kmd-2.zelcore.io/api/addr/RKo31qpgy9278MuWNXb5NPranc4W6oaUFf', 'https://explorer.kmd-2.zelcore.io/api/sync'],
  },
  {
    name: 'explorer.rvn.zelcore.io',
    type: 'insight',
    urls: ['https://explorer.rvn.zelcore.io/api/addr/RKo31qpgy9278MuWNXb5NPranc4W6oaUFf', 'https://explorer.rvn.zelcore.io/api/sync'],
  },
  {
    name: 'explorer.rvn-1.zelcore.io',
    type: 'insight',
    urls: ['https://explorer.rvn-1.zelcore.io/api/addr/RKo31qpgy9278MuWNXb5NPranc4W6oaUFf', 'https://explorer.rvn-1.zelcore.io/api/sync'],
  },
  {
    name: 'explorer.rvn-2.zelcore.io',
    type: 'insight',
    urls: ['https://explorer.rvn-2.zelcore.io/api/addr/RKo31qpgy9278MuWNXb5NPranc4W6oaUFf', 'https://explorer.rvn-2.zelcore.io/api/sync'],
  },
  {
    name: 'explorer.zcl.zelcore.io',
    type: 'insight',
    urls: ['https://explorer.zcl.zelcore.io/api/addr/t1UPSwfMYLe18ezbCqnR5QgdJGznzCUYHkj', 'https://explorer.zcl.zelcore.io/api/sync'],
  },
  {
    name: 'explorer.zcl-1.zelcore.io',
    type: 'insight',
    urls: ['https://explorer.zcl-1.zelcore.io/api/addr/t1UPSwfMYLe18ezbCqnR5QgdJGznzCUYHkj', 'https://explorer.zcl-1.zelcore.io/api/sync'],
  },
  {
    name: 'explorer.zcl-2.zelcore.io',
    type: 'insight',
    urls: ['https://explorer.zcl-2.zelcore.io/api/addr/t1UPSwfMYLe18ezbCqnR5QgdJGznzCUYHkj', 'https://explorer.zcl-2.zelcore.io/api/sync'],
  },
  {
    name: 'explorer.btc.zelcore.io',
    type: 'checkInsightProxy',
    urls: ['https://explorer.btc.zelcore.io/api/addr/12ib7dApVFvg82TXKycWBNpN8kFyiAN1dr/utxo', 'https://explorer.btc.zelcore.io/api/status'],
  },
  {
    name: 'explorer.btc-1.zelcore.io',
    type: 'checkInsightProxy',
    urls: ['https://explorer.btc-1.zelcore.io/api/addr/12ib7dApVFvg82TXKycWBNpN8kFyiAN1dr/utxo', 'https://explorer.btc-1.zelcore.io/api/status'],
  },
  {
    name: 'explorer.btc-2.zelcore.io',
    type: 'checkInsightProxy',
    urls: ['https://explorer.btc-2.zelcore.io/api/addr/12ib7dApVFvg82TXKycWBNpN8kFyiAN1dr/utxo', 'https://explorer.btc-2.zelcore.io/api/status'],
  },
  {
    name: 'explorer.zec.zelcore.io',
    type: 'checkInsightProxy',
    urls: ['https://explorer.zec.zelcore.io/api/addr/t1fPaaF5w8pRnvrRBb9VUaFLt1qma2PZCQS/utxo', 'https://explorer.zec.zelcore.io/api/status'],
  },
  {
    name: 'explorer.zec-1.zelcore.io',
    type: 'checkInsightProxy',
    urls: ['https://explorer.zec-1.zelcore.io/api/addr/t1fPaaF5w8pRnvrRBb9VUaFLt1qma2PZCQS/utxo', 'https://explorer.zec-1.zelcore.io/api/status'],
  },
  {
    name: 'explorer.zec-2.zelcore.io',
    type: 'checkInsightProxy',
    urls: ['https://explorer.zec-2.zelcore.io/api/addr/t1fPaaF5w8pRnvrRBb9VUaFLt1qma2PZCQS/utxo', 'https://explorer.zec-2.zelcore.io/api/status'],
  },
  {
    name: 'explorer.axe.zelcore.io',
    type: 'insight',
    urls: ['https://explorer.axe.zelcore.io/api/addr/PK726JLFREhj3CD5FRvUwmVee5mnX7g4ia', 'https://explorer.axe.zelcore.io/api/sync'],
  },
  {
    name: 'explorer.axe-1.zelcore.io',
    type: 'insight',
    urls: ['https://explorer.axe-1.zelcore.io/api/addr/PK726JLFREhj3CD5FRvUwmVee5mnX7g4ia', 'https://explorer.axe-1.zelcore.io/api/sync'],
  },
  {
    name: 'explorer.axe-2.zelcore.io',
    type: 'insight',
    urls: ['https://explorer.axe-2.zelcore.io/api/addr/PK726JLFREhj3CD5FRvUwmVee5mnX7g4ia', 'https://explorer.axe-2.zelcore.io/api/sync'],
  },
  {
    name: 'blockbook.runonflux.io',
    type: 'blockbook',
    urls: ['https://blockbook.runonflux.io/api/v2/address/t1UPSwfMYLe18ezbCqnR5QgdJGznzCUYHkj?pageSize=50', 'https://blockbook.runonflux.io/api/sync'],
  },
  {
    name: 'blockbook1.runonflux.io',
    type: 'blockbook',
    urls: ['https://blockbook1.runonflux.io/api/v2/address/t1UPSwfMYLe18ezbCqnR5QgdJGznzCUYHkj?pageSize=50', 'https://blockbook1.runonflux.io/api/sync'],
  },
  {
    name: 'blockbook2.runonflux.io',
    type: 'blockbook',
    urls: ['https://blockbook2.runonflux.io/api/v2/address/t1UPSwfMYLe18ezbCqnR5QgdJGznzCUYHkj?pageSize=50', 'https://blockbook2.runonflux.io/api/sync'],
  },
  {
    name: 'blockbook.etc.zelcore.io',
    type: 'blockbook',
    urls: ['https://blockbook.etc.zelcore.io/api/v2/address/0x0e009d19cb4693fcf2d15aaf4a5ee1c8a0bb5ecf?pageSize=50', 'https://blockbook.etc.zelcore.io/api/sync'],
  },
  {
    name: 'blockbook.etc-1.zelcore.io',
    type: 'blockbook',
    urls: ['https://blockbook.etc-1.zelcore.io/api/v2/address/0x0e009d19cb4693fcf2d15aaf4a5ee1c8a0bb5ecf?pageSize=50', 'https://blockbook.etc-1.zelcore.io/api/sync'],
  },
  {
    name: 'blockbook.etc-2.zelcore.io',
    type: 'blockbook',
    urls: ['https://blockbook.etc-2.zelcore.io/api/v2/address/0x0e009d19cb4693fcf2d15aaf4a5ee1c8a0bb5ecf?pageSize=50', 'https://blockbook.etc-2.zelcore.io/api/sync'],
  },
  {
    name: 'blockbook.btc.zelcore.io',
    type: 'blockbook',
    urls: ['https://blockbook.btc.zelcore.io/api/v2/address/1BWqwKwQNKDY4MYJuMbxGsXP2LbuNGzQ4m?pageSize=50', 'https://blockbook.btc.zelcore.io/api/sync'],
  },
  {
    name: 'blockbook.btc-1.zelcore.io',
    type: 'blockbook',
    urls: ['https://blockbook.btc-1.zelcore.io/api/v2/address/1BWqwKwQNKDY4MYJuMbxGsXP2LbuNGzQ4m?pageSize=50', 'https://blockbook.btc-1.zelcore.io/api/sync'],
  },
  {
    name: 'blockbook.btc-2.zelcore.io',
    type: 'blockbook',
    urls: ['https://blockbook.btc-2.zelcore.io/api/v2/address/1BWqwKwQNKDY4MYJuMbxGsXP2LbuNGzQ4m?pageSize=50', 'https://blockbook.btc-2.zelcore.io/api/sync'],
  },
  {
    name: 'blockbook.ltc.zelcore.io',
    type: 'blockbook',
    urls: ['https://blockbook.ltc.zelcore.io/api/v2/address/LVjoCYFESyTbKAEU5VbFYtb9EYyBXx55V5?pageSize=50', 'https://blockbook.ltc.zelcore.io/api/sync'],
  },
  {
    name: 'blockbook.ltc-1.zelcore.io',
    type: 'blockbook',
    urls: ['https://blockbook.ltc-1.zelcore.io/api/v2/address/LVjoCYFESyTbKAEU5VbFYtb9EYyBXx55V5?pageSize=50', 'https://blockbook.ltc-1.zelcore.io/api/sync'],
  },
  {
    name: 'blockbook.ltc-2.zelcore.io',
    type: 'blockbook',
    urls: ['https://blockbook.ltc-2.zelcore.io/api/v2/address/LVjoCYFESyTbKAEU5VbFYtb9EYyBXx55V5?pageSize=50', 'https://blockbook.ltc-2.zelcore.io/api/sync'],
  },
  {
    name: 'blockbook.zec.zelcore.io',
    type: 'blockbook',
    urls: ['https://blockbook.zec.zelcore.io/api/v2/address/t1UPSwfMYLe18ezbCqnR5QgdJGznzCUYHkj?pageSize=50', 'https://blockbook.zec.zelcore.io/api/sync'],
  },
  {
    name: 'blockbook.zec-1.zelcore.io',
    type: 'blockbook',
    urls: ['https://blockbook.zec-1.zelcore.io/api/v2/address/t1UPSwfMYLe18ezbCqnR5QgdJGznzCUYHkj?pageSize=50', 'https://blockbook.zec-1.zelcore.io/api/sync'],
  },
  {
    name: 'blockbook.zec-2.zelcore.io',
    type: 'blockbook',
    urls: ['https://blockbook.zec-2.zelcore.io/api/v2/address/t1UPSwfMYLe18ezbCqnR5QgdJGznzCUYHkj?pageSize=50', 'https://blockbook.zec-2.zelcore.io/api/sync'],
  },
  {
    name: 'blockbook.tbtc.zelcore.io',
    type: 'blockbook',
    urls: ['https://blockbook.tbtc.zelcore.io/api/v2/address/tb1q7v5wlst2lq5dcdwk7l5dlx7tpzlyj8g5arvpfs?pageSize=50', 'https://blockbook.tbtc.zelcore.io/api/sync'],
  },
  {
    name: 'blockbook.tbtc-1.zelcore.io',
    type: 'blockbook',
    urls: ['https://blockbook.tbtc-1.zelcore.io/api/v2/address/tb1q7v5wlst2lq5dcdwk7l5dlx7tpzlyj8g5arvpfs?pageSize=50', 'https://blockbook.tbtc-1.zelcore.io/api/sync'],
  },
  {
    name: 'blockbook.tbtc-2.zelcore.io',
    type: 'blockbook',
    urls: ['https://blockbook.tbtc-2.zelcore.io/api/v2/address/tb1q7v5wlst2lq5dcdwk7l5dlx7tpzlyj8g5arvpfs?pageSize=50', 'https://blockbook.tbtc-2.zelcore.io/api/sync'],
  },
  {
    name: 'blockbook.vtc.zelcore.io',
    type: 'blockbook',
    urls: ['https://blockbook.vtc.zelcore.io/api/v2/address/VbFrQgNEiR8ZxMh9WmkjJu9kkqjJA6imdD?pageSize=50', 'https://blockbook.vtc.zelcore.io/api/sync'],
  },
  {
    name: 'blockbook.vtc-1.zelcore.io',
    type: 'blockbook',
    urls: ['https://blockbook.vtc-1.zelcore.io/api/v2/address/VbFrQgNEiR8ZxMh9WmkjJu9kkqjJA6imdD?pageSize=50', 'https://blockbook.vtc-1.zelcore.io/api/sync'],
  },
  {
    name: 'blockbook.vtc-2.zelcore.io',
    type: 'blockbook',
    urls: ['https://blockbook.vtc-2.zelcore.io/api/v2/address/VbFrQgNEiR8ZxMh9WmkjJu9kkqjJA6imdD?pageSize=50', 'https://blockbook.vtc-2.zelcore.io/api/sync'],
  },
  {
    name: 'blockbook.dash.zelcore.io',
    type: 'blockbook',
    urls: ['https://blockbook.dash.zelcore.io/api/v2/address/XmCgmabJL2S8DJ8tmEvB8QDArgBbSSMJea?pageSize=50', 'https://blockbook.dash.zelcore.io/api/sync'],
  },
  {
    name: 'blockbook.dash-1.zelcore.io',
    type: 'blockbook',
    urls: ['https://blockbook.dash-1.zelcore.io/api/v2/address/XmCgmabJL2S8DJ8tmEvB8QDArgBbSSMJea?pageSize=50', 'https://blockbook.dash-1.zelcore.io/api/sync'],
  },
  {
    name: 'blockbook.dash-2.zelcore.io',
    type: 'blockbook',
    urls: ['https://blockbook.dash-2.zelcore.io/api/v2/address/XmCgmabJL2S8DJ8tmEvB8QDArgBbSSMJea?pageSize=50', 'https://blockbook.dash-2.zelcore.io/api/sync'],
  },
  {
    name: 'blockbook.clore.zelcore.io',
    type: 'blockbook',
    urls: ['https://blockbook.clore.zelcore.io/api/v2/address/ANHcdHjkMEYzSL6d8rc8JhvinRKeKJAemq?pageSize=50', 'https://blockbook.clore.zelcore.io/api/sync'],
  },
  {
    name: 'blockbook.clore-1.zelcore.io',
    type: 'blockbook',
    urls: ['https://blockbook.clore-1.zelcore.io/api/v2/address/ANHcdHjkMEYzSL6d8rc8JhvinRKeKJAemq?pageSize=50', 'https://blockbook.clore-1.zelcore.io/api/sync'],
  },
  {
    name: 'blockbook.clore-2.zelcore.io',
    type: 'blockbook',
    urls: ['https://blockbook.clore-2.zelcore.io/api/v2/address/ANHcdHjkMEYzSL6d8rc8JhvinRKeKJAemq?pageSize=50', 'https://blockbook.clore-2.zelcore.io/api/sync'],
  },
  {
    name: 'proxy.btx.zelcore.io',
    type: 'electrumx',
    urls: ['https://proxy.btx.zelcore.io/?server=explorer.btx.zelcore.io&port=50002&contype=tls&coin=bitcore&call=nicehistory&param=2PXeteqGVrcAWexZycbujFLjurNjXhqDXo'],
  },
  {
    name: 'proxy.btx-1.zelcore.io',
    type: 'electrumx',
    urls: ['https://proxy.btx-1.zelcore.io/?server=explorer.btx-1.zelcore.io&port=50002&contype=tls&coin=bitcore&call=nicehistory&param=2PXeteqGVrcAWexZycbujFLjurNjXhqDXo'],
  },
  {
    name: 'proxy.btx-2.zelcore.io',
    type: 'electrumx',
    urls: ['https://proxy.btx-2.zelcore.io/?server=explorer.btx-2.zelcore.io&port=50002&contype=tls&coin=bitcore&call=nicehistory&param=2PXeteqGVrcAWexZycbujFLjurNjXhqDXo'],
  },
  {
    name: 'proxy.rtm.zelcore.io',
    type: 'electrumx',
    urls: ['https://proxy.rtm.zelcore.io/?server=explorer.rtm.zelcore.io&port=50002&contype=tls&coin=raptoreum&call=nicehistory&param=RKo31qpgy9278MuWNXb5NPranc4W6oaUFf'],
  },
  {
    name: 'proxy.rtm-1.zelcore.io',
    type: 'electrumx',
    urls: ['https://proxy.rtm-1.zelcore.io/?server=explorer.rtm-1.zelcore.io&port=50002&contype=tls&coin=raptoreum&call=nicehistory&param=RKo31qpgy9278MuWNXb5NPranc4W6oaUFf'],
  },
  {
    name: 'proxy.rtm-2.zelcore.io',
    type: 'electrumx',
    urls: ['https://proxy.rtm-2.zelcore.io/?server=explorer.rtm-2.zelcore.io&port=50002&contype=tls&coin=raptoreum&call=nicehistory&param=RKo31qpgy9278MuWNXb5NPranc4W6oaUFf'],
  },
  {
    name: 'proxy.runonflux.io',
    type: 'electrumx',
    urls: ['https://proxy.runonflux.io/?server=127.0.0.1&port=50002&contype=tls&coin=zelcash&call=nicehistory&param=t3c51GjrkUg7pUiS8bzNdTnW2hD25egWUih'],
  },
  {
    name: 'proxy1.runonflux.io',
    type: 'electrumx',
    urls: ['https://proxy1.runonflux.io/?server=127.0.0.1&port=50002&contype=tls&coin=zelcash&call=nicehistory&param=t3c51GjrkUg7pUiS8bzNdTnW2hD25egWUih'],
  },
  {
    name: 'proxy2.runonflux.io',
    type: 'electrumx',
    urls: ['https://proxy2.runonflux.io/?server=127.0.0.1&port=50002&contype=tls&coin=zelcash&call=nicehistory&param=t3c51GjrkUg7pUiS8bzNdTnW2hD25egWUih'],
  },
  {
    name: 'electrumx.runonflux.io',
    type: 'electrumx',
    urls: ['https://proxy.runonflux.io/?server=electrumx.runonflux.io&port=50002&contype=tls&coin=zelcash&call=nicehistory&param=t3c51GjrkUg7pUiS8bzNdTnW2hD25egWUih'],
  },
  {
    name: 'electrumx1.runonflux.io',
    type: 'electrumx',
    urls: ['https://proxy.runonflux.io/?server=electrumx1.runonflux.io&port=50002&contype=tls&coin=zelcash&call=nicehistory&param=t3c51GjrkUg7pUiS8bzNdTnW2hD25egWUih'],
  },
  {
    name: 'electrumx2.runonflux.io',
    type: 'electrumx',
    urls: ['https://proxy.runonflux.io/?server=electrumx2.runonflux.io&port=50002&contype=tls&coin=zelcash&call=nicehistory&param=t3c51GjrkUg7pUiS8bzNdTnW2hD25egWUih'],
  },
  {
    name: 'node.etc.zelcore.io',
    type: 'eth',
    urls: ['https://node.etc.zelcore.io'],
    data: [{
      jsonrpc: '2.0', id: 132, method: 'eth_getBalance', params: ['0x0e009d19cb4693fcf2d15aaf4a5ee1c8a0bb5ecf', 'latest'],
    }],
  },
  {
    name: 'node.etc-1.zelcore.io',
    type: 'eth',
    urls: ['https://node.etc-1.zelcore.io'],
    data: [{
      jsonrpc: '2.0', id: 132, method: 'eth_getBalance', params: ['0x0e009d19cb4693fcf2d15aaf4a5ee1c8a0bb5ecf', 'latest'],
    }],
  },
  {
    name: 'node.etc-2.zelcore.io',
    type: 'eth',
    urls: ['https://node.etc-2.zelcore.io'],
    data: [{
      jsonrpc: '2.0', id: 132, method: 'eth_getBalance', params: ['0x0e009d19cb4693fcf2d15aaf4a5ee1c8a0bb5ecf', 'latest'],
    }],
  },
  {
    name: 'explorer.xmr.zelcore.io',
    type: 'explorer',
    urls: ['https://explorer.xmr.zelcore.io'],
  },
  {
    name: 'explorer.xmr-1.zelcore.io',
    type: 'explorer',
    urls: ['https://explorer.xmr-1.zelcore.io'],
  },
  {
    name: 'explorer.xmr-2.zelcore.io',
    type: 'explorer',
    urls: ['https://explorer.xmr-2.zelcore.io'],
  },
  {
    name: 'explorer.btx.zelcore.io',
    type: 'explorer',
    urls: ['https://explorer.btx.zelcore.io'],
  },
  {
    name: 'explorer.btx-1.zelcore.io',
    type: 'explorer',
    urls: ['https://explorer.btx-1.zelcore.io'],
  },
  {
    name: 'explorer.btx-2.zelcore.io',
    type: 'explorer',
    urls: ['https://explorer.btx-2.zelcore.io'],
  },
  {
    name: 'explorer.rtm.zelcore.io',
    type: 'explorer',
    urls: ['https://explorer.rtm.zelcore.io'],
  },
  {
    name: 'explorer.rtm-1.zelcore.io',
    type: 'explorer',
    urls: ['https://explorer.rtm-1.zelcore.io'],
  },
  {
    name: 'explorer.rtm-2.zelcore.io',
    type: 'explorer',
    urls: ['https://explorer.rtm-2.zelcore.io'],
  },
  {
    name: 'apt.runonflux.io',
    type: 'explorer',
    urls: ['https://apt.runonflux.io'],
  },
  {
    name: 'apt.zelcore.io',
    type: 'explorer',
    urls: ['https://apt.zelcore.io'],
  },
  {
    name: 'download.zelcore.io',
    type: 'explorer',
    urls: ['https://download.zelcore.io'],
  },
  {
    name: 'cdn.zelcore.io',
    type: 'explorer',
    urls: ['https://cdn.zelcore.io'],
  },
  {
    name: 'resources.zelcore.io',
    type: 'explorer',
    urls: ['https://resources.zelcore.io'],
  },
  {
    name: 'cdn.zelcore.workers.dev',
    type: 'explorer',
    urls: ['https://cdn.zelcore.workers.dev'],
  },
  {
    name: 'update.zelcore.workers.dev',
    type: 'explorer',
    urls: ['https://update.zelcore.workers.dev'],
  },
  {
    name: 'resources.zelcore.workers.dev',
    type: 'explorer',
    urls: ['https://resources.zelcore.workers.dev'],
  },
  {
    name: 'runonflux.zelcore.workers.dev',
    type: 'explorer',
    urls: ['https://runonflux.zelcore.workers.dev'],
  },
  {
    name: 'apt.fluxos.network',
    type: 'explorer',
    urls: ['https://apt.fluxos.network'],
  },
  {
    name: 'link.zelcore.io',
    type: 'explorer',
    urls: ['https://link.zelcore.io'],
  },
  {
    name: 'docs.zelcore.io',
    type: 'explorer',
    urls: ['https://docs.zelcore.io'],
  },
  {
    name: 'zelpro.zelcore.io',
    type: 'zelcoreplus',
    urls: ['https://zelpro.zelcore.io/prouser/1CbErtneaX2QVyUfwU7JGB7VzvPgrgc3uC'],
  },
  {
    name: 'plus.zelcore.io',
    type: 'zelcoreplus',
    urls: ['https://plus.zelcore.io/prouser/1CbErtneaX2QVyUfwU7JGB7VzvPgrgc3uC'],
  },
  {
    name: 'proxycze.app.runonflux.io',
    type: 'explorer',
    urls: ['https://proxycze.app.runonflux.io/'],
  },
  {
    name: 'proxyde.app.runonflux.io',
    type: 'explorer',
    urls: ['https://proxyde.app.runonflux.io/'],
  },
  {
    name: 'proxynyc.app.runonflux.io',
    type: 'explorer',
    urls: ['https://proxynyc.app.runonflux.io/'],
  },
  {
    name: 'proxysgp.app.runonflux.io',
    type: 'explorer',
    urls: ['https://proxysgp.app.runonflux.io/'],
  },
  {
    name: 'proxyfin.app.runonflux.ioo',
    type: 'explorer',
    urls: ['https://proxyfin.app.runonflux.io/'],
  },
  {
    name: 'proxyfr.app.runonflux.io',
    type: 'explorer',
    urls: ['https://proxyfr.app.runonflux.io/'],
  },
  {
    name: 'proxyeu.app.runonflux.io',
    type: 'explorer',
    urls: ['https://proxyeu.app.runonflux.io/'],
  },
  {
    name: 'proxyna.app.runonflux.io',
    type: 'explorer',
    urls: ['https://proxyna.app.runonflux.io/'],
  },
  {
    name: 'proxysa.app.runonflux.io',
    type: 'explorer',
    urls: ['https://proxysa.app.runonflux.io/'],
  },
  {
    name: 'proxyasia.app.runonflux.io',
    type: 'explorer',
    urls: ['https://proxyasia.app.runonflux.io/'],
  },
  {
    name: 'proxyoc.app.runonflux.io',
    type: 'explorer',
    urls: ['https://proxyoc.app.runonflux.io/'],
  },
  {
    name: 'proxy.nft.zelcore.io',
    type: 'explorer',
    urls: ['https://proxy.nft.zelcore.io/nft-proxy/v1/nfts/eth/?addresses=0x0e009d19cb4693fcf2d15aaf4a5ee1c8a0bb5ecf&noCache=0'],
  },
  {
    name: 'vipbrates.zelcore.io',
    type: 'rates',
    urls: ['https://vipbrates.zelcore.io/'],
  },
  {
    name: 'viparates.zelcore.io',
    type: 'rates',
    urls: ['https://viparates.zelcore.io/'],
  },
  {
    name: 'viprates.runonflux.io',
    type: 'rates',
    urls: ['https://viprates.runonflux.io/rates'],
  },
  {
    name: 'viprates.zelcore.io',
    type: 'rates',
    urls: ['https://viprates.zelcore.io/rates'],
  },
  {
    name: 'vipbrates.zelcore.io/marketsusd',
    type: 'markets',
    urls: ['https://vipbrates.zelcore.io/marketsusd'],
  },
  {
    name: 'viparates.zelcore.io/marketsusd',
    type: 'markets',
    urls: ['https://viparates.zelcore.io/marketsusd'],
  },
  {
    name: 'node.dot.zelcore.io',
    type: 'substrate',
    urls: ['https://node.dot.zelcore.io/runtime'],
  },
  {
    name: 'node.dot-1.zelcore.io',
    type: 'substrate',
    urls: ['https://node.dot-1.zelcore.io/runtime'],
  },
  {
    name: 'node.dot-2.zelcore.io',
    type: 'substrate',
    urls: ['https://node.dot-2.zelcore.io/runtime'],
  },
  {
    name: 'node.wnd.zelcore.io',
    type: 'substrate',
    urls: ['https://node.wnd.zelcore.io/runtime'],
  },
  {
    name: 'node.wnd-1.zelcore.io',
    type: 'substrate',
    urls: ['https://node.wnd-1.zelcore.io/runtime'],
  },
  {
    name: 'node.wnd-2.zelcore.io',
    type: 'substrate',
    urls: ['https://node.wnd-2.zelcore.io/runtime'],
  },
  {
    name: 'node.ksm.zelcore.io',
    type: 'substrate',
    urls: ['https://node.ksm.zelcore.io/runtime'],
  },
  {
    name: 'node.ksm-1.zelcore.io',
    type: 'substrate',
    urls: ['https://node.ksm-1.zelcore.io/runtime'],
  },
  {
    name: 'node.ksm-2.zelcore.io',
    type: 'substrate',
    urls: ['https://node.ksm-2.zelcore.io/runtime'],
  },
  {
    name: 'backend.ada.zelcore.io',
    type: 'cardano',
    urls: ['https://backend.ada.zelcore.io/v1/balances/addr1qy8s6f3nunlw05anczrkgspys2pkx4p9aa0jlzhj2gl5pjq87gdf9tcy2xsn28xlye3dghklckhup56axkjqqzv5dc2s38tvpv', 'https://backend.ada.zelcore.io/v1/txs/addr1qy8s6f3nunlw05anczrkgspys2pkx4p9aa0jlzhj2gl5pjq87gdf9tcy2xsn28xlye3dghklckhup56axkjqqzv5dc2s38tvpv'],
  },
  {
    name: 'backend.ada-1.zelcore.io',
    type: 'cardano',
    urls: ['https://backend.ada-1.zelcore.io/v1/balances/addr1qy8s6f3nunlw05anczrkgspys2pkx4p9aa0jlzhj2gl5pjq87gdf9tcy2xsn28xlye3dghklckhup56axkjqqzv5dc2s38tvpv', 'https://backend.ada-1.zelcore.io/v1/txs/addr1qy8s6f3nunlw05anczrkgspys2pkx4p9aa0jlzhj2gl5pjq87gdf9tcy2xsn28xlye3dghklckhup56axkjqqzv5dc2s38tvpv'],
  },
  {
    name: 'backend.ada-2.zelcore.io',
    type: 'cardano',
    urls: ['https://backend.ada-2.zelcore.io/v1/balances/addr1qy8s6f3nunlw05anczrkgspys2pkx4p9aa0jlzhj2gl5pjq87gdf9tcy2xsn28xlye3dghklckhup56axkjqqzv5dc2s38tvpv', 'https://backend.ada-2.zelcore.io/v1/txs/addr1qy8s6f3nunlw05anczrkgspys2pkx4p9aa0jlzhj2gl5pjq87gdf9tcy2xsn28xlye3dghklckhup56axkjqqzv5dc2s38tvpv'],
  },
  {
    name: 'graphql.erg.zelcore.io',
    type: 'ergo',
    urls: ['https://graphql.erg.zelcore.io'],
    data: [{
      query: `query boxes($address: String, $take: Int, $skip: Int, $tokenId: String, $spent: Boolean) {
        boxes(address: $address, take: $take, skip: $skip, tokenId: $tokenId, spent: $spent) {
          boxId
          transactionId
          value
          creationHeight
          index
          ergoTree
          address
          additionalRegisters
          assets {
            tokenId
            amount
          }
        }
      }`,
      variables: {
        address: '9gqbdQTNbjvvxddeFjg5DEQc7qWUWySC6FkFqvR78cNUz8aJS9Y',
        spent: false,
        skip: 0,
        take: 50,
      },
    }],
  },
  {
    name: 'graphql.erg-1.zelcore.io',
    type: 'ergo',
    urls: ['https://graphql.erg-1.zelcore.io'],
    data: [{
      query: `query boxes($address: String, $take: Int, $skip: Int, $tokenId: String, $spent: Boolean) {
        boxes(address: $address, take: $take, skip: $skip, tokenId: $tokenId, spent: $spent) {
          boxId
          transactionId
          value
          creationHeight
          index
          ergoTree
          address
          additionalRegisters
          assets {
            tokenId
            amount
          }
        }
      }`,
      variables: {
        address: '9gqbdQTNbjvvxddeFjg5DEQc7qWUWySC6FkFqvR78cNUz8aJS9Y',
        spent: false,
        skip: 0,
        take: 50,
      },
    }],
  },
  {
    name: 'graphql.erg-2.zelcore.io',
    type: 'ergo',
    urls: ['https://graphql.erg-2.zelcore.io'],
    data: [{
      query: `query boxes($address: String, $take: Int, $skip: Int, $tokenId: String, $spent: Boolean) {
        boxes(address: $address, take: $take, skip: $skip, tokenId: $tokenId, spent: $spent) {
          boxId
          transactionId
          value
          creationHeight
          index
          ergoTree
          address
          additionalRegisters
          assets {
            tokenId
            amount
          }
        }
      }`,
      variables: {
        address: '9gqbdQTNbjvvxddeFjg5DEQc7qWUWySC6FkFqvR78cNUz8aJS9Y',
        spent: false,
        skip: 0,
        take: 50,
      },
    }],
  },
  {
    name: 'stats.runonflux.io',
    type: 'stats',
    urls: ['https://stats.runonflux.io/fluxinfo'],
  },
  {
    name: 'api.firo.zelcore.io',
    type: 'stats',
    urls: ['https://api.firo.zelcore.io/znodeinfo'],
  },
  {
    name: 'api.zelcore.io/networkfees',
    type: 'fees',
    urls: ['https://api.zelcore.io/networkfees'],
  },
  // {
  //   name: 'nitter.zelcore.io',
  //   type: 'explorer',
  //   urls: ['https://nitter.zelcore.io'],
  // },
  {
    name: 'hashes.runonflux.io',
    type: 'hashes',
    urls: ['https://hashes.runonflux.io'],
  },
  {
    name: 'abe.zelcore.io',
    type: 'abe',
    urls: ['https://abe.zelcore.io/v1/exchange/user/history', 'https://abe.zelcore.io/v1/exchange/sellassets', 'https://abe.zelcore.io/v1/serum/tickers'],
  },
  {
    name: 'home.runonflux.io',
    type: 'fdm',
    urls: ['https://home.runonflux.io/fluxstatistics'],
  },
  {
    name: 'fdm-main-asia',
    type: 'fdm',
    urls: ['https://fdm-main-asia.runonflux.io/fluxstatistics'],
  },
  {
    name: 'fdm-main-eu',
    type: 'fdm',
    urls: ['https://fdm-main-eu.runonflux.io/fluxstatistics'],
  },
  {
    name: 'fdm-main-na',
    type: 'fdm',
    urls: ['https://fdm-main-na.runonflux.io/fluxstatistics'],
  },
  {
    name: 'fdm-nodes-eu-1-1.runonflux.io',
    type: 'fdm',
    urls: ['https://fdm-nodes-eu-1-1.runonflux.io/fluxstatistics'],
  },
  {
    name: 'fdm-nodes-us-1-1.runonflux.io',
    type: 'fdm',
    urls: ['https://fdm-nodes-us-1-1.runonflux.io/fluxstatistics'],
  },
  {
    name: 'fdm-usa-1-1.runonflux.io',
    type: 'fdm',
    urls: ['https://fdm-usa-1-1.runonflux.io/fluxstatistics'],
  },
  {
    name: 'fdm-usa-1-2.runonflux.io',
    type: 'fdm',
    urls: ['https://fdm-usa-1-2.runonflux.io/fluxstatistics'],
  },
  {
    name: 'fdm-usa-1-3.runonflux.io',
    type: 'fdm',
    urls: ['https://fdm-usa-1-3.runonflux.io/fluxstatistics'],
  },
  {
    name: 'fdm-usa-1-4.runonflux.io',
    type: 'fdm',
    urls: ['https://fdm-usa-1-4.runonflux.io/fluxstatistics'],
  },
  {
    name: 'fdm-fn-1-1.runonflux.io',
    type: 'fdm',
    urls: ['https://fdm-fn-1-1.runonflux.io/fluxstatistics'],
  },
  {
    name: 'fdm-fn-1-2.runonflux.io',
    type: 'fdm',
    urls: ['https://fdm-fn-1-2.runonflux.io/fluxstatistics'],
  },
  {
    name: 'fdm-fn-1-3.runonflux.io',
    type: 'fdm',
    urls: ['https://fdm-fn-1-3.runonflux.io/fluxstatistics'],
  },
  {
    name: 'fdm-fn-1-4.runonflux.io',
    type: 'fdm',
    urls: ['https://fdm-fn-1-4.runonflux.io/fluxstatistics'],
  },
  {
    name: 'fdm-sg-1-1.runonflux.io',
    type: 'fdm',
    urls: ['https://fdm-sg-1-1.runonflux.io/fluxstatistics'],
  },
  {
    name: 'fdm-sg-1-2.runonflux.io',
    type: 'fdm',
    urls: ['https://fdm-sg-1-2.runonflux.io/fluxstatistics'],
  },
  {
    name: 'fdm-sg-1-3.runonflux.io',
    type: 'fdm',
    urls: ['https://fdm-sg-1-3.runonflux.io/fluxstatistics'],
  },
  {
    name: 'fdm-sg-1-4.runonflux.io',
    type: 'fdm',
    urls: ['https://fdm-sg-1-4.runonflux.io/fluxstatistics'],
  },
  {
    name: 'fdm-usa-2-1.runonflux.io',
    type: 'fdm',
    urls: ['https://fdm-usa-2-1.runonflux.io/fluxstatistics'],
  },
  {
    name: 'fdm-usa-2-2.runonflux.io',
    type: 'fdm',
    urls: ['https://fdm-usa-2-2.runonflux.io/fluxstatistics'],
  },
  {
    name: 'fdm-fn-2-1.runonflux.io',
    type: 'fdm',
    urls: ['https://fdm-fn-2-1.runonflux.io/fluxstatistics'],
  },
  {
    name: 'fdm-fn-2-2.runonflux.io',
    type: 'fdm',
    urls: ['https://fdm-fn-2-2.runonflux.io/fluxstatistics'],
  },
  {
    name: 'kadena.dapp.runonflux.io',
    type: 'kdalb',
    urls: ['https://kadena.dapp.runonflux.io/fluxstatistics'],
  },
  {
    name: 'fusion.runonflux.io',
    type: 'fusion',
    urls: ['https://fusion.runonflux.io/swap/info', 'https://fusion.runonflux.io/messagephrase'],
  },
  {
    name: 'node.kda-1.zelcore.io',
    type: 'kda',
    urls: ['https://node.kda-1.zelcore.io'],
  },
  {
    name: 'node.kda-2.zelcore.io',
    type: 'kda',
    urls: ['https://node.kda-2.zelcore.io'],
  },
  {
    name: 'node.kda-3.zelcore.io',
    type: 'kda',
    urls: ['https://node.kda-3.zelcore.io'],
  },
  {
    name: 'node.kda-1.zelcore.ioDATA',
    type: 'kdaData',
    urls: ['https://node.kda-1.zelcore.io'],
  },
  {
    name: 'node.kda-2.zelcore.ioDATA',
    type: 'kdaData',
    urls: ['https://node.kda-2.zelcore.io'],
  },
  {
    name: 'node.kda-3.zelcore.ioDATA',
    type: 'kdaData',
    urls: ['https://node.kda-3.zelcore.io'],
  },
  {
    name: 'node.kda-1.zelcore.ioTXS',
    type: 'kdaTXS',
    urls: ['http://5.39.57.12:9876'],
  },
  {
    name: 'node.kda-2.zelcore.ioTXS',
    type: 'kdaTXS',
    urls: ['http://5.39.57.13:9876'],
  },
  {
    name: 'node.kda-3.zelcore.ioTXS',
    type: 'kdaTXS',
    urls: ['http://5.39.57.14:9876'],
  },
  {
    name: 'storage.runonflux.io',
    type: 'fluxstorage',
    urls: ['https://storage.runonflux.io/v1/env/865071381744200'],
  },
  {
    name: 'smp1.simplexonflux.com',
    type: 'simplex',
    urls: ['smp://xQW_ufMkGE20UrTlBl8QqceG1tbuylXhr9VOLPyRJmw=@smp1.simplexonflux.com,qb4yoanyl4p7o33yrknv4rs6qo7ugeb2tu2zo66sbebezs4cpyosarid.onion'],
  },
  {
    name: 'smp2.simplexonflux.com',
    type: 'simplex',
    urls: ['smp://LDnWZVlAUInmjmdpQQoIo6FUinRXGe0q3zi5okXDE4s=@smp2.simplexonflux.com,yiqtuh3q4x7hgovkomafsod52wvfjucdljqbbipg5sdssnklgongxbqd.onion'],
  },
  {
    name: 'smp3.simplexonflux.com',
    type: 'simplex',
    urls: ['smp://1jne379u7IDJSxAvXbWb_JgoE7iabcslX0LBF22Rej0=@smp3.simplexonflux.com,a5lm4k7ufei66cdck6fy63r4lmkqy3dekmmb7jkfdm5ivi6kfaojshad.onion'],
  },
  {
    name: 'smp4.simplexonflux.com',
    type: 'simplex',
    urls: ['smp://xmAmqj75I9mWrUihLUlI0ZuNLXlIwFIlHRq5Pb6cHAU=@smp4.simplexonflux.com,qpcz2axyy66u26hfdd2e23uohcf3y6c36mn7dcuilcgnwjasnrvnxjqd.onion'],
  },
  {
    name: 'smp5.simplexonflux.com',
    type: 'simplex',
    urls: ['smp://rWvBYyTamuRCBYb_KAn-nsejg879ndhiTg5Sq3k0xWA=@smp5.simplexonflux.com,4ao347qwiuluyd45xunmii4skjigzuuox53hpdsgbwxqafd4yrticead.onion'],
  },
  {
    name: 'smp6.simplexonflux.com',
    type: 'simplex',
    urls: ['smp://PN7-uqLBToqlf1NxHEaiL35lV2vBpXq8Nj8BW11bU48=@smp6.simplexonflux.com,hury6ot3ymebbr2535mlp7gcxzrjpc6oujhtfxcfh2m4fal4xw5fq6qd.onion'],
  },
  {
    name: 'xftp1.simplexonflux.com',
    type: 'simplex',
    urls: ['xftp://92Sctlc09vHl_nAqF2min88zKyjdYJ9mgxRCJns5K2U=@xftp1.simplexonflux.com,apl3pumq3emwqtrztykyyoomdx4dg6ysql5zek2bi3rgznz7ai3odkid.onion'],
  },
  {
    name: 'xftp2.simplexonflux.com',
    type: 'simplex',
    urls: ['xftp://YBXy4f5zU1CEhnbbCzVWTNVNsaETcAGmYqGNxHntiE8=@xftp2.simplexonflux.com,c5jjecisncnngysah3cz2mppediutfelco4asx65mi75d44njvua3xid.onion'],
  },
  {
    name: 'xftp3.simplexonflux.com',
    type: 'simplex',
    urls: ['xftp://ARQO74ZSvv2OrulRF3CdgwPz_AMy27r0phtLSq5b664=@xftp3.simplexonflux.com,dc4mohiubvbnsdfqqn7xhlhpqs5u4tjzp7xpz6v6corwvzvqjtaqqiqd.onion'],
  },
  {
    name: 'xftp4.simplexonflux.com',
    type: 'simplex',
    urls: ['xftp://ub2jmAa9U0uQCy90O-fSUNaYCj6sdhl49Jh3VpNXP58=@xftp4.simplexonflux.com,4qq5pzier3i4yhpuhcrhfbl6j25udc4czoyascrj4yswhodhfwev3nyd.onion'],
  },
  {
    name: 'xftp5.simplexonflux.com',
    type: 'simplex',
    urls: ['xftp://Rh19D5e4Eez37DEE9hAlXDB3gZa1BdFYJTPgJWPO9OI=@xftp5.simplexonflux.com,q7itltdn32hjmgcqwhow4tay5ijetng3ur32bolssw32fvc5jrwvozad.onion'],
  },
  {
    name: 'xftp6.simplexonflux.com',
    type: 'simplex',
    urls: ['xftp://0AznwoyfX8Od9T_acp1QeeKtxUi676IBIiQjXVwbdyU=@xftp6.simplexonflux.com,upvzf23ou6nrmaf3qgnhd6cn3d74tvivlmz3p7wdfwq6fhthjrjiiqid.onion'],
  },
];

async function checkServices() {
  // try {
  //   const wps = [];
  //   const response = await getRequest('https://api.runonflux.io/apps/globalappsspecifications');
  //   const wordpresses = response.data.filter((app) => app.name.startsWith('wordpress1'));
  //   // eslint-disable-next-line no-restricted-syntax
  //   for (const wordpress of wordpresses) {
  //     wps.push({
  //       name: wordpress.name,
  //       type: 'wordpress',
  //       urls: [`https://${wordpress.name}_${wordpress.compose[0].ports[0]}.app.runonflux.io`],
  //     });
  //     if (wordpress.compose[0].domains[0]) {
  //       wps.push({
  //         name: wordpress.name,
  //         type: 'wordpress',
  //         urls: [`https://${wordpress.compose[0].domains[0]}`],
  //       });
  //     }
  //   }
  //   console.log(wps);
  //   wps.forEach((wp) => {
  //     checks.push(wp);
  //   });
  // } catch (error) {
  //   console.log(error);
  // }
  for (const check of checks) {
    try {
      if (check.type === 'insight') { // must have 2 urls
        const responseA = await getRequest(check.urls[0]);
        const responseB = await getRequest(check.urls[1]);
        checkInsight(responseA, responseB, check.name);
      } else if (check.type === 'checkInsightProxy') { // must have 2 urls
        const responseA = await getRequest(check.urls[0]);
        const responseB = await getRequest(check.urls[1]);
        checkInsightProxy(responseA, responseB, check.name);
      } else if (check.type === 'extendedInsight') { // must have 3 urls
        await extendedInsightTest(check.urls[0], check.urls[1], check.urls[2], check.name);
      } else if (check.type === 'blockbook') { // must have 2 urls
        const responseA = await getRequest(check.urls[0]);
        const responseB = await getRequest(check.urls[1]);
        checkBlockBook(responseA, responseB, check.name);
      } else if (check.type === 'electrumx') { // must have 1 url
        const responseA = await getRequest(check.urls[0]);
        checkElectrumx(responseA, check.name);
      } else if (check.type === 'explorer') { // must have 1 url
        await getRequest(check.urls[0]); // sufficient
      } else if (check.type === 'veriblock') { // must have 1 url
        const responseA = await postRequest(check.urls[0], check.data[0]);
        checkVeriblockBalance(responseA, check.name);
      } else if (check.type === 'eth') { // must have 1 url
        const responseA = await postRequest(check.urls[0], check.data[0]);
        checkEthBalance(responseA, check.name);
      } else if (check.type === 'zelcoreplus') { // must have 1 url
        const responseA = await getRequest(check.urls[0]);
        checkZelCorePlus(responseA, check.name);
      } else if (check.type === 'rates') { // must have 1 url
        const responseA = await getRequest(check.urls[0]);
        checkRates(responseA, check.name);
      } else if (check.type === 'markets') { // must have 1 url
        const responseA = await getRequest(check.urls[0]);
        checkMarkets(responseA, check.name);
      } else if (check.type === 'substrate') { // must have 1 url
        const responseA = await getRequest(check.urls[0]);
        checkSubstrate(responseA, check.name);
      } else if (check.type === 'cardano') { // must have 2 url
        const responseA = await getRequest(check.urls[0]);
        const responseB = await getRequest(check.urls[1]);
        checkCardano(responseA, responseB, check.name);
      } else if (check.type === 'ergo') { // must have 1 url
        const responseA = await postRequest(check.urls[0], check.data[0]);
        checkErgo(responseA, check.name);
      } else if (check.type === 'abe') { // must have 2 urls
        const responseA = await getRequest(check.urls[0]);
        const responseB = await getRequest(check.urls[1]);
        checkABE(responseA, responseB, check.name);
      } else if (check.type === 'stats') { // must have 1 url
        const responseA = await getRequest(check.urls[0]);
        checkStats(responseA, check.name);
      } else if (check.type === 'hashes') { // must have 1 url
        const responseA = await getRequest(check.urls[0]);
        checkHashes(responseA, check.name);
      } else if (check.type === 'fees') { // must have 1 url
        const responseA = await getRequest(check.urls[0]);
        checkFees(responseA, check.name);
      } else if (check.type === 'fdm') { // must have 1 url
        const responseA = await getRequestNoCert(check.urls[0]);
        checkFDM(responseA, check.name);
      } else if (check.type === 'kdalb') { // must have 1 url
        await getRequestNoCert(check.urls[0]); // no throw is ok
      } else if (check.type === 'fusion') { // must have 2 urls
        const responseA = await getRequest(check.urls[0]);
        const responseB = await getRequest(check.urls[1]);
        checkFusion(responseA, responseB, check.name);
      } else if (check.type === 'kda') { // must have 1 domain
        await checkKDA(check.urls[0], check.name);
      } else if (check.type === 'kdaData') { // must have 1 domain
        await checkKDAData(check.urls[0], check.name);
      } else if (check.type === 'kdaTXS') { // must have 1 domain
        await checkKDATxs(check.urls[0], check.name);
      } else if (check.type === 'fluxstorage') { // must have 1 domain
        await checkFluxStorage(check.urls[0], check.name);
      } else if (check.type === 'simplex') { // must have 1 domain
        await checkSimplex(check.urls[0], check.name);
      } else if (check.type === 'wordpress') { // must have 1 domain
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
