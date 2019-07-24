<template>
  <section class="mt-5">
    <div class="row">
      <h1>Scores for "{{ leaderboard.Title }}" leaderboard</h1>
      <button class="btn btn-outline-primary ml-auto" @click="setRandomScore()">
        Set user score
      </button>
    </div>

    <div class="row mt-3">
      <table class="table">
        <thead>
          <tr>
            <th width="40">&nbsp;</th>
            <th>User</th>
            <th>Value</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="(score, idx) in leaderboardScores" :key="idx">
            <td>
              <img
                :src="`https://api.adorable.io/avatars/40/${score.UserId}`"
              />
            </td>
            <td>
              <router-link :to="{ path: `/user/${score.UserId}` }">
                {{ score.UserId }}
              </router-link>
            </td>
            <td>{{ score.Value }}</td>
          </tr>
        </tbody>
      </table>
    </div>
  </section>
</template>

<script>
import {
  getLeaderboard,
  getLeaderboardScores,
  setScore,
} from '../actions/gameboard'
import { getRandomInt } from '../utils/generators'

export default {
  name: 'leaderboardScores',
  data() {
    return {
      leaderboard: {},
      leaderboardScores: [],
    }
  },
  watch: {
    $route(to) {
      this.getLeaderboardScores(to.params.id)
    },
  },
  async mounted() {
    const leaderboard = await getLeaderboard(this.$route.params.id)
    this.$set(this, 'leaderboard', leaderboard)

    this.getLeaderboardScores(this.$route.params.id)
  },
  methods: {
    async getLeaderboardScores(id) {
      const scores = await getLeaderboardScores(id, this.leaderboard.Order)
      this.$set(this, 'leaderboardScores', scores)
    },
    setRandomScore() {
      const self = this
      window.ebakusWallet.getDefaultAddress().then(async address => {
        await setScore(
          /* leaderboardId */ this.$route.params.id,
          /* user */ address,
          /* value */ getRandomInt(
            Number.MIN_SAFE_INTEGER,
            Number.MAX_SAFE_INTEGER
          )
        )

        self.getLeaderboardScores(self.$route.params.id)
      })
    },
  },
}
</script>
