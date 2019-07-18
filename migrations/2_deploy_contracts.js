var EbakusDB = artifacts.require('EbakusDB')
var GameBoard = artifacts.require('GameBoard')

module.exports = async function(deployer) {
  deployer.deploy(EbakusDB, { overwrite: false })
  deployer.link(EbakusDB, GameBoard)
  await deployer.deploy(GameBoard)

  console.log('GameBoard address: ', GameBoard.address)

  const instance = await GameBoard.deployed()
  instance.createLeaderboard(
    0,
    'Leaderboard 0',
    'https://placeimg.com/40/40/any',
    0
  )
  instance.createLeaderboard(
    1,
    'Leaderboard 1',
    'https://placeimg.com/40/40/any',
    0
  )
  instance.createLeaderboard(
    2,
    'Leaderboard 2 Desc',
    'https://placeimg.com/40/40/any',
    1
  )
  instance.createLeaderboard(
    3,
    'Leaderboard 3 Desc',
    'https://placeimg.com/40/40/any',
    1
  )

  instance.createAchievement(
    0,
    'Achievement 0 Bool',
    'https://placeimg.com/40/40/any',
    0,
    1
  )
  instance.createAchievement(
    1,
    'Achievement 1 Bool',
    'https://placeimg.com/40/40/any',
    0,
    1
  )
  instance.createAchievement(
    2,
    'Achievement 2 Prog (100)',
    'https://placeimg.com/40/40/any',
    1,
    100
  )
  instance.createAchievement(
    3,
    'Achievement 3 Prog (200)',
    'https://placeimg.com/40/40/any',
    1,
    200
  )

  instance.setScore(0, '0x4ccd53f11be1604d90e9a1f08def5e8bcf65275d', 100)
  instance.setScore(0, '0x04f080F63B03Fe2792C21D7859883bd61CaEe70c', 200)
  instance.setScore(2, '0x4ccd53f11be1604d90e9a1f08def5e8bcf65275d', 100)
  instance.setScore(2, '0x04f080F63B03Fe2792C21D7859883bd61CaEe70c', 200)

  instance.unlockAchievement(0, '0x4ccd53f11be1604d90e9a1f08def5e8bcf65275d', 1)
  instance.unlockAchievement(1, '0x4ccd53f11be1604d90e9a1f08def5e8bcf65275d', 0)
  instance.unlockAchievement(
    2,
    '0x4ccd53f11be1604d90e9a1f08def5e8bcf65275d',
    99
  )
  instance.unlockAchievement(
    3,
    '0x4ccd53f11be1604d90e9a1f08def5e8bcf65275d',
    200
  )
}
