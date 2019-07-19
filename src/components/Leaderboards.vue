<template>
  <section class="mt-5">
    <div class="row">
      <h1>Leaderboards</h1>
      <button
        class="btn btn-outline-primary ml-auto"
        @click="createRandomLeaderboard()"
      >
        Create new leaderboard
      </button>
    </div>

    <div class="row mt-3">
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
    </div>
  </section>
</template>

<script>
import { getLeaderboards, createLeaderboard } from '../actions/gameboard'
import { generateTitle, getRandomInt } from '../utils/generators'

export default {
  name: 'Leaderboards',
  data() {
    return { leaderboards: {} }
  },
  mounted() {
    this.getLeaderboards()
  },
  methods: {
    createRandomLeaderboard() {
      const self = this

      createLeaderboard(
        /* id */ self.leaderboards.length,
        /* title */ generateTitle(),
        /* image */ 'https://placeimg.com/40/40/any',
        /* order */ getRandomInt(0, 1)
      ).then(() => self.getLeaderboards())
    },
    async getLeaderboards() {
      const leaderboards = await getLeaderboards()
      this.$set(this, 'leaderboards', leaderboards)
    },
  },
}
</script>
