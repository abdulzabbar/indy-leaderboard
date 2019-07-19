/* eslint-disable no-undef */
var EbakusDB = artifacts.require('EbakusDB')
var GameBoard = artifacts.require('GameBoard')
/* eslint-enable no-undef */

module.exports = async function(deployer) {
  deployer.deploy(EbakusDB, { overwrite: false })
  deployer.link(EbakusDB, GameBoard)
  await deployer.deploy(GameBoard)

  console.log('GameBoard address: ', GameBoard.address)

  const instance = await GameBoard.deployed()

  instance.createLeaderboard(
    0,
    '2V2 Arena',
    'https://api.adorable.io/avatars/40/leaderboard1',
    0
  )
  instance.createLeaderboard(
    1,
    '3V3 Arena',
    'https://api.adorable.io/avatars/40/leaderboard2',
    0
  )
  instance.createLeaderboard(
    2,
    '10V10 Battlegrounds',
    'https://api.adorable.io/avatars/40/leaderboard3',
    1
  )
  instance.createLeaderboard(
    3,
    'Open World',
    'https://api.adorable.io/avatars/40/leaderboard4',
    1
  )

  instance.setScore(0, '0x4ccd53f11be1604d90e9a1f08def5e8bcf65275d', 100)
  instance.setScore(0, '0x04f080F63B03Fe2792C21D7859883bd61CaEe70c', 200)
  instance.setScore(1, '0x4ccd53f11be1604d90e9a1f08def5e8bcf65275d', 1060)
  instance.setScore(1, '0x04f080F63B03Fe2792C21D7859883bd61CaEe70c', 20900)
  instance.setScore(2, '0x4ccd53f11be1604d90e9a1f08def5e8bcf65275d', 1100)
  instance.setScore(2, '0x04f080F63B03Fe2792C21D7859883bd61CaEe70c', 2050)
  instance.setScore(3, '0x4ccd53f11be1604d90e9a1f08def5e8bcf65275d', 11010)
  instance.setScore(3, '0x04f080F63B03Fe2792C21D7859883bd61CaEe70c', 20520)

  instance.createAchievement(
    0,
    'Character',
    'https://api.adorable.io/avatars/40/character',
    1,
    100
  )
  instance.createAchievement(
    1,
    'Quests',
    'https://api.adorable.io/avatars/40/quests',
    1,
    10000
  )
  instance.createAchievement(
    2,
    'ReputationWorld events',
    'https://api.adorable.io/avatars/40/world-events',
    1,
    2000
  )
  instance.createAchievement(
    3,
    'Reputation',
    'https://api.adorable.io/avatars/40/reputation',
    1,
    1000
  )
  instance.createAchievement(
    4,
    'Reached 10K Points',
    'https://api.adorable.io/avatars/40/10k-points',
    0,
    1
  )

  instance.unlockAchievement(
    0,
    '0x4ccd53f11be1604d90e9a1f08def5e8bcf65275d',
    95
  )
  instance.unlockAchievement(
    1,
    '0x4ccd53f11be1604d90e9a1f08def5e8bcf65275d',
    5500
  )
  instance.unlockAchievement(
    2,
    '0x4ccd53f11be1604d90e9a1f08def5e8bcf65275d',
    999
  )
  instance.unlockAchievement(
    3,
    '0x4ccd53f11be1604d90e9a1f08def5e8bcf65275d',
    200
  )
  instance.unlockAchievement(4, '0x4ccd53f11be1604d90e9a1f08def5e8bcf65275d', 1)

  instance.unlockAchievement(0, '0x04f080F63B03Fe2792C21D7859883bd61CaEe70c', 5)
  instance.unlockAchievement(
    3,
    '0x04f080F63B03Fe2792C21D7859883bd61CaEe70c',
    110
  )
}
