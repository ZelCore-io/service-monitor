/* eslint-disable no-restricted-syntax */
/* eslint-disable no-await-in-loop */
const axios = require('axios');
const https = require('https');
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

function checkInsight(i, j, name) {
  if (i.transactions.length > 0 && j.status === 'finished') {
    return true;
  }
  throw new Error(`checkInsight ${name}`);
}

function checkInsightProxy(i, j, name) { // tests proxy blockbook - insight
  if (Array.isArray(i) && i.length > 1 && j.info.blocks > 722564) {
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
  const confirmedObject = i.result.confirmed.find((a) => a.address === 'VBZ3J16cLrhxeEwZvswQSucfrFKvMF');
  const confirmedBal = confirmedObject.unlockedAmount;
  if (confirmedBal > 0) {
    return true;
  }
  throw new Error(`checkVeriblockBalance ${name}`);
}

function checkZelCorePlus(i, name) {
  if (i.validTill === 1760216096000) {
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
  const sync = i.data.cardanoDbMeta.syncPercentage;
  const { utxos } = j.data;
  if (utxos[0].value > 100) {
    if (sync === 100) {
      return true;
    }
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
  if (response.length > 2 && response[2].normal > 9) {
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

const checks = [
  {
    name: 'explorer.runonflux.io',
    type: 'insight',
    urls: ['https://explorer.runonflux.io/api/addr/t3c51GjrkUg7pUiS8bzNdTnW2hD25egWUih', 'https://explorer.runonflux.io/api/sync'],
  },
  {
    name: 'explorer2.flux.zelcore.io',
    type: 'insight',
    urls: ['https://explorer2.flux.zelcore.io/api/addr/t3c51GjrkUg7pUiS8bzNdTnW2hD25egWUih', 'https://explorer2.flux.zelcore.io/api/sync'],
  },
  {
    name: 'explorer.flux.zelcore.io', // todo individual nodes
    type: 'insight',
    urls: ['https://explorer.flux.zelcore.io/api/addr/t3c51GjrkUg7pUiS8bzNdTnW2hD25egWUih', 'https://explorer.flux.zelcore.io/api/sync'],
  },
  {
    name: 'explorer.zelcash.online',
    type: 'insight',
    urls: ['https://explorer.zelcash.online/api/addr/t3c51GjrkUg7pUiS8bzNdTnW2hD25egWUih', 'https://explorer.zelcash.online/api/sync'],
  },
  {
    name: 'explorer.anon.zelcore.io',
    type: 'insight',
    urls: ['https://explorer.anon.zelcore.io/api/addr/AnY5LGSDdUgawBW8TQuFL1fJeTbswo65xeK', 'https://explorer.anon.zelcore.io/api/sync'],
  },
  {
    name: 'explorer.dash.zelcore.io',
    type: 'insight',
    urls: ['https://explorer.dash.zelcore.io/api/addr/XmCgmabJL2S8DJ8tmEvB8QDArgBbSSMJea', 'https://explorer.dash.zelcore.io/api/sync'],
  },
  {
    name: 'explorer.zcoin.zelcore.io',
    type: 'insight',
    urls: ['https://explorer.zcoin.zelcore.io/api/addr/aBEJgEP2b7DP7tyQukv639qtdhjFhWp2QE', 'https://explorer.zcoin.zelcore.io/api/sync'],
  },
  {
    name: 'explorer.btcz.zelcore.io',
    type: 'insight',
    urls: ['https://explorer.btcz.zelcore.io/api/addr/t1UPSwfMYLe18ezbCqnR5QgdJGznzCUYHkj', 'https://explorer.btcz.zelcore.io/api/sync'],
  },
  {
    name: 'explorer.zer.zelcore.io',
    type: 'insight',
    urls: ['https://explorer.zer.zelcore.io/api/addr/t1UPSwfMYLe18ezbCqnR5QgdJGznzCUYHkj', 'https://explorer.zer.zelcore.io/api/sync'],
  },
  {
    name: 'explorer.kmd.zelcore.io',
    type: 'insight',
    urls: ['https://explorer.kmd.zelcore.io/api/addr/RKo31qpgy9278MuWNXb5NPranc4W6oaUFf', 'https://explorer.kmd.zelcore.io/api/sync'],
  },
  {
    name: 'explorer.rvn.zelcore.io',
    type: 'insight',
    urls: ['https://explorer.rvn.zelcore.io/api/addr/RKo31qpgy9278MuWNXb5NPranc4W6oaUFf', 'https://explorer.rvn.zelcore.io/api/sync'],
  },
  {
    name: 'explorer.zcl.zelcore.io',
    type: 'insight',
    urls: ['https://explorer.zcl.zelcore.io/api/addr/t1UPSwfMYLe18ezbCqnR5QgdJGznzCUYHkj', 'https://explorer.zcl.zelcore.io/api/sync'],
  },
  {
    name: 'explorer.zcl.zelcore.io',
    type: 'insight',
    urls: ['https://explorer.zcl.zelcore.io/api/addr/t1UPSwfMYLe18ezbCqnR5QgdJGznzCUYHkj', 'https://explorer.zcl.zelcore.io/api/sync'],
  },
  {
    name: 'explorer.cmm.zelcore.io',
    type: 'insight',
    urls: ['https://explorer.cmm.zelcore.io/api/addr/CSyjWNHUFNC4xVSjb6vsrP9QeTpKNRMLZP', 'https://explorer.cmm.zelcore.io/api/sync'],
  },
  {
    name: 'explorer.btc.zelcore.io',
    type: 'insight',
    urls: ['https://explorer.btc.zelcore.io/api/addr/12ib7dApVFvg82TXKycWBNpN8kFyiAN1dr/utxo', 'https://explorer.btc.zelcore.io/api/status'],
  },
  {
    name: 'explorer.zec.zelcore.io',
    type: 'insight',
    urls: ['https://explorer.zec.zelcore.io/api/addr/t1UPSwfMYLe18ezbCqnR5QgdJGznzCUYHkj', 'https://explorer.zec.zelcore.io/api/sync'],
  },
  {
    name: 'explorer.axe.zelcore.io',
    type: 'insight',
    urls: ['https://explorer.axe.zelcore.io/api/addr/PK726JLFREhj3CD5FRvUwmVee5mnX7g4ia', 'https://explorer.axe.zelcore.io/api/sync'],
  },
  {
    name: 'explorer.ltc.zelcore.io',
    type: 'insight',
    urls: ['https://explorer.ltc.zelcore.io/api/addr/LVjoCYFESyTbKAEU5VbFYtb9EYyBXx55V5', 'https://explorer.ltc.zelcore.io/api/sync'],
  },
  {
    name: 'blockbook.runonflux.io',
    type: 'blockbook',
    urls: ['https://blockbook.runonflux.io/api/v2/address/t1UPSwfMYLe18ezbCqnR5QgdJGznzCUYHkj?pageSize=50', 'https://blockbook.runonflux.io/api/sync'],
  },
  {
    name: 'explorer.etc.zelcore.io',
    type: 'blockbook',
    urls: ['https://explorer.etc.zelcore.io/api/v2/address/0x0e009d19cb4693fcf2d15aaf4a5ee1c8a0bb5ecf?pageSize=50', 'https://explorer.etc.zelcore.io/api/sync'],
  },
  {
    name: 'blockbook.btc.zelcore.io',
    type: 'blockbook',
    urls: ['https://blockbook.btc.zelcore.io/api/v2/address/1BWqwKwQNKDY4MYJuMbxGsXP2LbuNGzQ4m?pageSize=50', 'https://blockbook.btc.zelcore.io/api/sync'],
  },
  {
    name: 'blockbook.ltc.zelcore.io',
    type: 'blockbook',
    urls: ['https://blockbook.ltc.zelcore.io/api/v2/address/LVjoCYFESyTbKAEU5VbFYtb9EYyBXx55V5?pageSize=50', 'https://blockbook.ltc.zelcore.io/api/sync'],
  },
  {
    name: 'blockbook.sin.zelcore.io',
    type: 'blockbook',
    urls: ['https://blockbook.sin.zelcore.io/api/v2/address/SXoqyAiZ6gQjafKmSnb2pmfwg7qLC8r4Sf?pageSize=50', 'https://blockbook.sin.zelcore.io/api/sync'],
  },
  {
    name: 'blockbook.zec.zelcore.io',
    type: 'blockbook',
    urls: ['https://blockbook.zec.zelcore.io/api/v2/address/t1UPSwfMYLe18ezbCqnR5QgdJGznzCUYHkj?pageSize=50', 'https://blockbook.zec.zelcore.io/api/sync'],
  },
  {
    name: 'explorer.tbtc.zelcore.io',
    type: 'blockbook',
    urls: ['https://explorer.tbtc.zelcore.io/api/v2/address/mr2oEP2PBLenqU1vcvaL6njhtLCcKvhtMe?pageSize=50', 'https://explorer.tbtc.zelcore.io/api/sync'],
  },
  {
    name: 'explorer.vtc.zelcore.io',
    type: 'blockbook',
    urls: ['https://explorer.vtc.zelcore.io/api/v2/address/VbFrQgNEiR8ZxMh9WmkjJu9kkqjJA6imdD?pageSize=50', 'https://explorer.vtc.zelcore.io/api/sync'],
  },
  {
    name: 'proxy.genx.zelcore.io',
    type: 'electrumx',
    urls: ['https://proxy.genx.zelcore.io/?server=127.0.0.1&port=50002&contype=tls&coin=genesis&call=nicehistory&param=CSyjWNHUFNC4xVSjb6vsrP9QeTpKNRMLZP'],
  },
  {
    name: 'proxy.btx.zelcore.io',
    type: 'electrumx',
    urls: ['https://proxy.btx.zelcore.io/?server=127.0.0.1&port=55002&contype=tls&coin=bitcore&call=nicehistory&param=2PXeteqGVrcAWexZycbujFLjurNjXhqDXo'],
  },
  {
    name: 'proxy.grs.zelcore.io',
    type: 'electrumx',
    urls: ['https://proxy.grs.zelcore.io/?server=127.0.0.1&port=56002&contype=tls&coin=groestlcoin&call=nicehistory&param=FfgZPEfmvou5VxZRnTbRjPKhgVsrx7Qjq9'],
  },
  {
    name: 'proxy.dgb.zelcore.io',
    type: 'electrumx',
    urls: ['https://proxy.dgb.zelcore.io/?server=127.0.0.1&port=50002&contype=tls&coin=digibyte&call=nicehistory&param=DFewUat3fj7pbMiudwbWpdgyuULCiVf6q8'],
  },
  {
    name: 'proxy.doge.zelcore.io',
    type: 'electrumx',
    urls: ['https://proxy.doge.zelcore.io/?server=127.0.0.1&port=55002&contype=tls&coin=dogecoin&call=nicehistory&param=DFewUat3fj7pbMiudwbWpdgyuULCiVf6q8'],
  },
  {
    name: 'proxy.bth.zelcore.io',
    type: 'electrumx',
    urls: ['https://proxy.bth.zelcore.io/?server=127.0.0.1&port=50002&contype=tls&coin=bithereum&call=nicehistory&param=BExvZ3Pc7poSWC2UWqvvQ1L3kx3VDdrERo'],
  },
  {
    name: 'proxy.rtm.zelcore.io',
    type: 'electrumx',
    urls: ['https://proxy.rtm.zelcore.io/?server=127.0.0.1&port=50002&contype=tls&coin=raptoreum&call=nicehistory&param=RKo31qpgy9278MuWNXb5NPranc4W6oaUFf'],
  },
  {
    name: 'proxy.runonflux.io',
    type: 'electrumx',
    urls: ['https://proxy.runonflux.io/?server=127.0.0.1&port=50002&contype=tls&coin=zelcash&call=nicehistory&param=t3c51GjrkUg7pUiS8bzNdTnW2hD25egWUih'],
  },
  {
    name: 'electrumx.runonflux.io',
    type: 'electrumx',
    urls: ['https://proxy.runonflux.io/?server=electrumx.runonflux.io&port=50002&contype=tls&coin=zelcash&call=nicehistory&param=t3c51GjrkUg7pUiS8bzNdTnW2hD25egWUih'],
  },
  {
    name: 'electrumx2.runonflux.io',
    type: 'electrumx',
    urls: ['https://proxy.runonflux.io/?server=electrumx2.runonflux.io&port=50002&contype=tls&coin=zelcash&call=nicehistory&param=t3c51GjrkUg7pUiS8bzNdTnW2hD25egWUih'],
  },
  {
    name: 'explorer.genx.zelcore.io',
    type: 'explorer',
    urls: ['https://explorer.genx.zelcore.io'],
  },
  {
    name: 'explorer.grs.zelcore.io',
    type: 'explorer',
    urls: ['https://explorer.grs.zelcore.io'],
  },
  {
    name: 'explorer.dgb.zelcore.io',
    type: 'explorer',
    urls: ['https://explorer.dgb.zelcore.io'],
  },
  {
    name: 'explorer.doge.zelcore.io',
    type: 'explorer',
    urls: ['https://explorer.doge.zelcore.io'],
  },
  {
    name: 'explorer.bth.zelcore.io',
    type: 'explorer',
    urls: ['https://explorer.bth.zelcore.io'],
  },
  {
    name: 'explorer.sin.zelcore.io',
    type: 'explorer',
    urls: ['https://explorer.sin.zelcore.io'],
  },
  {
    name: 'proxy.vbk.zelcore.io',
    type: 'veriblock',
    urls: ['https://proxy.vbk.zelcore.io/addressesbalance'],
    data: [{
      addresses: ['VBZ3J16cLrhxeEwZvswQSucfrFKvMF'],
    }],
  },
  {
    name: 'explorer.xmr.zelcore.io',
    type: 'explorer',
    urls: ['https://explorer.xmr.zelcore.io'],
  },
  {
    name: 'apt.runonflux.io',
    type: 'explorer',
    urls: ['https://apt.runonflux.io'],
  },
  {
    name: 'apt.zel.network',
    type: 'explorer',
    urls: ['https://apt.zel.network'],
  },
  {
    name: 'apt.fluxos.network',
    type: 'explorer',
    urls: ['https://apt.fluxos.network'],
  },
  {
    name: 'zelpro.zelcore.io',
    type: 'zelcoreplus',
    urls: ['https://zelpro.zelcore.io/prouser/1CbErtneaX2QVyUfwU7JGB7VzvPgrgc3uC'],
  },
  {
    name: 'cze.proxy.zelcore.io',
    type: 'explorer',
    urls: ['https://cze.proxy.zelcore.io/'],
  },
  {
    name: 'cze.proxy.zelcore.io',
    type: 'explorer',
    urls: ['https://cze.proxy.zelcore.io/'],
  },
  {
    name: 'fra.proxy.zelcore.io',
    type: 'explorer',
    urls: ['https://fra.proxy.zelcore.io/'],
  },
  {
    name: 'sgp.proxy.zelcore.io',
    type: 'explorer',
    urls: ['https://sgp.proxy.zelcore.io/'],
  },
  {
    name: 'ams.proxy.zelcore.io',
    type: 'explorer',
    urls: ['https://ams.proxy.zelcore.io/'],
  },
  {
    name: 'nyc.proxy.zelcore.io',
    type: 'explorer',
    urls: ['https://nyc.proxy.zelcore.io/'],
  },
  {
    name: 'sfo.proxy.zelcore.io',
    type: 'explorer',
    urls: ['https://sfo.proxy.zelcore.io/'],
  },
  {
    name: 'abe.proxy.zelcore.io',
    type: 'explorer',
    urls: ['https://abe.proxy.zelcore.io/'],
  },
  {
    name: 'proxy.nft.zelcore.io',
    type: 'explorer',
    urls: ['https://proxy.nft.zelcore.io/nft-proxy/v1/nfts/eth'],
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
    name: 'vipcrates.zelcore.io',
    type: 'rates',
    urls: ['https://vipcrates.zelcore.io/'],
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
    name: 'vipcrates.zelcore.io/marketsusd',
    type: 'markets',
    urls: ['https://vipcrates.zelcore.io/marketsusd'],
  },
  {
    name: 'backend.dot.zelcore.io',
    type: 'substrats',
    urls: ['https://backend.dot.zelcore.io/runtime'],
  },
  {
    name: 'backend.wnd.zelcore.io',
    type: 'substrats',
    urls: ['https://backend.wmd.zelcore.io/runtime'],
  },
  {
    name: 'backend.ksm.zelcore.io',
    type: 'substrats',
    urls: ['https://backend.ksm.zelcore.io/runtime'],
  },
  {
    name: 'backend.ada.zelcore.io',
    type: 'cardano',
    urls: ['https://backend.ada.zelcore.io/graphql'],
    data: [{
      query: '{ cardanoDbMeta { initialized syncPercentage }}',
    }],
  },
  {
    name: 'backend.ada.zelcore.io',
    type: 'cardano',
    urls: ['https://backend.ada.zelcore.io/graphql'],
    data: [{
      query: `query utxoSetForAddress($address: String!) {
        utxos(order_by: { value: desc }, where: { address: { _eq: $address } }) {
          txHash
          index
          value
        }
      }`,
      variables: {
        address: 'addr1qy8s6f3nunlw05anczrkgspys2pkx4p9aa0jlzhj2gl5pjq87gdf9tcy2xsn28xlye3dghklckhup56axkjqqzv5dc2s38tvpv',
      },
    }],
  },
  {
    name: 'backend3.ada.zelcore.io',
    type: 'cardano',
    urls: ['https://backend3.ada.zelcore.io/graphql'],
    data: [{
      query: '{ cardanoDbMeta { initialized syncPercentage }}',
    }],
  },
  {
    name: 'backend3.ada.zelcore.io',
    type: 'cardano',
    urls: ['https://backend3.ada.zelcore.io/graphql'],
    data: [{
      query: `query utxoSetForAddress($address: String!) {
        utxos(order_by: { value: desc }, where: { address: { _eq: $address } }) {
          txHash
          index
          value
        }
      }`,
      variables: {
        address: 'addr1qy8s6f3nunlw05anczrkgspys2pkx4p9aa0jlzhj2gl5pjq87gdf9tcy2xsn28xlye3dghklckhup56axkjqqzv5dc2s38tvpv',
      },
    }],
  },
  {
    name: 'backend2.ada.zelcore.io',
    type: 'cardano',
    urls: ['https://backend2.ada.zelcore.io/graphql'],
    data: [{
      query: '{ cardanoDbMeta { initialized syncPercentage }}',
    }],
  },
  {
    name: 'backend2.ada.zelcore.io',
    type: 'cardano',
    urls: ['https://backend2.ada.zelcore.io/graphql'],
    data: [{
      query: `query utxoSetForAddress($address: String!) {
        utxos(order_by: { value: desc }, where: { address: { _eq: $address } }) {
          txHash
          index
          value
        }
      }`,
      variables: {
        address: 'addr1qy8s6f3nunlw05anczrkgspys2pkx4p9aa0jlzhj2gl5pjq87gdf9tcy2xsn28xlye3dghklckhup56axkjqqzv5dc2s38tvpv',
      },
    }],
  },
  {
    name: 'backend4.ada.zelcore.io',
    type: 'cardano',
    urls: ['https://backend4.ada.zelcore.io/graphql'],
    data: [{
      query: '{ cardanoDbMeta { initialized syncPercentage }}',
    }],
  },
  {
    name: 'backend4.ada.zelcore.io',
    type: 'cardano',
    urls: ['https://backend4.ada.zelcore.io/graphql'],
    data: [{
      query: `query utxoSetForAddress($address: String!) {
        utxos(order_by: { value: desc }, where: { address: { _eq: $address } }) {
          txHash
          index
          value
        }
      }`,
      variables: {
        address: 'addr1qy8s6f3nunlw05anczrkgspys2pkx4p9aa0jlzhj2gl5pjq87gdf9tcy2xsn28xlye3dghklckhup56axkjqqzv5dc2s38tvpv',
      },
    }],
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
    name: 'stats.runonflux.io',
    type: 'stats',
    urls: ['https://stats.runonflux.io/fluxinfo'],
  },
  {
    name: 'api.zelcore.io/networkfees',
    type: 'fees',
    urls: ['https://api.zelcore.io/networkfees'],
  },
  {
    name: 'nitter.zelcore.io',
    type: 'explorer',
    urls: ['https://nitter.zelcore.io'],
  },
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
    name: 'explorer.zec.zelcore.io-ext',
    type: 'extendedInsight',
    urls: ['https://explorer.zec.zelcore.io/api/blocks?limit=1', 'https://explorer.zec.zelcore.io/api/txs/?block=', 'https://explorer.zec.zelcore.io/api/tx/'],
  },
  {
    name: 'home.runonflux.io',
    type: 'fdm',
    urls: ['https://home.runonflux.io/fluxstatistics'],
  },
  {
    name: 'fdm-eu-1-1.runonflux.io',
    type: 'fdm',
    urls: ['https://fdm-eu-1-1.runonflux.io/fluxstatistics'],
  },
  {
    name: 'fdm-us-1-1.runonflux.io',
    type: 'fdm',
    urls: ['https://fdm-us-1-1.runonflux.io/fluxstatistics'],
  },
  {
    name: 'fdm-eu-2-1.runonflux.io',
    type: 'fdm',
    urls: ['https://fdm-eu-2-1.runonflux.io/fluxstatistics'],
  },
  {
    name: 'fdm-us-2-1.runonflux.io',
    type: 'fdm',
    urls: ['https://fdm-us-2-1.runonflux.io/fluxstatistics'],
  },
  {
    name: 'kadena.app.runonflux.io',
    type: 'fdm',
    urls: ['https://kadena.app.runonflux.io/fluxstatistics'],
  },
  {
    name: 'kadena2.app.runonflux.io',
    type: 'fdm',
    urls: ['https://kadena2.app.runonflux.io/fluxstatistics'],
  },
];

async function checkServices() {
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
        await extendedInsightTest(check.urls[1], check.urls[1], check.urls[2], check.name);
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
      } else if (check.type === 'cardano') { // must have 1 url
        const responseA = await postRequest(check.urls[0], check.data[0]);
        checkCardano(responseA, check.name);
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
