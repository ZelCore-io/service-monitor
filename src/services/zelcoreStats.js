const request = require('request-promise-native');

function apiRequest(url) {
  return request({ uri: url, json: true })
    .then((response) => {
      return response
    })
    .catch((error) => {
      console.log("ERROR: " + url)
      return error
    })
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
      console.log("ERROR: " + url)
      return error
    })
}

function apiRequestPOST(url, data) {
  var options = {
    method: 'POST',
    uri: url,
    body: data,
    json: true
  };
  return request(options)
    .then((response) => {
      return response
    })
    .catch((error) => {
      console.log("ERROR: " + url)
      return error
    })
}

var zelcoreRates = {
  getAll() {
    return Promise.all([
      // explorer.runonflux.io
      apiRequest('https://explorer.runonflux.io/api/addr/t3c51GjrkUg7pUiS8bzNdTnW2hD25egWUih'), // 0
      apiRequest('https://explorer.runonflux.io/api/sync'), // 1
      // explorer2.zel.network
      apiRequest('https://explorer2.zel.network/api/addr/t3c51GjrkUg7pUiS8bzNdTnW2hD25egWUih'), // 2
      apiRequest('https://explorer2.zel.network/api/sync'), // 3
      // explorer2.zel.network
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
      apiRequest('https://explorer.btc.zelcore.io/api/addr/1BWqwKwQNKDY4MYJuMbxGsXP2LbuNGzQ4m'), // 32
      apiRequest('https://explorer.btc.zelcore.io/api/sync'), // 33
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
        addresses: ['VBZ3J16cLrhxeEwZvswQSucfrFKvMF']
      }), // 67

      // XMR explorer
      apiRequestExplorer('https://explorer.xmr.zelcore.io'), // 68

      // APT ZelCash
      apiRequestExplorer('https://apt.runonflux.io'), // 69

      // ZelPro database
      apiRequest('https://zelpro.zelcore.io/prouser/1CbErtneaX2QVyUfwU7JGB7VzvPgrgc3uC'), // 70

      //proxies
      apiRequestExplorer('https://cze.proxy.zelcore.io/'), // 71
      apiRequestExplorer('https://fra.proxy.zelcore.io/'), // 72
      apiRequestExplorer('https://sgp.proxy.zelcore.io/'), // 73
      apiRequestExplorer('https://ams.proxy.zelcore.io/'), // 74
      apiRequestExplorer('https://nyc.proxy.zelcore.io/'), // 75
      apiRequestExplorer('https://sfo.proxy.zelcore.io/'), // 76
      apiRequestExplorer('https://instaswap.zelcore.io/'), // 77

      // rates services
      apiRequest('https://vipbrates.zelcore.io/'), // 78
      apiRequest('https://vipcrates.zelcore.io/'), // 79
      apiRequest('https://vipdrates.zelcore.io/'), // 80

      // markets services
      apiRequest('https://vipbrates.zelcore.io/markets'), // 81
      apiRequest('https://vipcrates.zelcore.io/markets'), // 82
      apiRequest('https://vipdrates.zelcore.io/markets'), // 83

      // openmonero services TODO move up
      // BELDEX
      apiRequestPOST('https://backend.bdx.zelcore.io/get_address_info', {
        "address": "bxcFHfY3cRbSLB6FwxG3Dr7AX133Wjy4cZSiUEwVs2LJCheCAndAjwc6AB2fLFJ48UgKazGETTgV54jD58bCyVG63AVwuLVkV",
        "view_key": "72a386a316536e1d3494e030101240eddd06f23a75a1e275c9f6443e95898e09",
        "create_account": true,
        "generated_locally": true
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
      apiRequest('https://backend.ada.zelcore.io/mainnet/utxos/addr1q8n8r9ljwfjrudwpxhxs48st4npj6k904l4dzryz52cca38nmftl6t473mrp9k7cnveuexjd9nc09ntw4c3mfvlygdgspejkn7'), // 90

      // stats service
      apiRequest('https://stats.runonflux.io/fluxinfo'), // 91
      apiRequest('https://api.zelcore.io/networkfees'), // 91
      // END OF OUR SERVICES

      // THIRS PARTY SERVICES USED TODO


      // https://blockscout.com/etc/mainnet/api/?module=account&action=txlist&address=0x0e009d19cb4693fcf2d15aaf4a5ee1c8a0bb5ecf outside etc transactions

    ]).then((results) => {
      var ok = []
      var errors = []

      function checkInsight(i, j, name) {
        try {
          if (results[i] instanceof Error) {
            throw results[i]
          }
          if (results[j] instanceof Error) {
            throw results[j]
          }
          if (results[i].transactions.length > 0 && results[j].status === 'finished') {
            ok.push(name)
          } else {
            throw new Error(name, 500)
          }
        } catch (e) {
          errors.push(name)
        }
      }

      function checkBlockBook(i, j, name) {
        try {
          if (results[i] instanceof Error) {
            throw results[i]
          }
          if (results[j] instanceof Error) {
            throw results[j]
          }
          // or txs > 0 as txids may not be there
          if (results[i].txids.length > 0 && results[j].blockbook.inSync === true && results[j].blockbook.bestHeight === results[j].backend.blocks) { // last check not needed
            ok.push(name)
          } else {
            throw new Error(name, 500)
          }
        } catch (e) {
          errors.push(name)
        }
      }

      function checkElectrumx(i, name) {
        try {
          if (results[i] instanceof Error) {
            throw results[i]
          }
          if (results[i].length > 0) {
            ok.push(name)
          } else {
            throw new Error(name, 500)
          }
        } catch (e) {
          errors.push(name)
        }
      }

      function checkExplorer(i, name) {
        try {
          if (results[i] instanceof Error) {
            throw results[i]
          }
          ok.push(name)
        } catch (e) {
          errors.push(name)
        }
      }

      function checkVeriblockTransactions(i, name) {
        try {
          if (results[i] instanceof Error) {
            throw results[i]
          }
          if (results[i].length > 0) {
            ok.push(name)
          } else {
            throw new Error(name, 500)
          }
        } catch (e) {
          errors.push(name)
        }
      }

      function checkVeriblockBalance(i, name) {
        try {
          if (results[i] instanceof Error) {
            throw results[i]
          }
          const confirmedObject = results[i].result.confirmed.find((a) => a.address === 'VBZ3J16cLrhxeEwZvswQSucfrFKvMF');
          const confirmedBal = confirmedObject.unlockedAmount;
          console.log(confirmedBal)
          if (confirmedBal > 0) {
            ok.push(name)
          } else {
            throw new Error(name, 500)
          }
        } catch (e) {
          errors.push(name)
        }
      }

      function checkZelCorePlus(i, name) {
        try {
          if (results[i] instanceof Error) {
            throw results[i]
          }
          if (results[i].validTill === 1760216096000) {
            ok.push(name)
          } else {
            throw new Error(name, 500)
          }
        } catch (e) {
          errors.push(name)
        }
      }

      function checkRates(i, name) {
        try {
          if (results[i] instanceof Error) {
            throw results[i]
          }
          if (Object.keys(results[i][2].errors).length === 0) {
            ok.push(name)
          } else {
            throw new Error(name, 500)
          }
        } catch (e) {
          errors.push(name)
        }
      }

      function checkMarkets(i, name) {
        try {
          if (results[i] instanceof Error) {
            throw results[i]
          }
          if (Object.keys(results[i][1].errors).length === 0) {
            ok.push(name)
          } else {
            throw new Error(name, 500)
          }
        } catch (e) {
          errors.push(name)
        }
      }

      function checkOpenMonero(i, name) {
        try {
          if (results[i] instanceof Error) {
            throw results[i]
          }
          // console.log(results[i])
          const received = results[i].total_received;
          if (received > 0) {
            ok.push(name)
          } else {
            throw new Error(name, 500)
          }
        } catch (e) {
          errors.push(name)
        }
      }

      function checkSubstrate(i, name) {
        try {
          if (results[i] instanceof Error) {
            throw results[i]
          }
          const specVersion = results[i].result.specVersion;
          if (specVersion > 0 && typeof specVersion === 'number') {
            ok.push(name)
          } else {
            throw new Error(name, 500)
          }
        } catch (e) {
          errors.push(name)
        }
      }

      function checkCardano(i, name) {
        try {
          if (results[i] instanceof Error) {
            throw results[i]
          }
          const utxos = results[i];
          let balance = 0;
          utxos.forEach((utxo) => {
            balance += utxo.coin;
          });
          if (balance > 0) {
            ok.push(name)
          } else {
            throw new Error(name, 500)
          }
        } catch (e) {
          errors.push(name)
        }
      }

      function checkStats(i, name) {
        try {
          if (results[i] instanceof Error) {
            throw results[i]
          }
          const response = results[i];
          if (response.data.length > 500) {
            ok.push(name)
          } else {
            throw new Error(name, 500)
          }
        } catch (e) {
          errors.push(name)
        }
      }
      function checkFees(i, name) {
        try {
          if (results[i] instanceof Error) {
            throw results[i]
          }
          const response = results[i];
          if (response.length > 2 && response[2].normal > 40) {
            ok.push(name)
          } else {
            throw new Error(name, 500)
          }
        } catch (e) {
          errors.push(name)
        }
      }

      checkInsight(0, 1, 'explorer.runonflux.io');
      // checkInsight(2, 3, 'explorer2.zel.network');
      checkInsight(4, 5, 'explorer.flux.zelcore.io');
      checkInsight(6, 7, 'explorer.zelcash.online');
      // checkInsight(8, 9, 'explorer-asia.runonflux.io');
      checkInsight(10, 11, 'explorer.anon.zelcore.io');
      checkInsight(12, 13, 'explorer.dash.zelcore.io');
      checkInsight(14, 15, 'explorer.bze.zelcore.io');
      checkInsight(16, 17, 'explorer.zcoin.zelcore.io');
      checkInsight(18, 19, 'explorer.btcz.zelcore.io');
      checkInsight(20, 21, 'explorer.zer.zelcore.io');
      checkInsight(22, 23, 'explorer.kmd.zelcore.io');
      checkInsight(24, 25, 'explorer.rvn.zelcore.io');
      checkInsight(26, 27, 'explorer.zcl.zelcore.io');
      checkInsight(28, 29, 'explorer.safe.zelcore.io');
      checkInsight(30, 31, 'explorer.cmm.zelcore.io');
      checkInsight(32, 33, 'explorer.btc.zelcore.io');
      checkInsight(34, 35, 'explorer.zec.zelcore.io');
      checkInsight(36, 37, 'explorer.axe.zelcore.io');
      // checkInsight(38, 39, 'explorer.btx.zelcore.io');
      checkInsight(40, 41, 'explorer.ltc.zelcore.io');
      checkInsight(42, 43, 'explorer.xsg.zelcore.io');

      checkBlockBook(44, 45, 'blockbook.runonflux.io');
      checkBlockBook(46, 47, 'explorer.etc.zelcore.io');
      checkBlockBook(48, 49, 'blockbook.btc.zelcore.io');
      checkBlockBook(50, 51, 'blockbook.ltc.zelcore.io');
      checkBlockBook(85, 86, 'explorer.tbtc.zelcore.io');

      checkElectrumx(38, 'proxy.btx.zelcore.io');
      checkElectrumx(52, 'proxy.genx.zelcore.io');
      checkElectrumx(53, 'proxy.grs.zelcore.io');
      checkElectrumx(54, 'proxy.dgb.zelcore.io');
      checkElectrumx(55, 'proxy.doge.zelcore.io');
      checkElectrumx(56, 'proxy.bth.zelcore.io');
      checkElectrumx(57, 'proxy.sin.zelcore.io');
      checkElectrumx(58, 'proxy.runonflux.io');
      checkElectrumx(59, 'electrumx.runonflux.io');

      checkExplorer(39, 'explorer.btx.zelcore.io');
      checkExplorer(60, 'explorer.genx.zelcore.io');
      checkExplorer(61, 'explorer.grs.zelcore.io');
      checkExplorer(62, 'explorer.dgb.zelcore.io');
      checkExplorer(63, 'explorer.doge.zelcore.io');
      checkExplorer(64, 'explorer.bth.zelcore.io');
      checkExplorer(65, 'explorer.sin.zelcore.io');

      checkVeriblockTransactions(66, 'explorer.vbk.zelcore.io');
      checkVeriblockBalance(67, 'proxy.vbk.zelcore.io');

      checkExplorer(68, 'explorer.xmr.zelcore.io');

      checkExplorer(69, 'apt.runonflux.io');

      checkZelCorePlus(70, 'zelpro.zelcore.io');

      checkExplorer(71, 'cze.proxy.zelcore.io');
      checkExplorer(72, 'fra.proxy.zelcore.io');
      checkExplorer(73, 'sgp.proxy.zelcore.io');
      checkExplorer(74, 'ams.proxy.zelcore.io');
      // checkExplorer(75, 'nyc.proxy.zelcore.io');
      checkExplorer(76, 'sfo.proxy.zelcore.io');
      checkExplorer(77, 'instaswap.zelcore.io');

      checkRates(78, 'vipbrates.zelcore.io');
      checkRates(79, 'vipcrates.zelcore.io');
      checkRates(80, 'vipdrates.zelcore.io');

      checkMarkets(81, 'vipbrates.zelcore.io/markets');
      checkMarkets(82, 'vipcrates.zelcore.io/markets');
      checkMarkets(83, 'vipdrates.zelcore.io/markets');

      checkOpenMonero(84, 'backend.bdx.zelcore.io');

      checkSubstrate(87, 'backend.dot.zelcore.io');
      checkSubstrate(88, 'backend.ksm.zelcore.io');
      checkSubstrate(89, 'backend.wnd.zelcore.io');
      checkCardano(90, 'backend.ada.zelcore.io');

      checkStats(91, 'stats.runonflux.io');
      checkFees(91, 'api.zelcore.io/networkfees');

      const statuses = {};
      statuses.ok = ok;
      statuses.errors = errors;

      return statuses;
    });
  },
};

module.exports = zelcoreRates;
