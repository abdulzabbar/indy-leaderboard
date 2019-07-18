// import Vue from 'vue'
import contract from 'truffle-contract'
import gameboardcContractJson from '../../build/contracts/GameBoard.json'

import { getWeb3 } from '../utils/web3'

const GameboardContract = contract(gameboardcContractJson)
let web3

const getInstance = async () => {
  if (typeof web3 === 'undefined') {
    web3 = await getWeb3()
    GameboardContract.setProvider(web3.givenProvider || web3.currentProvider)
  }

  return await GameboardContract.deployed()
}

const createLeaderboard = async (id, title, image, order) => {
  const gc = await getInstance()

  // we don't want to use the truffle-contract interface directly,
  // but instead get the encoded ABI data, in order we call the ebakus wallet for the transaction
  const data = gc.contract.methods
    .createLeaderboard(id, title, image, order)
    .encodeABI()

  await window.ebakusWallet.sendTransaction({
    to: gc.address,
    data,
  })
}

const getLeaderboards = async () => {
  const gc = await getInstance()
  const iter = await web3.db.select(
    gc.address,
    'Leaderboards',
    '',
    'Title ASC',
    'latest'
  )

  let items = []
  let item = await web3.db.next(iter)

  while (item != null) {
    items.push(item)
    item = await web3.db.next(iter)
  }
  return items
}

const getLeaderboard = async id => {
  const gc = await getInstance()
  const iter = await web3.db.select(
    gc.address,
    'Leaderboards',
    'Id = ' + id,
    'Title ASC',
    'latest'
  )

  const item = await web3.db.next(iter)
  return item
}

const getLeaderboardScores = async (id, order) => {
  const gc = await getInstance()
  const iter = await web3.db.select(
    gc.address,
    'Scores',
    'LeaderboardId = ' + id,
    'Value ' + (order == 1 ? 'DESC' : 'ASC'),
    'latest'
  )

  let items = []
  let item = await web3.db.next(iter)

  while (item != null) {
    items.push(item)
    item = await web3.db.next(iter)
  }
  return items
}

const setScore = async (leaderboardId, userId, value) => {
  const gc = await getInstance()

  // we don't want to use the truffle-contract interface directly,
  // but instead get the encoded ABI data, in order we call the ebakus wallet for the transaction
  const data = gc.contract.methods
    .setScore(leaderboardId, userId, value)
    .encodeABI()

  await window.ebakusWallet.sendTransaction({
    to: gc.address,
    data,
  })
}

const createAchievement = async (id, title, image, type, maxValue) => {
  const gc = await getInstance()

  // we don't want to use the truffle-contract interface directly,
  // but instead get the encoded ABI data, in order we call the ebakus wallet for the transaction
  const data = gc.contract.methods
    .createAchievement(id, title, image, type, maxValue)
    .encodeABI()

  await window.ebakusWallet.sendTransaction({
    to: gc.address,
    data,
  })
}

const getAchievements = async () => {
  const gc = await getInstance()
  const iter = await web3.db.select(
    gc.address,
    'Achievements',
    '',
    'Title ASC',
    'latest'
  )

  let items = []
  let item = await web3.db.next(iter)

  while (item != null) {
    items.push(item)
    item = await web3.db.next(iter)
  }
  return items
}

const getUnlockedAchievements = async address => {
  const gc = await getInstance()
  const iter = await web3.db.select(
    gc.address,
    'UnlockedAchievements',
    'UserId = ' + address,
    'Value DESC',
    'latest'
  )

  let items = []
  let item = await web3.db.next(iter)

  while (item != null) {
    items.push(item)
    item = await web3.db.next(iter)
  }
  return items
}

const unlockAchievement = async (achievementId, userId, value) => {
  const gc = await getInstance()

  // we don't want to use the truffle-contract interface directly,
  // but instead get the encoded ABI data, in order we call the ebakus wallet for the transaction
  const data = gc.contract.methods
    .unlockAchievement(achievementId, userId, value)
    .encodeABI()

  await window.ebakusWallet.sendTransaction({
    to: gc.address,
    data,
  })
}

export {
  createLeaderboard,
  getLeaderboards,
  getLeaderboard,
  getLeaderboardScores,
  setScore,
  createAchievement,
  getAchievements,
  getUnlockedAchievements,
  unlockAchievement,
}
