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

export {
  getLeaderboards,
  getLeaderboard,
  getLeaderboardScores,
  getAchievements,
  getUnlockedAchievements,
}
