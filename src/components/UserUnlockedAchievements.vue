<template>
  <section class="row mt-5">
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
            {{ achievementValue(achievement.AchievementId, achievement.Value) }}
          </td>
        </tr>
      </tbody>
    </table>
  </section>
</template>

<script>
import {
  getAchievements,
  getUnlockedAchievements,
  listenForAchievementUnlocked,
} from '../actions/gameboard'

export default {
  name: 'unlockedAchievements',
  data() {
    return {
      achievements: [],
      unlockedAchievements: [],
      eventListener: null,
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
    this.eventListener = await listenForAchievementUnlocked(
      this.$route.params.address,
      async () => {
        const achievements = await getAchievements()
        this.$set(this, 'achievements', achievements)
        this.getUnlockedAchievements(this.$route.params.address)
      }
    )
  },
  beforeDestroy() {
    if (this.eventListener) {
      this.eventListener.unsubscribe()
    }
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
  },
}
</script>
