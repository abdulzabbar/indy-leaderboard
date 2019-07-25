require('dotenv').config()
const Web3 = require('web3')
const ebakus = require('web3-ebakus')
const bip39 = require('bip39')
const hdkey = require('hdkey')

const gameboardcContractJson = require('../build/contracts/GameBoard.json')

let _contract
let _contractAddress
let _account
let _netId

if (!process.env.WEB3_PROVIDER) {
  console.log('Please set a web3 provider to use!')
  process.exit(1)
}

const web3 = ebakus(new Web3(process.env.WEB3_PROVIDER))

// 1. Set account to be used
const mnemonic = process.env.WALLET_MNEMONIC
const privateKey = process.env.WALLET_PRIVATE_KEY

if (mnemonic && mnemonic.split(' ').length == 12) {
  const seed = bip39.mnemonicToSeedSync(mnemonic)
  const root = hdkey.fromMasterSeed(seed)
  const addrNode = root.derive("m/44'/60'/0'/0/0") // line 1
  const new_acc = web3.eth.accounts.privateKeyToAccount(
    `0x${addrNode._privateKey.toString('hex')}`
  )
  _account = web3.eth.accounts.wallet.add(new_acc)
} else if (privateKey) {
  const new_acc = web3.eth.accounts.privateKeyToAccount(privateKey)
  _account = web3.eth.accounts.wallet.add(new_acc)
} else {
  console.log('Please set you wallet mnemonic or private_key in .env file!')
  process.exit(1)
}

const getWeb3ContractInstance = async () => {
  const netId = await web3.eth.net.getId()
  if (
    typeof _contract !== 'undefined' &&
    typeof _netId !== 'undefined' &&
    netId == _netId
  ) {
    return _contract
  }
  _netId = netId

  _contractAddress = gameboardcContractJson.networks[netId].address

  _contract = new web3.eth.Contract(
    gameboardcContractJson.abi,
    _contractAddress,
    {
      defaultAccount: _account.address,
      from: _account.address,
      gas: 6000000,
    }
  )

  return _contract
}

const sendTx = async tx => {
  tx = {
    ...tx,
    from: _account.address,
    chainId: 7, // web3.js@1.0.0-beta.37 does't yet have support for web3.eth.getChainId()
  }
  tx.nonce = await web3.eth.getTransactionCount(tx.from)

  const suggestedDifficulty = await web3.eth.suggestDifficulty(tx.from)
  const txWithPow = await _account.calculateWorkForTransaction(
    tx,
    suggestedDifficulty
  )

  return await web3.eth.sendTransaction(txWithPow)
}

const createLeaderboard = async ({ id, title, image, order }) => {
  const contract = await getWeb3ContractInstance()
  const method = contract.methods.createLeaderboard(id, title, image, order)
  const tx = {
    data: method.encodeABI(),
  }
  tx.gas = await method.estimateGas(tx)

  return await sendTx(tx)
}

const createAchievement = async ({ id, title, image, type, maxValue }) => {
  const contract = await getWeb3ContractInstance()
  const method = contract.methods.createAchievement(
    id,
    title,
    image,
    type,
    maxValue
  )
  const tx = {
    data: method.encodeABI(),
  }
  tx.gas = await method.estimateGas(tx)

  return await sendTx(tx)
}

const setScore = async ({ leaderboardId, userId, value }) => {
  const contract = await getWeb3ContractInstance()
  const method = contract.methods.setScore(leaderboardId, userId, value)
  const tx = {
    data: method.encodeABI(),
  }
  tx.gas = await method.estimateGas(tx)

  const receipt = await sendTx(tx)
  return receipt
}

const unlockAchievement = async ({ achievementId, userId, value }) => {
  const contract = await getWeb3ContractInstance()
  const method = contract.methods.unlockAchievement(
    achievementId,
    userId,
    value
  )
  const tx = {
    data: method.encodeABI(),
  }
  tx.gas = await method.estimateGas(tx)

  return await sendTx(tx)
}

module.exports = {
  getWeb3: () => web3,
  getWeb3ContractInstance: getWeb3ContractInstance,
  createLeaderboard: createLeaderboard,
  createAchievement: createAchievement,
  setScore: setScore,
  unlockAchievement: unlockAchievement,
}
