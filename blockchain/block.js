const ChainUtil = require('../chain-util');
const { DIFFICULTY,MINE_RATE } = require('../config.js');

class Block{
    constructor(timestamp,lastHash,hash,data,nonce,difficulty){
        this.timestamp = timestamp;
        this.lastHash = lastHash;
        this.hash = hash;
        this.data = data;
        this.nonce = nonce;
        this.difficulty = difficulty || DIFFICULTY;
    }

    /**
     * returns what the object looks like
     * substring is used to make it look nice
     * hashes are too big to printed on command line 
     */
    dateToString(milisec){
        var date = new Date(parseInt(milisec));

        return date.toString("MMM dd");
    }
    dataToString(data){
        console.log(data)
        if (data.length > 0) {
            return `Transfer - 
            Timestamp : ${this.dateToString(data.timestamp)} | 
            Address : ${data.address} \n |
            Recipient : ${data.recipient} \n |
            Payload : ${data.payload} \n |
            Signature : ${data.signature} \n |
        `;
        }
        else{
            return "Genesis Dummy";
        }

    }
    toString(){
        return `Block - 
        Timestamp : ${this.dateToString(this.timestamp)} \n |
        Last Hash : ${this.lastHash.substring(0,10)} \n |
        Hash      : ${this.hash.substring(0,10)} \n |
        Nonce     : ${this.nonce} \n |
        Data      : ${JSON.stringify(this.data)} \n |
        Difficulty: ${this.difficulty} | 
        `;

    }

    /**
     * function to create the first block or the genesis block
     */

    static genesis(){
        return new this('0000000000','----','f1574-h4gh',[],0,DIFFICULTY);
    }

    /**
     * function to create new blocks or to mine new blocks
     */

    static mineBlock(lastBlock,data){

        let hash;
        let timestamp;
        const lastHash = lastBlock.hash;

        let { difficulty } = lastBlock;

        let nonce = 0;
        //generate the hash of the block
        do {
            nonce++;
            timestamp = Date.now();
            difficulty = Block.adjustDifficulty(lastBlock,timestamp);
            hash = Block.hash(timestamp,lastHash,data,nonce,difficulty);
            // checking if we have the required no of leading number of zeros
        } while(hash.substring(0,difficulty) !== '0'.repeat(difficulty));

        return new this(timestamp,lastHash,hash,data,nonce,difficulty);
    }

    /**
     * function to create the hash value of the block data
     */

    static hash(timestamp,lastHash,data,nonce,difficulty){
        return ChainUtil.hash(`${timestamp}${lastHash}${data}${nonce}${difficulty}`).toString();
    }

    /**
     * return the hash value of the passed block
     */

    static blockHash(block){
        //destructuring
        const { timestamp, lastHash, data, nonce,difficulty } = block;
        return Block.hash(timestamp,lastHash,data,nonce,difficulty);
    }

    /**
     * utility function to adjust difficulty
     */

     static adjustDifficulty(lastBlock,currentTime){
         let { difficulty } = lastBlock;
         difficulty = lastBlock.timestamp + MINE_RATE > currentTime ? difficulty + 1 : difficulty - 1; 
         return difficulty; 
     }

}

// share this class by exporting it

module.exports = Block;
