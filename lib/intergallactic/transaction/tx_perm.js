class tx_perm extends transaction {
    constructor(from,to,permissions,set) {
        txn = {
            modifier: setTxnFrom(from),
            modified: setTxnTo(to),
            permissions: permissions,
            set: set
        };
        super.setTxn(config.transactionType.perm,txn);
        super.setUnit(config.gallactic.transaction.defaultUnit);
        super();
    }
}
    