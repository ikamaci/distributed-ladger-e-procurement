const Transfer = require('../wallet/transfer');
const Wallet = require('../wallet/index');

class Miner{
    constructor(blockchain,transferPool,wallet,p2pServer){
        this.blockchain = blockchain;
        this.p2pServer = p2pServer;
        this.wallet = wallet;
        this.transferPool = transferPool;
    }

    mine(){
        /**
         * 1. grab transaction from the pool that are valid
         * 2. create a block using the transactions
         * 3. synchronize the chain and include new block
         * 4. clear the transaction pool to remove confirmed transactions
         */

         const validTransfer = this.transferPool.validTransfer();

         // include reward for the miner in the valid transactions array

        // validTransactions.push(Transaction.rewardTransaction(this.wallet,Wallet.blockchainWallet()));

         // create a block consisting of the valid transaction

         const block = this.blockchain.addBlock(validTransfer);

         // synchronize the chains in the p2p server

         this.p2pServer.syncChain();

         // clear the transaction pool

         this.transferPool.clear();

         // broadcast every miner to clear their pool

         this.p2pServer.broadcastClearTransactions();

         return block;


    }
}

module.exports = Miner;
