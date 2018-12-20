'use strict'

module.exports = {
  bignum: {
    EXPONENTIAL_AT: 1e+9
  },
  gallactic: {
    account: {
      method: {
        getAccounts: 'gallactic.getAccounts',
        getAccount: 'gallactic.getAccount',
        getStorage: 'gallactic.getStorage',
        getStorageAt: 'gallactic.getStorageAt',
        getValidator: 'gallactic.getValidator',
        getValidators: 'gallactic.getValidators'
      }
    },
    blockchain: {
      method: {
        getBcInfo: 'gallactic.getBlockChainInfo',
        getChainId: 'gallactic.getChainId',
        getLatestBlock: 'gallactic.getLatestBlock',
        getBlocks: 'gallactic.getBlocks',
        getBlock: 'gallactic.getBlock',
        getBlockTxns: 'gallactic.getBlockTxs',
        getConsensusState: 'gallactic.getConsensusState',
        getGenesis: 'gallactic.getGenesis',
        getPeers: 'gallactic.getPeers',
        getStatus: 'gallactic.getStatus',
        getUnconfirmedTxs: 'gallactic.getUnconfirmedTxs'
      }
    },
    transaction: {
      defaultUnit: 'boson',
      deploymentAddress: '<nil>',
      method: {
        broadcastTxn: 'gallactic.broadcastTx'
      }
    }
  },
  keyPair: {
    addressLength: 40, // 20 bytes
    publicKeyLength: 64, // 32 bytes
    privateKeyLength: 128, // 64 bytes
    seedHashLength: 64 // 32 bytes
  },
  /**
   *  * Possible units are:
   *   SI Short   SI Full       Effigy       Other
   * - boson      attogtx       --           --
   * - kboson     femtogtx      ?            --
   * - mboson     picogtx       ?            --
   * - gboson     nanogtx       ?            nano
   * - --         microgtx      ?            micro
   * - --         milligtx      ?            milli
   * - gtx        --            --           --
   * - kgtx       kilogtx       --           grand
   * - mgtx       megagtx
   * - ggtx       gigagtx
   * - tgtx       teragtx
   */
  gallacticUnits: {
    /*eslint-disable */
    boson:        '1',
    kboson:       '1000',
    femtogtx:     '1000',
    mboson:       '1000000',
    picogtx:      '1000000',
    gboson:       '1000000000',
    nanogtx:      '1000000000',
    nano:         '1000000000',
    microgtx:     '1000000000000',
    micro:        '1000000000000',
    milligtx:     '1000000000000000',
    milli:        '1000000000000000',
    gtx:          '1000000000000000000',
    kgtx:         '1000000000000000000000',
    kilogtx:      '1000000000000000000000',
    grand:        '1000000000000000000000',
    mgtx:         '1000000000000000000000000',
    megagtx:      '1000000000000000000000000',
    ggtx:         '1000000000000000000000000000',
    gigagtx:      '1000000000000000000000000000',
    tgtx:         '1000000000000000000000000000000',
    teragtx:      '1000000000000000000000000000000'
    /*eslint-enable */
  },
  transactionType: {
    sendId: 1,
    callId: 2,
    bondId: 3,
    ubndId: 4,
    permId: 5,
    send: 'SendTx',
    call: 'CallTx',
    bond: 'BondTx',
    ubnd: 'UnbondTx',
    perm: 'PermissionsTx'
  },
  transactionFromKey: {
    send: 'senders',
    call: 'caller',
    bond: 'from',
    ubnd: 'from',
    perm: 'modifier'
  }
}