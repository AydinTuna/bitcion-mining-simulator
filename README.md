# Bitcoin Mining Simulator

I created this simulator for educational purposes. To understand the basic mechanism of bitcoin, I simplified it and adapted it to my computer.

### Differences from mainnet Bitcoin Mining:
- Average block production time has been set to 30 seconds.
- Difficulty adjustment period set to once every 20 blocks
- MAX_TARGET value set to "0x00ffff000000000000000000000000000000000000000000000000000000000" (Because the original value was way too hard for my Macbook. 🥲)

### So, how does it work?
Firstly, I do not build blocks from scratch. In fact, I fetch the block headers **randomly** from [https://blockchain.info](https://www.blockchain.com/explorer/api).
After the block fetch process, I hashed the block headers with the Hash256 function. If the hash result is lower than the target, the block has been mined, 
otherwise I keep increasing the **nonce** and hashing again until I find the target.

I fetched the block headers from [https://blockchain.info](https://www.blockchain.com/explorer/api) because my purpose was to focus on the mining. So I got the data from blockchain
and mined blocks again with my own rules.

I also fetched the block headers randomly, if I didn't I could get the same result when I run the programme every time.

Mining difficulty and target change dynamically. 

I set: 
- **Difficulty == 1**
- **Difficulty Ratio == 1**
- **Max Target == "0x00ffff000000000000000000000000000000000000000000000000000000000"**
as default.

When the simulator is run, the difficulty and difficulty ratio parameters adjust the mining target and set the block production time to an average of 30 seconds.

### Final Notes
This programme taught me a lot about how bitcoin mining works. It can still be improved, there is no end, but I will stop here and move on to new projects.

Thanks :D
