const ChainUtil = require('../chain-util');
const {MINING_REWARD} = require('../config');

class Transfer{
    constructor(){
        this.id = ChainUtil.id();
        this.address = null;
        this.recipient = null;
        this.signature = null;
        this.payload = null;
    }

    /**
     * add extra ouputs to the transactions
     */
/*
    update(senderWallet,recipient,amount){
        const senderOutput = this.outputs.find(output => output.address === senderWallet.publicKey);

        if(amount > senderWallet.amount){
            console.log(`Amount ${amount} exceeds balance`);
            return;
        }

        senderOutput.amount = senderOutput.amount - amount;
        this.outputs.push({amount: amount,address: recipient});
        Transfer.signTransaction(this,senderWallet);

        return this;
    }

 */

    /**
     * create a new transaction
     */

    static newTransfer(senderWallet,recipient,UBLFile){

        // call to the helper function that creates and signs the transaction outputs
        const transfer = new this();
        transfer.recipient = recipient;
        transfer.payload = UBLFile;
        return Transfer.signTransfer(transfer,senderWallet);

    }

    /**
     * create input and sign the outputs
     */

    static signTransfer(transfer,senderWallet){

        transfer.timestamp = Date.now();
        transfer.address = senderWallet.publicKey;
        transfer.signature = senderWallet.sign(ChainUtil.hash(transfer))

        return transfer;
    }

    /**
     * verify the transaction by decrypting and matching
     */

    static verifyTransfer(transfer){
        let tempTransfer =  {...transfer}
        tempTransfer.signature = null;
        return ChainUtil.verifySignature(
            transfer.address,
            transfer.signature,
            ChainUtil.hash(tempTransfer)
        )
    }
/*
    static rewardTransaction(minerWallet,blockchainWallet){
        return Transaction.transactionWithOutputs(blockchainWallet,[{
            amount: MINING_REWARD,
            address: minerWallet.publicKey
        }]);
    }

 */
}

module.exports = Transfer;
