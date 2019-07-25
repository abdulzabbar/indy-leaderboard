/* eslint-disable no-undef */
var EbakusDB = artifacts.require('EbakusDB')
var GameBoard = artifacts.require('GameBoard')
/* eslint-enable no-undef */

module.exports = async function(deployer) {
  deployer.deploy(EbakusDB, { overwrite: false })
  deployer.link(EbakusDB, GameBoard)
  await deployer.deploy(GameBoard)

  console.log('GameBoard address: ', GameBoard.address)
}
