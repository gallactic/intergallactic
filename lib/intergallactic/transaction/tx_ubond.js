class tx_ubond extends transaction {
    constructor(from,to,pubKey) {
        txn = {
            from: setTxnFrom(from),
            to: setTxnTo(to),
            public_key: pubKey
        };
        super.setTxn(config.transactionType.ubnd,txn);
        super.setUnit(config.gallactic.transaction.defaultUnit);
        super();
    }
}