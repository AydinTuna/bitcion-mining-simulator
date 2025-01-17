import { elapsedTimeFormatter, dateFormatter, readFile, writeToFile, objectToHex } from './helpers.js';
import { createHash } from 'crypto';

let isMined = false
let candidateBlockHash = ""
let nonce = -1
const blockHeader = {
    version: "",
    previousBlock: "",
    merkleRoot: "",
    time: "",
    bits: "",
    nonce: nonce
}


const MAX_TARGET = "0x000ffff000000000000000000000000000000000000000000000000000000000"
const DIFFICULTY = (10 / 9) * 42468
const TARGET = "0x" + (parseInt(MAX_TARGET, 16) / DIFFICULTY).toString(16).padStart(64, "0")
console.log("Target: ", TARGET);
const BITCOIN_WALLET = "wallet.json"
const BLOCK_REWARD = 3.125




// Rules:
// If hashing output lower than mining difficulty
// You can mine your transactions that in your mempool

// Get latest block hash
// Fetch the raw block data
// Get the block header from raw block data
// Hash the block header

// Block header:
// Version, Previous Block, Merkle Root, Time, Bits, Nonce

function hash(blockHeaderHex) {
    const sha256Hash = createHash('sha256').update(blockHeaderHex).digest('hex')
    const hash256 = createHash('sha256').update(sha256Hash).digest('hex')
    return hash256
}

async function getBitcoinLatestBlock() {
    console.log("⏳ Latest block fetching process started!");
    const latestBlockUrl = "https://blockchain.info/latestblock";
    try {
        const response = await fetch(latestBlockUrl);
        if (!response.ok) {
            throw new Error(`HTTP error! Status: ${response.status}`);
        }
        const latestBlockData = await response.json();
        console.log("✅ Latest block fetching process completed.");
        return latestBlockData;
    } catch (error) {
        console.error('❌ Error fetching data:', error);
        return null;
    }
}

async function getRawBlockData(blockHash) {
    console.log("⏳ Raw block data fetching process started!");
    const rawBlockUrl = `https://blockchain.info/rawblock/${blockHash}`;
    try {
        const response = await fetch(rawBlockUrl);
        if (!response.ok) {
            throw new Error(`HTTP error! Status: ${response.status}`);
        }
        const rawBlockData = await response.json();
        console.log("✅ Raw block data fetching process completed.");
        return rawBlockData;
    } catch (error) {
        console.error('❌ Error fetching data:', error);
        return null;
    }
}

async function fetchBlockHeader(blockHash) {
    console.log("⏳ Block Header fetching process started!");
    const rawBlockData = await getRawBlockData(blockHash)
    blockHeader.version = rawBlockData.ver
    blockHeader.previousBlock = rawBlockData.prev_block
    blockHeader.merkleRoot = rawBlockData.mrkl_root
    blockHeader.time = rawBlockData.time
    blockHeader.bits = rawBlockData.bits
    console.log("✅ Block Header fetching process completed.");
}

async function mining() {
    const bitcoinLastestBlock = await getBitcoinLatestBlock()
    await fetchBlockHeader(bitcoinLastestBlock.hash)

    const startTime = new Date();
    const startTimeFormatted = dateFormatter(startTime)
    console.log("⏳ Mining started!");
    while (!isMined) {
        nonce += 1
        blockHeader.nonce = nonce
        const blockHeaderHex = objectToHex(blockHeader)
        const blockHeaderHash = hash(blockHeaderHex)
        console.log("block header hash: ", blockHeaderHash);

        if (parseInt(blockHeaderHash, 16) < parseInt(TARGET, 16)) {
            candidateBlockHash = blockHeaderHash
            let currentBalance = await readFile(BITCOIN_WALLET);
            let updatedBalance = currentBalance + BLOCK_REWARD;
            const updatedData = {
                walletBalance: updatedBalance
            };
            await writeToFile(BITCOIN_WALLET, updatedData)
            isMined = true
        }
        console.log("Mining Nonce: ", nonce);

    }
    console.log("✅ Mining completed.");
    console.log(`\n🎉 Yey! You earned ${BLOCK_REWARD} BTC 💰`);
    const totalAmount = await readFile(BITCOIN_WALLET)
    console.log("💰 Balance: ", totalAmount);


    const endTime = new Date();
    const endTimeFormatted = dateFormatter(endTime)
    const total = endTime - startTime;

    console.log("\nStart Time: ", startTimeFormatted);
    console.log("Complete Time: ", endTimeFormatted);
    const totalFormatted = elapsedTimeFormatter(total)
    console.log("Total: ", totalFormatted);

    console.log("\nNonce: ", nonce);
    console.log("Block Hash: ", candidateBlockHash);

}
mining()