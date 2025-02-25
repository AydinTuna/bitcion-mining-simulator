import { elapsedTimeFormatter, dateFormatter, readFile, writeToFile, objectToHex } from './helpers.js';
import { createHash } from 'crypto';
import { mockBlockHeaderBuilder } from './utils/mockBlockHeaderBuilder.js';

let actualMiningTime = 1
let difficulty = 1
let difficultyRatio = 1
let isMined = false
let candidateBlockHash = ""
let blockHeight = -1
let nonce = 0
let blockHeader = {}

const DIFFICULTY_PERIOD = 20
const EXPECTED_MINING_TIME = 30 * DIFFICULTY_PERIOD
const MAX_TARGET = "0x00ffff000000000000000000000000000000000000000000000000000000000"
let target = "0x" + (parseInt(MAX_TARGET, 16) / difficulty).toString(16).padStart(64, "0")
const BITCOIN_WALLET = "wallet.json"
const BLOCKCHAIN_FILE = "blockchain.json"
const BLOCK_REWARD = 3.125

// Idea: 
// Add "bits" to the block header and save the target
// So when the program is started after it has been stopped, 
// it will be synchronised with the latest blockchain data.

function hash(blockHeaderHex) {
    const sha256Hash = createHash('sha256').update(blockHeaderHex).digest('hex')
    const hash256 = createHash('sha256').update(sha256Hash).digest('hex')
    return hash256
}

async function saveToBlockchain(blockHash) {
    let blockchain = [];
    try {
        blockchain = await readFile(BLOCKCHAIN_FILE);
    } catch {
        console.log("Creating new blockchain file...");
    }

    blockchain.push({ hash: blockHash, timestamp: Math.floor(Date.now() / 1000), blockHeight: blockHeight });
    await writeToFile(BLOCKCHAIN_FILE, blockchain);
}

async function adjustDifficulty() {
    let blockchainData = await readFile(BLOCKCHAIN_FILE)

    const periodStart = blockchainData[blockHeight - 20].timestamp
    const periodEnd = blockchainData[blockHeight - 1].timestamp

    actualMiningTime = periodEnd - periodStart

    difficultyRatio = parseFloat((EXPECTED_MINING_TIME / actualMiningTime).toPrecision(4))

    if (difficultyRatio >= 4) difficultyRatio = 4
    else if (difficultyRatio <= 0.25) difficultyRatio = 0.25

    difficulty = parseFloat((difficulty * difficultyRatio).toPrecision(4))
    target = "0x" + (parseInt(MAX_TARGET, 16) / difficulty).toString(16).padStart(64, "0")
}

async function mining() {
    while (true) {
        const startTime = new Date();
        const startTimeFormatted = dateFormatter(startTime);
        console.log("\n⏳ Mining started!");

        ++blockHeight
        if (blockHeight % DIFFICULTY_PERIOD === 0 && blockHeight !== 0) {
            await adjustDifficulty()
        }
        blockHeader = mockBlockHeaderBuilder(nonce);

        isMined = false;

        while (!isMined) {

            const blockHeaderHex = objectToHex(blockHeader);
            const blockHeaderHash = hash(blockHeaderHex);

            if (parseInt(blockHeaderHash, 16) < parseInt(target, 16)) {
                candidateBlockHash = blockHeaderHash;

                let currentBalance = await readFile(BITCOIN_WALLET) || 0;
                let updatedBalance = currentBalance + BLOCK_REWARD;
                const updatedData = { walletBalance: updatedBalance };
                await writeToFile(BITCOIN_WALLET, updatedData);

                await saveToBlockchain(candidateBlockHash);
                isMined = true;
            }
            nonce += 1;
            blockHeader.nonce = nonce;
        }

        const endTime = new Date();
        const endTimeFormatted = dateFormatter(endTime);
        const total = endTime - startTime;

        console.log("✅ Mining completed.");
        console.log(`🎉 Yey! You earned ${BLOCK_REWARD} BTC 💰`);
        console.log("💰 Balance: ", await readFile(BITCOIN_WALLET));
        console.log("\nStart Time: ", startTimeFormatted);
        console.log("Complete Time: ", endTimeFormatted);
        console.log("Total: ", elapsedTimeFormatter(total));
        console.log("\nNonce: ", nonce);
        console.log("Block Hash: ", candidateBlockHash);
        console.log("New Target: ", target);
        console.log("Mining Difficulty: ", difficulty);
        console.log("Difficulty Ratio: ", difficultyRatio);


        // Reset variables for the new mining block
        nonce = 0;
        blockHeader = mockBlockHeaderBuilder(nonce)
    }
}
mining()