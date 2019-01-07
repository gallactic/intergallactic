class tx_call extends transaction {
    constructor(from,to,gasLimit,data) {
        txn = {
            caller: setTxnFrom(from),
            callee: setTxnTo(to),
            gasLimit: gasLimit,
            data: data
        };
        super.setTxn(config.transactionType.call,txn);
        super.setUnit(config.gallactic.transaction.defaultUnit);
        super();
    }
}

