const inquirer = require('inquirer')
const gameLogic = require('./gameLogic')
const utils = require('./utils')

const insertDemoContent = async () => {
  await gameLogic.createLeaderboard({
    id: 0,
    title: '2V2 Arena',
    image: 'https://api.adorable.io/avatars/40/leaderboard1',
    order: 0,
  })
  await gameLogic.createLeaderboard({
    id: 1,
    title: '3V3 Arena',
    image: 'https://api.adorable.io/avatars/40/leaderboard2',
    order: 0,
  })
  await gameLogic.createLeaderboard({
    id: 2,
    title: '10V10 Battlegrounds',
    image: 'https://api.adorable.io/avatars/40/leaderboard3',
    order: 1,
  })
  await gameLogic.createLeaderboard({
    id: 3,
    title: 'Open World',
    image: 'https://api.adorable.io/avatars/40/leaderboard4',
    order: 1,
  })

  await gameLogic.setScore({
    leaderboardId: 0,
    userId: '0x4ccd53f11be1604d90e9a1f08def5e8bcf65275d',
    value: 100,
  })
  await gameLogic.setScore({
    leaderboardId: 0,
    userId: '0x04f080F63B03Fe2792C21D7859883bd61CaEe70c',
    value: 200,
  })
  await gameLogic.setScore({
    leaderboardId: 1,
    userId: '0x4ccd53f11be1604d90e9a1f08def5e8bcf65275d',
    value: 1060,
  })
  await gameLogic.setScore({
    leaderboardId: 1,
    userId: '0x04f080F63B03Fe2792C21D7859883bd61CaEe70c',
    value: 20900,
  })
  await gameLogic.setScore({
    leaderboardId: 2,
    userId: '0x4ccd53f11be1604d90e9a1f08def5e8bcf65275d',
    value: 1100,
  })
  await gameLogic.setScore({
    leaderboardId: 2,
    userId: '0x04f080F63B03Fe2792C21D7859883bd61CaEe70c',
    value: 2050,
  })
  await gameLogic.setScore({
    leaderboardId: 3,
    userId: '0x4ccd53f11be1604d90e9a1f08def5e8bcf65275d',
    value: 11010,
  })
  await gameLogic.setScore({
    leaderboardId: 3,
    userId: '0x04f080F63B03Fe2792C21D7859883bd61CaEe70c',
    value: 20520,
  })

  await gameLogic.createAchievement({
    id: 0,
    title: 'Character',
    image: 'https://api.adorable.io/avatars/40/character',
    type: 1,
    maxValue: 100,
  })
  await gameLogic.createAchievement({
    id: 1,
    title: 'Quests',
    image: 'https://api.adorable.io/avatars/40/quests',
    type: 1,
    maxValue: 10000,
  })
  await gameLogic.createAchievement({
    id: 2,
    title: 'ReputationWorld events',
    image: 'https://api.adorable.io/avatars/40/world-events',
    type: 1,
    maxValue: 2000,
  })
  await gameLogic.createAchievement({
    id: 3,
    title: 'Reputation',
    image: 'https://api.adorable.io/avatars/40/reputation',
    type: 1,
    maxValue: 1000,
  })
  await gameLogic.createAchievement({
    id: 4,
    title: 'Reached 10K Points',
    image: 'https://api.adorable.io/avatars/40/10k-points',
    type: 0,
    maxValue: 1,
  })

  await gameLogic.unlockAchievement({
    achievementId: 0,
    userId: '0x4ccd53f11be1604d90e9a1f08def5e8bcf65275d',
    value: 95,
  })
  await gameLogic.unlockAchievement({
    achievementId: 1,
    userId: '0x4ccd53f11be1604d90e9a1f08def5e8bcf65275d',
    value: 5500,
  })
  await gameLogic.unlockAchievement({
    achievementId: 2,
    userId: '0x4ccd53f11be1604d90e9a1f08def5e8bcf65275d',
    value: 999,
  })
  await gameLogic.unlockAchievement({
    achievementId: 3,
    userId: '0x4ccd53f11be1604d90e9a1f08def5e8bcf65275d',
    value: 200,
  })
  await gameLogic.unlockAchievement({
    achievementId: 4,
    userId: '0x4ccd53f11be1604d90e9a1f08def5e8bcf65275d',
    value: 1,
  })

  await gameLogic.unlockAchievement({
    achievementId: 0,
    userId: '0x04f080F63B03Fe2792C21D7859883bd61CaEe70c',
    value: 5,
  })
  await gameLogic.unlockAchievement({
    achievementId: 3,
    userId: '0x04f080F63B03Fe2792C21D7859883bd61CaEe70c',
    value: 110,
  })
}

const logic = async ({ action }) => {
  try {
    const contract = await gameLogic.getWeb3ContractInstance()
    const now = Date.now()

    if (action === 'createLeaderboard') {
      let randomContent = {
        id: now,
        title: utils.generateTitle(),
        image: `https://placeimg.com/40/40/${now}'`,
        order: utils.getRandomInt(0, 1),
      }

      const dataTypeInput = await inquirer.prompt(
        userOptions.createLeaderboard(randomContent)
      )

      if (dataTypeInput.action === 'customData') {
        const customDataInput = await inquirer.prompt(
          userOptions.createLeaderboardCustomData(randomContent)
        )

        randomContent = { ...randomContent, customDataInput }
      }

      await gameLogic.createLeaderboard(randomContent)
      console.log('New leaderboard has been created!')
    } else if (action === 'createAchievement') {
      const type = utils.getRandomInt(0, 1)
      const maxValue = type == 0 ? 1 : utils.getRandomInt(0, 1000000)

      let randomContent = {
        id: now,
        title: utils.generateTitle(),
        image: `https://placeimg.com/40/40/${now}'`,
        type,
        maxValue,
      }

      const dataTypeInput = await inquirer.prompt(
        userOptions.createAchievement(randomContent)
      )

      if (dataTypeInput.action === 'customData') {
        const customDataInput = await inquirer.prompt(
          userOptions.createAchievementCustomData(randomContent)
        )

        randomContent = { ...randomContent, customDataInput }
      }

      await gameLogic.createAchievement(randomContent)
      console.log('New achievement has been created!')
    } else if (action === 'setScore') {
      const randomAccount = await gameLogic.getWeb3().eth.accounts.create()

      const latestLeaderbord = await gameLogic
        .getWeb3()
        .db.get(contract._address, 'Leaderboards', '', 'Id DESC', 'latest')

      let randomContent = {
        leaderboardId: latestLeaderbord.Id,
        userId: randomAccount.address,
        value: utils.getRandomInt(0, 1000000),
      }
      console.log('TCL: logic -> randomContent', randomContent)

      const dataTypeInput = await inquirer.prompt(
        userOptions.setScore(randomContent)
      )

      if (dataTypeInput.action === 'customData') {
        const customDataInput = await inquirer.prompt(
          userOptions.setScoreCustomData(randomContent)
        )

        randomContent = { ...randomContent, customDataInput }
      }

      await gameLogic.setScore(randomContent)
      console.log('Score set!')
    } else if (action === 'unlockAchievement') {
      const latestAchievement = await gameLogic
        .getWeb3()
        .db.get(contract._address, 'Achievements', '', 'Id DESC', 'latest')

      let value
      if (latestAchievement.Type == 0) {
        value = utils.getRandomInt(0, 1)
      } else {
        value = utils.getRandomInt(0, latestAchievement.MaxValue)
      }

      const randomExistingUser = await gameLogic
        .getWeb3()
        .db.get(contract._address, 'Scores', '', 'LeaderboardId DESC', 'latest')

      let randomContent = {
        achievementId: latestAchievement.Id,
        userId: randomExistingUser.UserId,
        value,
      }

      const dataTypeInput = await inquirer.prompt(
        userOptions.unlockAchievement(randomContent)
      )

      if (dataTypeInput.action === 'customData') {
        const customDataInput = await inquirer.prompt(
          userOptions.unlockAchievementCustomData(randomContent)
        )

        randomContent = { ...randomContent, customDataInput }
      }

      await gameLogic.unlockAchievement(randomContent)
      console.log('Achievement unlocked!')
    } else if (action === 'demoContent') {
      await insertDemoContent()
    }
  } catch (err) {
    console.log('Current command execution failed with error', err)
  }

  inquirer.prompt(userOptions.main).then(logic)
}

const userOptions = {
  main: [
    {
      type: 'list',
      name: 'action',
      message: 'What do you want to do?',
      choices: [
        {
          key: '1',
          name: '1. Create new leaderboard',
          value: 'createLeaderboard',
        },
        {
          key: '2',
          name: '2. Create new achievement',
          value: 'createAchievement',
        },
        {
          key: '3',
          name: '3. Set user score',
          value: 'setScore',
        },
        {
          key: '4',
          name: '4. Unlock user achievement',
          value: 'unlockAchievement',
        },
        new inquirer.Separator(),
        {
          key: '5',
          name: '5. Insert demo content',
          value: 'demoContent',
        },
      ],
    },
  ],
  createLeaderboard: randomData => [
    {
      type: 'list',
      name: 'action',
      message: 'What data shall we use for your new leaderboard?',
      choices: [
        {
          key: '1',
          name: `1. Use random data:\ncreateLeaderboard(${JSON.stringify(
            randomData
          )})`,
          value: 'randomData',
        },
        {
          key: '2',
          name: '2. Enter your own data',
          value: 'customData',
        },
      ],
    },
  ],
  createLeaderboardCustomData: randomData => [
    {
      type: 'input',
      name: 'id',
      message: 'Leaderboard ID',
      default: randomData.id,
    },
    {
      type: 'input',
      name: 'title',
      message: 'Title',
      default: randomData.title,
    },
    {
      type: 'input',
      name: 'image',
      message: 'Image',
      default: randomData.image,
    },
    {
      type: 'list',
      name: 'order',
      message: 'Scores ordering',
      choices: [
        {
          name: 'ASC',
          value: 0,
        },
        {
          name: 'DESC',
          value: 1,
        },
      ],
    },
  ],
  createAchievement: randomData => [
    {
      type: 'list',
      name: 'action',
      message: 'What data shall we use for your new achievement?',
      choices: [
        {
          key: '1',
          name: `1. Use random data:\ncreateAchievement(${JSON.stringify(
            randomData
          )})`,
          value: 'randomData',
        },
        {
          key: '2',
          name: '2. Enter your own data',
          value: 'customData',
        },
      ],
    },
  ],
  createAchievementCustomData: randomData => [
    {
      type: 'input',
      name: 'id',
      message: 'Achievement ID',
      default: randomData.id,
    },
    {
      type: 'input',
      name: 'title',
      message: 'Title',
      default: randomData.title,
    },
    {
      type: 'input',
      name: 'image',
      message: 'Image',
      default: randomData.image,
    },
    {
      type: 'list',
      name: 'type',
      message: 'Achievement type',
      choices: [
        {
          name: 'Boolean',
          value: 0,
        },
        {
          name: 'Progressive',
          value: 1,
        },
      ],
    },
    {
      type: 'input',
      name: 'maxValue',
      message: 'Max Value',
      default: randomData.maxValue,
      when: input => input.type == 1,
    },
  ],
  setScore: randomData => [
    {
      type: 'list',
      name: 'action',
      message: 'What data shall we use for setting user score?',
      choices: [
        {
          key: '1',
          name: `1. Use random data:\nsetScore(${JSON.stringify(randomData)})`,
          value: 'randomData',
        },
        {
          key: '2',
          name: '2. Enter your own data',
          value: 'customData',
        },
      ],
    },
  ],
  setScoreCustomData: randomData => [
    {
      type: 'input',
      name: 'leaderboardId',
      message: 'Leaderboard ID',
      default: randomData.leaderboardId,
    },
    {
      type: 'input',
      name: 'userId',
      message: 'User Address',
      default: randomData.userId,
    },
    {
      type: 'input',
      name: 'value',
      message: 'User score',
      default: randomData.value,
      filter: Number,
    },
  ],
  unlockAchievement: randomData => [
    {
      type: 'list',
      name: 'action',
      message: "What data shall we use for unlocking users' achivement?",
      choices: [
        {
          key: '1',
          name: `1. Use random data:\nunlockAchievement(${JSON.stringify(
            randomData
          )})`,
          value: 'randomData',
        },
        {
          key: '2',
          name: '2. Enter your own data',
          value: 'customData',
        },
      ],
    },
  ],
  unlockAchievementCustomData: randomData => [
    {
      type: 'input',
      name: 'achievementId',
      message: 'Achievement ID',
      default: randomData.achievementId,
    },
    {
      type: 'input',
      name: 'userId',
      message: 'User Address',
      default: randomData.userId,
    },
    {
      type: 'input',
      name: 'value',
      message: 'Achievement value',
      default: randomData.value,
      choices: [
        {
          name: 'False',
          value: 0,
        },
        {
          name: 'True',
          value: 1,
        },
      ],
      when: input => input.type == 0,
    },
    {
      type: 'input',
      name: 'value',
      message: 'Achievement value',
      default: randomData.value,
      filter: Number,
      when: input => input.type == 1,
    },
  ],
}

inquirer.prompt(userOptions.main).then(logic)
