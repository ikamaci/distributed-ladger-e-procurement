const Transfer = require('./transfer');

class TransferPool{
    constructor(){
        // represents a collections of transactions in the pool
        this.transfers = [];
    }

    /**
     * this method will add a transaction
     * it is possible that the transaction exists already
     * so it will replace the transaction with the new transaction
     * after checking the input id and adding new outputs if any
     * we call this method and replace the transaction in the pool
     */
    updateOrAddTransfer(transaction){
        // get the transaction while checking if it exists
        let transactionWithId = this.transfers.find(t => t.id === transaction.id);

        if(transactionWithId){
            this.transfers[this.transfers.indexOf(transactionWithId)] = transaction;
        }
        else{
            this.transfers.push(transaction);
        }
    }

    /**
     * returns a existing transaction from the pool
     * if the inputs matches
     */

    existingTransfer(address){
        return this.transfers.find(t => t.input.address === address);
    }

    /**
     * sends valid transactions to the miner
     */

    validTransfer(){
        /**
         * valid transactions are the one whose total output amounts to the input
         * and whose signatures are same
         */
        return this.transfers.filter((transaction)=>{

            // reduce function adds up all the items and saves it in variable
            // passed in the arguments, second param is the initial value of the
            // sum total

            const outputTotal = transaction.outputs.reduce((total,output)=>{
                return total + output.amount;
            },0)
            if(false ){
                console.log(`Invalid transaction from ${transaction.input.address}`);
                return;
            }

            if(!Transfer.verifyTransfer(transaction)){
                console.log(`Invalid signature from ${transaction.input.address}`);
                return;
            }
            console.log(" -- TRANSFER POOL --")
            console.log(transaction);
            return transaction;
        })
    }

    clear(){
        console.log("clear TRANSFERS")
        this.transfers = [];
    }
}

module.exports = TransferPool;
