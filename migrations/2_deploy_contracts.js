/* eslint-disable no-undef */
var EbakusDB = artifacts.require('EbakusDB')
var GameBoard = artifacts.require('GameBoard')
/* eslint-enable no-undef */

var gameboardcContractJson = require('../build/contracts/GameBoard.json')

module.exports = async function(deployer, network, accounts) {
  deployer.deploy(EbakusDB, { overwrite: false })
  deployer.link(EbakusDB, GameBoard)
  await deployer.deploy(GameBoard)

  console.log('GameBoard address: ', GameBoard.address)

  const instance = await GameBoard.deployed()

  /**
   * The code bellow is not necessary,
   * but it is more of a nice to have.
   *
   * It will store the contract ABI to Ebakus network,
   * this way it will be accessible for everyone
   * to read it and call the contract with it.
   * It's also being used in our explorer and wallet
   * as it allows them to  better display the transaction content.
   */
  const abiForSystemContractStoreAbiForAddress = [
    {
      type: 'function',
      name: 'storeAbiForAddress',
      inputs: [
        {
          name: 'address',
          type: 'address',
        },
        {
          name: 'abi',
          type: 'string',
        },
      ],
      outputs: [],
      stateMutability: 'nonpayable',
    },
  ]

  const systemContractAddress = '0x0000000000000000000000000000000000000101'
  const systemContract = new web3.eth.Contract( // eslint-disable-line no-undef
    abiForSystemContractStoreAbiForAddress,
    systemContractAddress
  )

  await systemContract.methods
    .storeAbiForAddress(
      instance.address,
      JSON.stringify(gameboardcContractJson.abi)
    )
    .send({ from: accounts[0], gas: 400000 })
}
