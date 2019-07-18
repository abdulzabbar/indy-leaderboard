<template>
  <section class="mt-5">
    <div class="row">
      <h1>Unlocked achievements for</h1>
      <h2>{{ $route.params.address }}</h2>
      <button
        class="btn btn-outline-primary ml-auto"
        v-if="walletAddress == $route.params.address"
        @click="unlockRandomAchievement()"
      >
        Unlock achievement
      </button>
    </div>

    <div class="row mt-3">
      <table class="table">
        <thead>
          <tr>
            <th width="40">&nbsp;</th>
            <th>Achievement</th>
            <th>Value</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="(achievement, idx) in unlockedAchievements" :key="idx">
            <td>
              <img :src="achievementImage(achievement.AchievementId)" />
            </td>
            <td>{{ achievementName(achievement.AchievementId) }}</td>
            <td>
              {{
                achievementValue(achievement.AchievementId, achievement.Value)
              }}
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  </section>
</template>

<script>
import {
  getAchievements,
  getUnlockedAchievements,
  unlockAchievement,
} from '../actions/gameboard'
import { getRandomInt } from '../utils/generators'

export default {
  name: 'unlockedAchievements',
  data() {
    return {
      achievements: [],
      unlockedAchievements: [],
      walletAddress: null,
    }
  },
  watch: {
    $route(to) {
      this.getUnlockedAchievements(to.params.address)
    },
  },
  async mounted() {
    const achievements = await getAchievements()
    this.$set(this, 'achievements', achievements)

    this.getUnlockedAchievements(this.$route.params.address)
    this.getWalletAddress()
  },
  methods: {
    achievementName: function(id) {
      const item = this.achievements.find(achievement => achievement.Id == id)
      return item ? item.Title : `Achievement #${id}`
    },
    achievementImage: function(id) {
      const item = this.achievements.find(achievement => achievement.Id == id)
      return item ? item.Image : null
    },
    achievementValue: function(id, val) {
      const achievement = this.achievements.find(a => a.Id == id)
      return achievement && achievement.Type == 0
        ? !!val
        : `${val} / ${achievement.MaxValue}`
    },
    async getUnlockedAchievements(id) {
      const unlockedAchievements = await getUnlockedAchievements(id)
      this.$set(this, 'unlockedAchievements', unlockedAchievements)
    },
    async getWalletAddress() {
      const address = await window.ebakusWallet.getDefaultAddress()
      this.walletAddress = address
    },
    unlockRandomAchievement() {
      const self = this
      window.ebakusWallet.getDefaultAddress().then(async address => {
        const randomAchivementId = getRandomInt(0, this.achievements.length - 1)
        const achievement = self.achievements[randomAchivementId]

        let val
        if (achievement.Type == 0) {
          val = getRandomInt(0, 1)
        } else {
          val = getRandomInt(Number.MIN_SAFE_INTEGER, Number.MAX_SAFE_INTEGER)
        }

        await unlockAchievement(
          /* achievementId */ achievement.Id,
          /* user */ address,
          /* value */ val
        )

        self.getUnlockedAchievements(self.$route.params.address)
      })
    },
  },
}
</script>
