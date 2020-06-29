const Block = require('./block');

class Blockchain{
    constructor(){
        this.chain = [Block.genesis()];
    }
    /**
     * utility function to add block to the blockchain
     * returns the added block
     */

    addBlock(data){
        const block = Block.mineBlock(this.chain[this.chain.length-1],data);
        this.chain.push(block);
        
        return block;
    }

    /**
     * checks if the chain recieved from another miner is valid or not
     */

    isValidChain(chain){
        console.log("isValid",chain)
        if(JSON.stringify(chain[0]) !== JSON.stringify(Block.genesis())){
            console.log("ilk hata ")
            console.log(JSON.stringify(chain[0]))
            console.log(JSON.stringify(Block.genesis()))

            return false;
        }


        for(let i = 1 ; i<chain.length; i++){
            const block = chain[i];
            const lastBlock = chain[i-1];
            if((block.lastHash !== lastBlock.hash) || (
                block.hash !== Block.blockHash(block)))
            return false;
        }

        return true;

    }
    /**
     * replace the chain if the chain recieved from another miner
     * is longer and valid
     */

    replaceChain(newChain){
        if(newChain.length <= this.chain.length){
            console.log("Recieved chain is not longer than the current chain");
            return;
        }else if(!this.isValidChain(newChain)){
            console.log("Recieved chain is invalid");
            return;
        }
        
        console.log("Replacing the current chain with new chain");
        console.log("old chain : ",this.chain[0])
        this.chain = this.castChain(newChain);
        console.log("new chain : ",this.chain[0])
    }
    castChain(chain){
        return chain.map(block => {
            const {timestamp,lastHash,hash,data,nonce,difficulty} = block;
            return new Block(timestamp,lastHash,hash,data,nonce,difficulty);
        })

    }
}

module.exports = Blockchain;
