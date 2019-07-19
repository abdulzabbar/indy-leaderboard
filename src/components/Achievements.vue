<template>
  <section class="mt-5">
    <div class="row">
      <h1>Achievements</h1>
      <button
        class="btn btn-outline-primary ml-auto"
        @click="createRandomAchievement()"
      >
        Create new achievement
      </button>
    </div>

    <div class="row mt-3">
      <table class="table">
        <thead>
          <tr>
            <th width="40">&nbsp;</th>
            <th>Title</th>
            <th>Type</th>
            <th>MaxValue</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="(leaderboard, idx) in achievements" :key="idx">
            <td><img :src="leaderboard.Image" /></td>
            <td>{{ leaderboard.Title }}</td>
            <td>{{ leaderboard.Type == 0 ? 'Boolean' : 'Progressive' }}</td>
            <td>{{ leaderboard.Type == 0 ? '-' : leaderboard.MaxValue }}</td>
          </tr>
        </tbody>
      </table>
    </div>
  </section>
</template>

<script>
import { getAchievements, createAchievement } from '../actions/gameboard'
import { generateTitle, getRandomInt } from '../utils/generators'

export default {
  name: 'Achievements',
  data() {
    return { achievements: {} }
  },
  mounted() {
    this.getAchievements()
  },
  methods: {
    createRandomAchievement() {
      const self = this

      const type = getRandomInt(0, 1)
      const maxValue =
        type == 0
          ? 1
          : getRandomInt(Number.MIN_SAFE_INTEGER, Number.MAX_SAFE_INTEGER)

      createAchievement(
        /* id */ self.achievements.length,
        /* title */ generateTitle(),
        /* image */ 'https://placeimg.com/40/40/any',
        type,
        maxValue
      ).then(() => self.getAchievements())
    },
    async getAchievements() {
      const achievements = await getAchievements()
      this.$set(this, 'achievements', achievements)
    },
  },
}
</script>
