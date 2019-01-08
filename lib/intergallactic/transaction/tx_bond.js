class tx_bond extends transaction {
    constructor(from,to) {
        txn = {
            from: setTxnFrom(from),
            to: setTxnTo(to),
        };
        super.setTxn(config.transactionType.ubnd,txn);
        super.setUnit(config.gallactic.transaction.defaultUnit);
        super();
    }
}