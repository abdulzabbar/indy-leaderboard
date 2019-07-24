<template>
  <section class="row mt-5">
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
            <img :src="`https://api.adorable.io/avatars/40/${score.UserId}`" />
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
  </section>
</template>

<script>
import { getLeaderboard, getLeaderboardScores } from '../actions/gameboard'

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
  },
}
</script>
