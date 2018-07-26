'use strict'

module.exports = {
  bignum: {
    EXPONENTIAL_AT: 1e+9
  },
  burrow: {
    account: {
      method: {
        getAccounts: 'burrow.getAccounts',
        getAccount: 'burrow.getAccount',
        getStorage: 'burrow.getStorage',
        getStorageAt: 'burrow.getStorageAt'
      }
    },
    blockchain: {
      method: {
        getBcInfo: 'burrow.getBlockchainInfo',
        getChainId: 'burrow.getChainId',
        getGenesisHash: 'burrow.getGenesisHash',
        getLatestBlockHeight: 'burrow.getLatestBlockHeight',
        getLatestBlock: 'burrow.getLatestBlock',
        getBlocks: 'burrow.getBlocks',
        getBlock: 'burrow.getBlock',
        getBlockTxns: 'burrow.getBlockTransactions'
      }
    },
    transaction: {
      method: {
        send: 'burrow.send',
        sendNHold: 'burrow.sendAndHold',
        transact: 'burrow.transact',
        transactNHold: 'burrow.transactAndHold',
        transactNameReg: 'burrow.transactNameReg',
        broadcastTxn: 'burrow.broadcastTx',
        call: 'burrow.call',
        callCode: 'burrow.callCode'
      }
    }
  },
  keyPair: {
    addressLength: 40, // 20 bytes
    publicKeyLength: 64, // 32 bytes
    privateKeyLength: 128, // 64 bytes
    seedHashLength: 64 // 32 bytes
  }
}