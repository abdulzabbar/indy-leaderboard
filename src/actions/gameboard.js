import Web3 from 'web3'
import ebakus from 'web3-ebakus'

import gameboardcContractJson from '../../build/contracts/GameBoard.json'

const web3 = ebakus(new Web3(process.env.VUE_APP_WEB3_PROVIDER))

let _contract
let contractAddress
let _netId

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

  try {
    contractAddress = gameboardcContractJson.networks[netId].address
  } catch (err) {
    alert(
      'No contract found deployed.\nPlease run "truffle compile && truffle migrate" from your teminal.'
    )
  }

  _contract = new web3.eth.Contract(gameboardcContractJson.abi, contractAddress)

  return _contract
}

const getLeaderboards = async () => {
  const contract = await getWeb3ContractInstance()
  const iter = await web3.db.select(
    contract._address,
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
  const contract = await getWeb3ContractInstance()
  const iter = await web3.db.select(
    contract._address,
    'Leaderboards',
    'Id = ' + id,
    'Title ASC',
    'latest'
  )

  const item = await web3.db.next(iter)
  return item
}

const listenForNewLeaderboard = async cb => {
  const contract = await getWeb3ContractInstance()
  return await contract.events
    .NewLeaderboard({ fromBlock: 'latest' })
    .on('data', event => {
      console.log('NewLeaderboard event has been emitted', {
        ...event.returnValues,
      })
      cb()
    })
}

const getLeaderboardScores = async (id, order) => {
  const contract = await getWeb3ContractInstance()
  const iter = await web3.db.select(
    contract._address,
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

const listenForScoreSet = async (id, cb) => {
  const contract = await getWeb3ContractInstance()
  return await contract.events
    .ScoreSet({ fromBlock: 'latest', filter: { leaderboardId: `${id}` } })
    .on('data', event => {
      console.log('ScoreSet event has been emitted', {
        ...event.returnValues,
      })
      cb()
    })
}

const getAchievements = async () => {
  const contract = await getWeb3ContractInstance()
  const iter = await web3.db.select(
    contract._address,
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

const listenForNewAchievement = async cb => {
  const contract = await getWeb3ContractInstance()
  return await contract.events
    .NewAchievement({ fromBlock: 'latest' })
    .on('data', event => {
      console.log('NewAchievement event has been emitted', {
        ...event.returnValues,
      })
      cb()
    })
}

const getUnlockedAchievements = async address => {
  const contract = await getWeb3ContractInstance()
  const iter = await web3.db.select(
    contract._address,
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

const listenForAchievementUnlocked = async (address, cb) => {
  const contract = await getWeb3ContractInstance()
  return await contract.events
    .AchievementUnlocked({
      fromBlock: 'latest',
      filter: { userId: address },
    })
    .on('data', event => {
      console.log('AchievementUnlocked event has been emitted', {
        ...event.returnValues,
      })
      cb()
    })
}

export {
  getLeaderboards,
  getLeaderboard,
  getLeaderboardScores,
  getAchievements,
  getUnlockedAchievements,
  listenForNewLeaderboard,
  listenForNewAchievement,
  listenForScoreSet,
  listenForAchievementUnlocked,
}
