const request = require('request-promise-native');

function apiRequest(url) {
  return request({ uri: url, json: true })
    .then((response) => response)
    .catch((error) => {
      console.log(`ERROR: ${url}`);
      return error;
    });
}

function extendedInsightTest(url, blockUlr, txUrl) {
  return request({ uri: url, json: true })
    .then((res) => {
      const blockUrlAdjusted = blockUlr + res.blocks[0].hash;
      return request({ uri: blockUrlAdjusted, json: true })
        .then((res2) => {
          const { txid } = res2.txs[0];
          const adjustedUrlTx = txUrl + txid;
          return request({ uri: adjustedUrlTx, json: true })
            .then((res3) => {
              if (res3.confirmations < -2) {
                console.log('HERE');
                throw new Error(`Error: ${txUrl}`);
              }
              return res3;
            })
            .catch((error) => {
              console.log(`ERROR: ${txUrl}`);
              return error;
            });
        })
        .catch((error) => {
          console.log(`ERROR: ${blockUlr}`);
          return error;
        });
    })
    .catch((error) => {
      console.log(`ERROR: ${url}`);
      return error;
    });
}

function apiRequestExplorer(url) {
  return request({ uri: url, simple: false, resolveWithFullResponse: true })
    .then((response) => {
      if (response.statusCode !== 200 && response.statusCode !== 500) {
        throw new Error('Bad code');
      }
      return 'ok';
    })
    .catch((error) => {
      // console.log(error);
      console.log(`ERROR: ${url}`);
      return error;
    });
}

function apiRequestNitter(url) {
  return request({
    uri: url,
    simple: false,
    resolveWithFullResponse: true,
    headers: {
      zelcore: 'ZelCore-v5.19.6',
    },
  })
    .then((response) => {
      if (response.statusCode !== 200 && response.statusCode !== 500) {
        throw new Error('Bad code');
      }
      return 'ok';
    })
    .catch((error) => {
      console.log(error);
      console.log(`ERROR: ${url}`);
      return error;
    });
}

function apiRequestABE(url) {
  return request({
    uri: url,
    json: true,
    headers: {
      zelid: '1CbErtneaX2QVyUfwU7JGB7VzvPgrgc3uC',
    },
  })
    .then((response) => response)
    .catch((error) => {
      console.log(error);
      console.log(`ERROR: ${url}`);
      return error;
    });
}

function apiRequestFDM(url) {
  return request({ uri: url, simple: false, resolveWithFullResponse: true })
    .then((response) => {
      if (response.statusCode !== 200) {
        throw new Error('Bad code');
      }
      return response;
    })
    .catch((error) => {
      // console.log(error);
      console.log(`ERROR: ${url}`);
      return error;
    });
}

function apiRequestPOST(url, data) {
  const options = {
    method: 'POST',
    uri: url,
    body: data,
    json: true,
  };
  return request(options)
    .then((response) => response)
    .catch((error) => {
      console.log(error);
      console.log(`ERROR: ${url}`);
      return error;
    });
}

const zelcoreRates = {
  getAll() {
    return Promise.all([
      // explorer.runonflux.io
      apiRequest('https://explorer.runonflux.io/api/addr/t3c51GjrkUg7pUiS8bzNdTnW2hD25egWUih'), // 0
      apiRequest('https://explorer.runonflux.io/api/sync'), // 1
      // explorer2.flux.zelcore.io
      apiRequest('https://explorer2.flux.zelcore.io/api/addr/t3c51GjrkUg7pUiS8bzNdTnW2hD25egWUih'), // 2
      apiRequest('https://explorer2.flux.zelcore.io/api/sync'), // 3
      // explorer.flux.zelcore.io
      apiRequest('https://explorer.flux.zelcore.io/api/addr/t3c51GjrkUg7pUiS8bzNdTnW2hD25egWUih'), // 4
      apiRequest('https://explorer.flux.zelcore.io/api/sync'), // 5
      // explorer.zelcash.online
      apiRequest('https://explorer.zelcash.online/api/addr/t3c51GjrkUg7pUiS8bzNdTnW2hD25egWUih'), // 6
      apiRequest('https://explorer.zelcash.online/api/sync'), // 7
      // explorer-asia.runonflux.io
      apiRequest('https://explorer-asia.runonflux.io/api/addr/t3c51GjrkUg7pUiS8bzNdTnW2hD25egWUih'), // 8
      apiRequest('https://explorer-asia.runonflux.io/api/sync'), // 9
      // explorer.anon.zelcore.io
      apiRequest('https://explorer.anon.zelcore.io/api/addr/AnY5LGSDdUgawBW8TQuFL1fJeTbswo65xeK'), // 10
      apiRequest('https://explorer.anon.zelcore.io/api/sync'), // 11
      // explorer.dash.zelcore.io
      apiRequest('https://explorer.dash.zelcore.io/api/addr/XmCgmabJL2S8DJ8tmEvB8QDArgBbSSMJea'), // 12
      apiRequest('https://explorer.dash.zelcore.io/api/sync'), // 13
      // explorer.bze.zelcore.io
      apiRequest('https://explorer.bze.zelcore.io/api/addr/t1UPSwfMYLe18ezbCqnR5QgdJGznzCUYHkj'), // 14
      apiRequest('https://explorer.bze.zelcore.io/api/sync'), // 15
      // explorer.zcoin.zelcore.io
      apiRequest('https://explorer.zcoin.zelcore.io/api/addr/aBEJgEP2b7DP7tyQukv639qtdhjFhWp2QE'), // 16
      apiRequest('https://explorer.zcoin.zelcore.io/api/sync'), // 17
      // explorer.btcz.zelcore.io
      apiRequest('https://explorer.btcz.zelcore.io/api/addr/t1UPSwfMYLe18ezbCqnR5QgdJGznzCUYHkj'), // 18
      apiRequest('https://explorer.btcz.zelcore.io/api/sync'), // 19
      // explorer.zer.zelcore.io
      apiRequest('https://explorer.zer.zelcore.io/api/addr/t1UPSwfMYLe18ezbCqnR5QgdJGznzCUYHkj'), // 20
      apiRequest('https://explorer.zer.zelcore.io/api/sync'), // 21
      // explorer.kmd.zelcore.io
      apiRequest('https://explorer.kmd.zelcore.io/api/addr/RKo31qpgy9278MuWNXb5NPranc4W6oaUFf'), // 22
      apiRequest('https://explorer.kmd.zelcore.io/api/sync'), // 23
      // explorer.rvn.zelcore.io
      apiRequest('https://explorer.rvn.zelcore.io/api/addr/RKo31qpgy9278MuWNXb5NPranc4W6oaUFf'), // 24
      apiRequest('https://explorer.rvn.zelcore.io/api/sync'), // 25
      // explorer.zcl.zelcore.io
      apiRequest('https://explorer.zcl.zelcore.io/api/addr/t1UPSwfMYLe18ezbCqnR5QgdJGznzCUYHkj'), // 26
      apiRequest('https://explorer.zcl.zelcore.io/api/sync'), // 27
      // explorer.safe.zelcore.io
      apiRequest('https://explorer.safe.zelcore.io/api/addr/Rj8dzx7ygKUywo3bPwvPrX8NR7KSmnKHca'), // 28
      apiRequest('https://explorer.safe.zelcore.io/api/sync'), // 29
      // explorer.cmm.zelcore.io
      apiRequest('https://explorer.cmm.zelcore.io/api/addr/CSyjWNHUFNC4xVSjb6vsrP9QeTpKNRMLZP'), // 30
      apiRequest('https://explorer.cmm.zelcore.io/api/sync'), // 31
      // explorer.btc.zelcore.io
      apiRequest('https://explorer.btc.zelcore.io/api/addr/12ib7dApVFvg82TXKycWBNpN8kFyiAN1dr/utxo'), // 32
      apiRequest('https://explorer.btc.zelcore.io/api/status'), // 33
      // explorer.zec.zelcore.io
      apiRequest('https://explorer.zec.zelcore.io/api/addr/t1UPSwfMYLe18ezbCqnR5QgdJGznzCUYHkj'), // 34
      apiRequest('https://explorer.zec.zelcore.io/api/sync'), // 35
      // explorer.axe.zelcore.io
      apiRequest('https://explorer.axe.zelcore.io/api/addr/PK726JLFREhj3CD5FRvUwmVee5mnX7g4ia'), // 36
      apiRequest('https://explorer.axe.zelcore.io/api/sync'), // 37
      // explorer.btx.zelcore.io was migrated to Electrumx
      apiRequest('https://proxy.btx.zelcore.io/?server=127.0.0.1&port=55002&contype=tls&coin=bitcore&call=nicehistory&param=2PXeteqGVrcAWexZycbujFLjurNjXhqDXo'), // 38
      apiRequestExplorer('https://explorer.btx.zelcore.io'), // 39
      // apiRequest('https://explorer.btx.zelcore.io/api/addr/2PXeteqGVrcAWexZycbujFLjurNjXhqDXo'), // 38
      // apiRequest('https://explorer.btx.zelcore.io/api/sync'), // 39
      // explorer.ltc.zelcore.io
      apiRequest('https://explorer.ltc.zelcore.io/api/addr/LVjoCYFESyTbKAEU5VbFYtb9EYyBXx55V5'), // 40
      apiRequest('https://explorer.ltc.zelcore.io/api/sync'), // 41
      // explorer.xsg.zelcore.io
      apiRequest('https://explorer.xsg.zelcore.io/api/addr/s1XibA2S46fGxtaWjKNTBadS1eMh9s9eGrD'), // 42
      apiRequest('https://explorer.xsg.zelcore.io/api/sync'), // 43

      // blockbook.runonflux.io
      apiRequest('https://blockbook.runonflux.io/api/v2/address/t1UPSwfMYLe18ezbCqnR5QgdJGznzCUYHkj?pageSize=50'), // 44
      apiRequest('https://blockbook.runonflux.io/api/sync'), // 45
      // explorer.etc.zelcore.io // blockbook
      apiRequest('https://explorer.etc.zelcore.io/api/v2/address/0x0e009d19cb4693fcf2d15aaf4a5ee1c8a0bb5ecf?pageSize=50'), // 46
      apiRequest('https://explorer.etc.zelcore.io/api/sync'), // 47
      // blockbook.btc.zelcore.io
      apiRequest('https://blockbook.btc.zelcore.io/api/v2/address/1BWqwKwQNKDY4MYJuMbxGsXP2LbuNGzQ4m?pageSize=50'), // 48
      apiRequest('https://blockbook.btc.zelcore.io/api/sync'), // 49
      // blockbook.btc.zelcore.io
      apiRequest('https://blockbook.ltc.zelcore.io/api/v2/address/LVjoCYFESyTbKAEU5VbFYtb9EYyBXx55V5?pageSize=50'), // 50
      apiRequest('https://blockbook.ltc.zelcore.io/api/sync'), // 51

      // GENX check. Just one check to check proxy, node, electrumx
      apiRequest('https://proxy.genx.zelcore.io/?server=127.0.0.1&port=50002&contype=tls&coin=genesis&call=nicehistory&param=CSyjWNHUFNC4xVSjb6vsrP9QeTpKNRMLZP'), // 52
      // GRS check. Just one check to check proxy, node, electrumx
      apiRequest('https://proxy.grs.zelcore.io/?server=127.0.0.1&port=56002&contype=tls&coin=groestlcoin&call=nicehistory&param=FfgZPEfmvou5VxZRnTbRjPKhgVsrx7Qjq9'), // 53
      // DGB check. Just one check to check proxy, node, electrumx
      apiRequest('https://proxy.dgb.zelcore.io/?server=127.0.0.1&port=50002&contype=tls&coin=digibyte&call=nicehistory&param=DFewUat3fj7pbMiudwbWpdgyuULCiVf6q8'), // 54
      // DOGE check. Just one check to check proxy, node, electrumx
      apiRequest('https://proxy.doge.zelcore.io/?server=127.0.0.1&port=55002&contype=tls&coin=dogecoin&call=nicehistory&param=DFewUat3fj7pbMiudwbWpdgyuULCiVf6q8'), // 55
      // BTH check. Just one check to check proxy, node, electrumx
      apiRequest('https://proxy.bth.zelcore.io/?server=127.0.0.1&port=50002&contype=tls&coin=bithereum&call=nicehistory&param=BExvZ3Pc7poSWC2UWqvvQ1L3kx3VDdrERo'), // 56
      // SIN check. Just one check to check proxy, node, electrumx
      apiRequest('https://proxy.sin.zelcore.io/?server=127.0.0.1&port=50002&contype=tls&coin=sinovate&call=nicehistory&param=SXoqyAiZ6gQjafKmSnb2pmfwg7qLC8r4Sf'), // 57
      // ZEL check. Just one check to check proxy, node, electrumx
      apiRequest('https://proxy.runonflux.io/?server=127.0.0.1&port=50002&contype=tls&coin=zelcash&call=nicehistory&param=t3c51GjrkUg7pUiS8bzNdTnW2hD25egWUih'), // 58
      // ZEL check 2. Just one check to check proxy, node, electrumx
      apiRequest('https://proxy.runonflux.io/?server=electrumx.runonflux.io&port=50002&contype=tls&coin=zelcash&call=nicehistory&param=t3c51GjrkUg7pUiS8bzNdTnW2hD25egWUih'), // 59

      // GENX explorer
      apiRequestExplorer('https://explorer.genx.zelcore.io'), // 60
      // GRS explorer
      apiRequestExplorer('https://explorer.grs.zelcore.io'), // 61
      // DGB explorer
      apiRequestExplorer('https://explorer.dgb.zelcore.io'), // 62
      // DOGE explorer
      apiRequestExplorer('https://explorer.doge.zelcore.io'), // 63
      // BTH explorer
      apiRequestExplorer('https://explorer.bth.zelcore.io'), // 64
      // SIN explorer
      apiRequestExplorer('https://explorer.sin.zelcore.io'), // 65

      // VBK transactions
      apiRequest('https://explorer.vbk.zelcore.io/api/address/VBZ3J16cLrhxeEwZvswQSucfrFKvMF/transaction-normal?count=50'), // 66

      // VBK balance - node and its proxy
      apiRequestPOST('https://proxy.vbk.zelcore.io/addressesbalance', {
        addresses: ['VBZ3J16cLrhxeEwZvswQSucfrFKvMF'],
      }), // 67

      // XMR explorer
      apiRequestExplorer('https://explorer.xmr.zelcore.io'), // 68

      // APT ZelCash
      apiRequestExplorer('https://apt.runonflux.io'), // 69

      // ZelPro database
      apiRequest('https://zelpro.zelcore.io/prouser/1CbErtneaX2QVyUfwU7JGB7VzvPgrgc3uC'), // 70

      // proxies
      apiRequestExplorer('https://cze.proxy.zelcore.io/'), // 71
      apiRequestExplorer('https://fra.proxy.zelcore.io/'), // 72
      apiRequestExplorer('https://sgp.proxy.zelcore.io/'), // 73
      apiRequestExplorer('https://ams.proxy.zelcore.io/'), // 74
      apiRequestExplorer('https://nyc.proxy.zelcore.io/'), // 75
      apiRequestExplorer('https://sfo.proxy.zelcore.io/'), // 76
      apiRequestExplorer('https://abe.proxy.zelcore.io/'), // 77

      // rates services
      apiRequest('https://vipbrates.zelcore.io/'), // 78
      apiRequest('https://vipcrates.zelcore.io/'), // 79
      apiRequest('https://vipdrates.zelcore.io/'), // 80

      // markets services
      apiRequest('https://vipbrates.zelcore.io/marketsusd'), // 81
      apiRequest('https://vipcrates.zelcore.io/marketsusd'), // 82
      apiRequest('https://vipdrates.zelcore.io/marketsusd'), // 83

      // openmonero services TODO move up
      // BELDEX
      apiRequestPOST('https://backend.bdx.zelcore.io/get_address_info', {
        address: 'bxcFHfY3cRbSLB6FwxG3Dr7AX133Wjy4cZSiUEwVs2LJCheCAndAjwc6AB2fLFJ48UgKazGETTgV54jD58bCyVG63AVwuLVkV',
        view_key: '72a386a316536e1d3494e030101240eddd06f23a75a1e275c9f6443e95898e09',
        create_account: true,
        generated_locally: true,
      }), // 84

      // explorer.tbtc.zelcore.io
      apiRequest('https://explorer.tbtc.zelcore.io/api/v2/address/mr2oEP2PBLenqU1vcvaL6njhtLCcKvhtMe?pageSize=50'), // 85
      apiRequest('https://explorer.tbtc.zelcore.io/api/sync'), // 86

      // PolkaDot
      apiRequest('https://backend.dot.zelcore.io/runtime'), // 87
      // Kusama
      apiRequest('https://backend.ksm.zelcore.io/runtime'), // 88
      // Westend
      apiRequest('https://backend.wnd.zelcore.io/runtime'), // 89

      // Cardano
      apiRequestPOST('https://backend.ada.zelcore.io/graphql', {
        query: '{ cardanoDbMeta { initialized syncPercentage }}',
      }), // 90
      apiRequestPOST('https://backend.ada.zelcore.io/graphql', {
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
      }), // 91

      // stats service
      apiRequest('https://stats.runonflux.io/fluxinfo'), // 92
      apiRequest('https://api.zelcore.io/networkfees'), // 93

      extendedInsightTest('https://explorer.zec.zelcore.io/api/blocks?limit=1', 'https://explorer.zec.zelcore.io/api/txs/?block=', 'https://explorer.zec.zelcore.io/api/tx/'), // 94
      extendedInsightTest('https://explorer.bze.zelcore.io/api/blocks?limit=1', 'https://explorer.bze.zelcore.io/api/txs/?block=', 'https://explorer.bze.zelcore.io/api/tx/'), // 95

      // RTM check. Just one check to check proxy, node, electrumx
      apiRequest('https://proxy.rtm.zelcore.io/?server=127.0.0.1&port=50002&contype=tls&coin=raptoreum&call=nicehistory&param=RKo31qpgy9278MuWNXb5NPranc4W6oaUFf'), // 96
      // VTC
      apiRequest('https://explorer.vtc.zelcore.io/api/v2/address/VbFrQgNEiR8ZxMh9WmkjJu9kkqjJA6imdD?pageSize=50'), // 97
      apiRequest('https://explorer.vtc.zelcore.io/api/sync'), // 98
      apiRequest('https://proxy.runonflux.io/?server=electrumx2.runonflux.io&port=50002&contype=tls&coin=zelcash&call=nicehistory&param=t3c51GjrkUg7pUiS8bzNdTnW2hD25egWUih'), // 99

      // Cardano
      apiRequestPOST('https://backend2.ada.zelcore.io/graphql', {
        query: '{ cardanoDbMeta { initialized syncPercentage }}',
      }), // 100
      apiRequestPOST('https://backend2.ada.zelcore.io/graphql', {
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
      }), // 101

      // FDMs
      apiRequestFDM('https://home.runonflux.io/fluxstatistics'), // 102
      apiRequestFDM('https://fdm-1.runonflux.io/fluxstatistics'), // 103
      apiRequestFDM('https://fdm-2.runonflux.io/fluxstatistics'), // 104
      apiRequestFDM('https://fdm-3.runonflux.io/fluxstatistics'), // 105
      apiRequestFDM('https://fdm-4.runonflux.io/fluxstatistics'), // 106
      apiRequestFDM('https://kadena.app.runonflux.io/fluxstatistics'), // 107
      apiRequestFDM('https://kadena2.app.runonflux.io/fluxstatistics'), // 108
      apiRequest('https://hashes.runonflux.io'), // 109

      apiRequest('https://blockbook.sin.zelcore.io/api/v2/address/SXoqyAiZ6gQjafKmSnb2pmfwg7qLC8r4Sf?pageSize=50'), // 110
      apiRequest('https://blockbook.sin.zelcore.io/api/sync'), // 111

      // Cardano
      apiRequestPOST('https://backend3.ada.zelcore.io/graphql', {
        query: '{ cardanoDbMeta { initialized syncPercentage }}',
      }), // 112
      apiRequestPOST('https://backend3.ada.zelcore.io/graphql', {
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
      }), // 113

      apiRequestNitter('https://nitter.zelcore.io'), // 114

      // Cardano
      apiRequestPOST('https://backend4.ada.zelcore.io/graphql', {
        query: '{ cardanoDbMeta { initialized syncPercentage }}',
      }), // 115
      apiRequestPOST('https://backend4.ada.zelcore.io/graphql', {
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
      }), // 116
      apiRequestABE('https://abe.zelcore.io/v1/exchange/user/history'), // 117
      apiRequestABE('https://abe.zelcore.io/v1/exchange/sellassets'), // 118
      apiRequest('https://abe.zelcore.io/v1/serum/tickers'), // 119

      apiRequest('https://blockbook.zec.zelcore.io/api/v2/address/t1UPSwfMYLe18ezbCqnR5QgdJGznzCUYHkj?pageSize=50'), // 120
      apiRequest('https://blockbook.zec.zelcore.io/api/sync'), // 121

      // Ergo
      apiRequestPOST('https://graphql.erg.zelcore.io', {
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
      }), // 122
      // END OF OUR SERVICES

      // THIRS PARTY SERVICES USED TODO

      // https://blockscout.com/etc/mainnet/api/?module=account&action=txlist&address=0x0e009d19cb4693fcf2d15aaf4a5ee1c8a0bb5ecf outside etc transactions
    ]).then((results) => {
      const ok = [];
      const errors = [];

      function checkInsight(i, j, name) {
        try {
          if (results[i] instanceof Error) {
            throw results[i];
          }
          if (results[j] instanceof Error) {
            throw results[j];
          }
          if (results[i].transactions.length > 0 && results[j].status === 'finished') {
            ok.push(name);
          } else {
            throw new Error(name, 500);
          }
        } catch (e) {
          errors.push(name);
        }
      }

      function checkInsightProxyBTC(i, j, name) { // tests proxy
        try {
          if (results[i] instanceof Error) {
            throw results[i];
          }
          if (results[j] instanceof Error) {
            throw results[j];
          }
          if (Array.isArray(results[i]) && results[i].length > 1 && results[j].info.blocks > 722564) {
            ok.push(name);
          } else {
            throw new Error(name, 500);
          }
        } catch (e) {
          errors.push(name);
        }
      }

      function checkExtendedInsight(i, j, k, name) {
        try {
          if (results[i] instanceof Error) {
            throw results[i];
          }
          if (results[j] instanceof Error) {
            throw results[j];
          }
          if (results[k] instanceof Error) {
            throw results[k];
          }
          if (results[i].transactions.length > 0 && results[j].status === 'finished') {
            ok.push(name);
          } else {
            throw new Error(name, 500);
          }
        } catch (e) {
          errors.push(name);
        }
      }

      function checkBlockBook(i, j, name) {
        try {
          if (results[i] instanceof Error) {
            throw results[i];
          }
          if (results[j] instanceof Error) {
            throw results[j];
          }
          // or txs > 0 as txids may not be there
          if (results[i].txids.length > 0 && results[j].blockbook.inSync === true && results[j].blockbook.bestHeight > (results[j].backend.blocks - 100)) { // last check not needed
            ok.push(name);
          } else {
            throw new Error(name, 500);
          }
        } catch (e) {
          errors.push(name);
        }
      }

      function checkElectrumx(i, name) {
        try {
          if (results[i] instanceof Error) {
            throw results[i];
          }
          if (results[i].length > 0) {
            ok.push(name);
          } else {
            throw new Error(name, 500);
          }
        } catch (e) {
          errors.push(name);
        }
      }

      function checkExplorer(i, name) {
        try {
          if (results[i] instanceof Error) {
            throw results[i];
          }
          ok.push(name);
        } catch (e) {
          errors.push(name);
        }
      }

      // function checkVeriblockTransactions(i, name) {
      //   try {
      //     if (results[i] instanceof Error) {
      //       throw results[i];
      //     }
      //     if (results[i].length > 0) {
      //       ok.push(name);
      //     } else {
      //       throw new Error(name, 500);
      //     }
      //   } catch (e) {
      //     errors.push(name);
      //   }
      // }

      function checkVeriblockBalance(i, name) {
        try {
          if (results[i] instanceof Error) {
            throw results[i];
          }
          const confirmedObject = results[i].result.confirmed.find((a) => a.address === 'VBZ3J16cLrhxeEwZvswQSucfrFKvMF');
          const confirmedBal = confirmedObject.unlockedAmount;
          if (confirmedBal > 0) {
            ok.push(name);
          } else {
            throw new Error(name, 500);
          }
        } catch (e) {
          errors.push(name);
        }
      }

      function checkZelCorePlus(i, name) {
        try {
          if (results[i] instanceof Error) {
            throw results[i];
          }
          if (results[i].validTill === 1760216096000) {
            ok.push(name);
          } else {
            throw new Error(name, 500);
          }
        } catch (e) {
          errors.push(name);
        }
      }

      function checkRates(i, name) {
        try {
          if (results[i] instanceof Error) {
            throw results[i];
          }
          if (Object.keys(results[i][2].errors).length === 0) {
            ok.push(name);
          } else {
            throw new Error(name, 500);
          }
        } catch (e) {
          errors.push(name);
        }
      }

      function checkMarkets(i, name) {
        try {
          if (results[i] instanceof Error) {
            throw results[i];
          }
          if (Object.keys(results[i][1].errors).length === 0) {
            ok.push(name);
          } else {
            throw new Error(name, 500);
          }
        } catch (e) {
          errors.push(name);
        }
      }

      // eslint-disable-next-line no-unused-vars
      function checkOpenMonero(i, name) {
        try {
          if (results[i] instanceof Error) {
            throw results[i];
          }
          // console.log(results[i])
          const received = results[i].total_received;
          if (received > 0) {
            ok.push(name);
          } else {
            throw new Error(name, 500);
          }
        } catch (e) {
          errors.push(name);
        }
      }

      function checkSubstrate(i, name) {
        try {
          if (results[i] instanceof Error) {
            throw results[i];
          }
          const { specVersion } = results[i].result;
          if (specVersion > 0 && typeof specVersion === 'number') {
            ok.push(name);
          } else {
            throw new Error(name, 500);
          }
        } catch (e) {
          errors.push(name);
        }
      }

      function checkCardano(i, j, name) {
        try {
          if (results[i] instanceof Error) {
            throw results[i];
          }
          if (results[j] instanceof Error) {
            throw results[j];
          }
          const sync = results[i].data.cardanoDbMeta.syncPercentage;
          const { utxos } = results[j].data;
          if (utxos[0].value > 100) {
            if (sync === 100) {
              ok.push(name);
            } else {
              throw new Error(name, 500);
            }
          } else {
            throw new Error(name, 500);
          }
        } catch (e) {
          errors.push(name);
        }
      }

      function checkErgo(j, name) {
        try {
          if (results[j] instanceof Error) {
            throw results[j];
          }
          const { boxes } = results[j].data;
          if (boxes[0].value > 100) {
            ok.push(name);
          } else {
            throw new Error(name, 500);
          }
        } catch (e) {
          errors.push(name);
        }
      }

      function checkABE(i, j, name) {
        try {
          if (results[i] instanceof Error) {
            throw results[i];
          }
          if (results[j] instanceof Error) {
            throw results[j];
          }
          const history = results[i].data;
          const statusA = results[i].status;
          if (history.length < 420) {
            throw new Error(name, 500);
          }
          if (statusA !== 'success') {
            throw new Error(name, 500);
          }
          const sellassets = results[j].data;
          const { status } = results[j];
          if (sellassets.length > 100 && status === 'success') {
            ok.push(name);
          } else {
            throw new Error(name, 500);
          }
        } catch (e) {
          errors.push(name);
        }
      }

      function checkSerum(i, name) {
        try {
          if (results[i] instanceof Error) {
            throw results[i];
          }
          const response = results[i];
          if (response.data.length > 100) {
            ok.push(name);
          } else {
            throw new Error(name, 500);
          }
        } catch (e) {
          errors.push(name);
        }
      }

      function checkStats(i, name) {
        try {
          if (results[i] instanceof Error) {
            throw results[i];
          }
          const response = results[i];
          if (response.data.length > 500) {
            ok.push(name);
          } else {
            throw new Error(name, 500);
          }
        } catch (e) {
          errors.push(name);
        }
      }
      function checkHashes(i, name) {
        try {
          if (results[i] instanceof Error) {
            throw results[i];
          }
          const response = results[i];
          if (response.length >= 1) {
            ok.push(name);
          } else {
            throw new Error(name, 500);
          }
        } catch (e) {
          errors.push(name);
        }
      }
      function checkFees(i, name) {
        try {
          if (results[i] instanceof Error) {
            throw results[i];
          }
          const response = results[i];
          if (response.length > 2 && response[2].normal > 9) {
            ok.push(name);
          } else {
            throw new Error(name, 500);
          }
        } catch (e) {
          errors.push(name);
        }
      }

      function checkFDM(i, name) {
        try {
          if (results[i] instanceof Error) {
            throw results[i];
          }
          const response = results[i].body;
          const position = response.search('<b>uptime = </b>');
          const substr = response.substr(position, 40);
          const hPosition = substr.search('h');
          const timePosition = hPosition - 1;
          const numberOfHours = substr[timePosition];
          if (numberOfHours === '0' || numberOfHours === '1') {
            ok.push(name);
          } else {
            throw new Error(name, 500);
          }
        } catch (e) {
          errors.push(name);
        }
      }

      checkInsight(0, 1, 'explorer.runonflux.io');
      checkInsight(2, 3, 'explorer2.flux.zelcore.io');
      checkInsight(4, 5, 'explorer.flux.zelcore.io');
      checkInsight(6, 7, 'explorer.zelcash.online');
      // checkInsight(8, 9, 'explorer-asia.runonflux.io');
      checkInsight(10, 11, 'explorer.anon.zelcore.io');
      checkInsight(12, 13, 'explorer.dash.zelcore.io');
      // checkExtendedInsight(14, 15, 95, 'explorer.bze.zelcore.io');
      checkInsight(16, 17, 'explorer.zcoin.zelcore.io');
      checkInsight(18, 19, 'explorer.btcz.zelcore.io');
      checkInsight(20, 21, 'explorer.zer.zelcore.io');
      checkInsight(22, 23, 'explorer.kmd.zelcore.io');
      checkInsight(24, 25, 'explorer.rvn.zelcore.io');
      checkInsight(26, 27, 'explorer.zcl.zelcore.io');
      // checkInsight(28, 29, 'explorer.safe.zelcore.io');
      checkInsight(30, 31, 'explorer.cmm.zelcore.io');
      checkInsightProxyBTC(32, 33, 'explorer.btc.zelcore.io');
      checkExtendedInsight(34, 35, 94, 'explorer.zec.zelcore.io');
      checkInsight(36, 37, 'explorer.axe.zelcore.io');
      // checkInsight(38, 39, 'explorer.btx.zelcore.io');
      checkInsight(40, 41, 'explorer.ltc.zelcore.io');
      // checkInsight(42, 43, 'explorer.xsg.zelcore.io');

      checkBlockBook(44, 45, 'blockbook.runonflux.io');
      checkBlockBook(46, 47, 'explorer.etc.zelcore.io');
      checkBlockBook(48, 49, 'blockbook.btc.zelcore.io');
      checkBlockBook(50, 51, 'blockbook.ltc.zelcore.io');
      checkBlockBook(85, 86, 'explorer.tbtc.zelcore.io');
      checkBlockBook(97, 98, 'explorer.vtc.zelcore.io');
      checkBlockBook(110, 111, 'blockbook.sin.zelcore.io');
      checkBlockBook(120, 121, 'blockbook.zec.zelcore.io');

      checkElectrumx(38, 'proxy.btx.zelcore.io');
      checkElectrumx(52, 'proxy.genx.zelcore.io');
      checkElectrumx(53, 'proxy.grs.zelcore.io');
      checkElectrumx(54, 'proxy.dgb.zelcore.io');
      checkElectrumx(55, 'proxy.doge.zelcore.io');
      checkElectrumx(56, 'proxy.bth.zelcore.io');
      // checkElectrumx(57, 'proxy.sin.zelcore.io');
      checkElectrumx(58, 'proxy.runonflux.io');
      checkElectrumx(59, 'electrumx.runonflux.io');
      checkElectrumx(96, 'proxy.rtm.zelcore.io');
      checkElectrumx(99, 'electrumx2.runonflux.io');

      checkExplorer(39, 'explorer.btx.zelcore.io');
      checkExplorer(60, 'explorer.genx.zelcore.io');
      checkExplorer(61, 'explorer.grs.zelcore.io');
      checkExplorer(62, 'explorer.dgb.zelcore.io');
      checkExplorer(63, 'explorer.doge.zelcore.io');
      checkExplorer(64, 'explorer.bth.zelcore.io');
      // checkExplorer(65, 'explorer.sin.zelcore.io');

      // checkVeriblockTransactions(66, 'explorer.vbk.zelcore.io');
      checkVeriblockBalance(67, 'proxy.vbk.zelcore.io');

      checkExplorer(68, 'explorer.xmr.zelcore.io');

      checkExplorer(69, 'apt.runonflux.io');

      checkZelCorePlus(70, 'zelpro.zelcore.io');

      checkExplorer(71, 'cze.proxy.zelcore.io');
      checkExplorer(72, 'fra.proxy.zelcore.io');
      checkExplorer(73, 'sgp.proxy.zelcore.io');
      checkExplorer(74, 'ams.proxy.zelcore.io');
      checkExplorer(75, 'nyc.proxy.zelcore.io');
      checkExplorer(76, 'sfo.proxy.zelcore.io');
      checkExplorer(77, 'abe.proxy.zelcore.io');

      checkRates(78, 'vipbrates.zelcore.io');
      checkRates(79, 'vipcrates.zelcore.io');
      checkRates(80, 'vipdrates.zelcore.io');

      checkMarkets(81, 'vipbrates.zelcore.io/marketsusd');
      checkMarkets(82, 'vipcrates.zelcore.io/marketsusd');
      checkMarkets(83, 'vipdrates.zelcore.io/marketsusd');

      // checkOpenMonero(84, 'backend.bdx.zelcore.io');

      checkSubstrate(87, 'backend.dot.zelcore.io');
      checkSubstrate(88, 'backend.ksm.zelcore.io');
      checkSubstrate(89, 'backend.wnd.zelcore.io');
      checkCardano(90, 91, 'backend.ada.zelcore.io');
      checkCardano(100, 101, 'backend2.ada.zelcore.io');
      checkCardano(112, 113, 'backend3.ada.zelcore.io');
      checkCardano(115, 116, 'backend4.ada.zelcore.io');

      checkStats(92, 'stats.runonflux.io');
      checkFees(93, 'api.zelcore.io/networkfees');

      checkFDM(102, 'home.runonflux.io');
      checkFDM(103, 'fdm-1.runonflux.io');
      checkFDM(104, 'fdm-2.runonflux.io');
      checkFDM(105, 'fdm-3.runonflux.io');
      checkFDM(106, 'fdm-4.runonflux.io');
      checkFDM(107, 'kadena.app.runonflux.io');
      checkFDM(108, 'kadena2.app.runonflux.io');
      checkHashes(109, 'hashes.runonflux.io');
      checkExplorer(114, 'nitter.zelcore.io');
      checkABE(117, 118, 'abe.zelcore.io');
      checkSerum(119, 'serum.zelcore.io');

      checkErgo(122, 'graphql.erg.zelcore.io');

      const statuses = {};
      statuses.ok = ok;
      statuses.errors = errors;

      return statuses;
    });
  },
};

module.exports = zelcoreRates;
