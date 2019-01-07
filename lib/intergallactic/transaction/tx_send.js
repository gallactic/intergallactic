class tx_send extends transaction {
    constructor(from,to) {
        txn = {
            senders: from.map(e => super.setTxnFrom(e)),
            receivers: to.map(e => super.setTxnTo(e))
        };
        super.setTxn(config.transactionType.send,txn);
        super.setUnit(config.gallactic.transaction.defaultUnit);
        super();
    }
}