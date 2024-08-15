# 🌈 So Extra Data Auction

Bid on writing your own message in the extra data field of eth blocks using confidential requests.
* [Hi from SUAVE office hours 👋](https://www.eth-data.bid/block/2132404)
* Try it yourself at [eth-data.bid](https://www.eth-data.bid/)

## Behind the magic ✨

* There is only one extra data field per block, so an auction takes place
  * The auction can only be fulfilled by a PBS builder accepting blocks from SUAVE
* Messages are public data. However the bids are confidential and kept private during the auction.
  * Bids expire after a set amount of time (default: 100 blocks)
  * Bids are sent on SUAVE as a CCR (Confidential Compute Request)
  * Bids are made binding because they are in the form of a signed L1 transaction that transfers the value of the bid to the block producer
* The winning bid is selected from all currently active bids and their message and payment are added to the block by a custom block builder on SUAVE
* The SUAVE block is sent to L1 for inclusion in the PBS auction
  * If the SUAVE block wins the L1 auction, the winning message appears as extra data and payment is made by executing the transaction sent with the bid
  * If the SUAVE block does not win the L1 auction, we build another block on SUAVE and keep trying

## Suapp built on SUAVE ☀️

### Front-end Notes

This is the front-end repository which demonstrates two ways to handle tx signing UX we think are the best at the current time. We have a binding L1 transaction we use to interact with SUAVE, which requires signing transactions. We demonstrate how to do this using a burner wallet or with Metamask (which requires an advanced setting to enable `eth_sign`).

### Back-end Notes

There are also back-end implementations powering the Suapp. Review the two key areas here:

1. [Custom block builder](https://github.com/halo3mic/suave-playground/blob/master/tasks/build-blocks.ts)
2. [SUAVE smart contract](https://github.com/halo3mic/suave-playground/blob/master/contracts/blockad/BlockAdV2.sol)

### Other Reference

* [Suave docs](https://suave-alpha.flashbots.net/)
* [suave-viem](https://github.com/flashbots/suave-viem)
