const ChainUtil = require('../chain-util');
const {MINING_REWARD} = require('../config');

class Transfer{
    constructor(){
        this.id = ChainUtil.id();
        this.input = null;
        this.outputs = [];
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
        return Transfer.transferWithOutputs(senderWallet,[
            {payload: UBLFile,address: senderWallet.publicKey},
            {payload: UBLFile,address: recipient}
        ])
    }

    /**
     * helper function
     */

    static transferWithOutputs(senderWallet,outputs){
        const transaction = new this();
        transaction.outputs.push(...outputs);
        Transfer.signTransfer(transaction,senderWallet);
        return transaction;
    }

    /**
     * create input and sign the outputs
     */

    static signTransfer(transaction,senderWallet){
        transaction.input = {
            timestamp: Date.now(),
            address: senderWallet.publicKey,
            signature: senderWallet.sign(ChainUtil.hash(transaction.outputs))
        }
    }

    /**
     * verify the transaction by decrypting and matching
     */

    static verifyTransfer(transaction){
        return ChainUtil.verifySignature(
            transaction.input.address,
            transaction.input.signature,
            ChainUtil.hash(transaction.outputs)
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
