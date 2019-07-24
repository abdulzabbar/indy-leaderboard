<template>
  <section class="row mt-5">
    <table class="table">
      <thead>
        <tr>
          <th width="40">&nbsp;</th>
          <th>Title</th>
          <th>Ordering</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="(leaderboard, idx) in leaderboards" :key="idx">
          <td><img :src="leaderboard.Image" /></td>
          <td>
            <router-link :to="{ path: `/leaderboard/${leaderboard.Id}` }">
              {{ leaderboard.Title }}
            </router-link>
          </td>
          <td>
            {{ leaderboard.Order == 0 ? '&#9650; ASC' : '&#9660; DESC' }}
          </td>
        </tr>
      </tbody>
    </table>
  </section>
</template>

<script>
import { getLeaderboards } from '../actions/gameboard'

export default {
  name: 'Leaderboards',
  data() {
    return { leaderboards: {} }
  },
  mounted() {
    this.getLeaderboards()
  },
  methods: {
    async getLeaderboards() {
      const leaderboards = await getLeaderboards()
      this.$set(this, 'leaderboards', leaderboards)
    },
  },
}
</script>
