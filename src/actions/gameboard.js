import contract from 'truffle-contract'
import Web3 from 'web3'
import ebakus from 'web3-ebakus'

import gameboardcContractJson from '../../build/contracts/GameBoard.json'

const web3 = ebakus(new Web3(process.env.VUE_APP_WEB3_PROVIDER))

const GameboardContract = contract(gameboardcContractJson)
GameboardContract.setProvider(web3.currentProvider)
let _gameboardContractAddress

const getGameboardContractAddress = async () => {
  if (typeof _gameboardContractAddress === 'undefined') {
    const instance = await GameboardContract.deployed()
    _gameboardContractAddress = instance.address
  }
  return _gameboardContractAddress
}

const getLeaderboards = async () => {
  const contractAddress = await getGameboardContractAddress()
  const iter = await web3.db.select(
    contractAddress,
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
  const contractAddress = await getGameboardContractAddress()
  const iter = await web3.db.select(
    contractAddress,
    'Leaderboards',
    'Id = ' + id,
    'Title ASC',
    'latest'
  )

  const item = await web3.db.next(iter)
  return item
}

const getLeaderboardScores = async (id, order) => {
  const contractAddress = await getGameboardContractAddress()
  const iter = await web3.db.select(
    contractAddress,
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
  const contractAddress = await getGameboardContractAddress()
  const iter = await web3.db.select(
    contractAddress,
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
  const contractAddress = await getGameboardContractAddress()
  const iter = await web3.db.select(
    contractAddress,
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
