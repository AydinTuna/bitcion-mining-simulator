import { randomHexGenerator } from "./randomHexGenerator.js"

export function mockBlockHeaderBuilder(nonce) {
    let blockHeader = {
        version: "",
        previousBlock: "",
        merkleRoot: "",
        time: "",
        bits: "",
        nonce: nonce
    }

    const version = randomHexGenerator(4)
    const previousBlockHash = randomHexGenerator(32)
    const merkleRoot = randomHexGenerator(32)
    const time = randomHexGenerator(4)
    const bits = randomHexGenerator(4)

    blockHeader.version = version
    blockHeader.previousBlock = previousBlockHash
    blockHeader.merkleRoot = merkleRoot
    blockHeader.time = time
    blockHeader.bits = bits
    return blockHeader
}
