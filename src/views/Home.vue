<template>
  <div class="home">
    <Leaderboards />

    <Achievements />
  </div>
</template>

<script>
import Leaderboards from '../components/Leaderboards.vue'
import Achievements from '../components/Achievements.vue'

export default {
  name: 'home',
  components: {
    Leaderboards,
    Achievements,
  },
}
</script>
