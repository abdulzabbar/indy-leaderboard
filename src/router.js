import Vue from 'vue'
import Router from 'vue-router'
import Leaderboards from './components/Leaderboards.vue'

Vue.use(Router)

export default new Router({
  routes: [
    {
      path: '/',
      name: 'home',
      component: Leaderboards,
    },
    {
      path: '/achievements',
      name: 'achievements',
      // route level code-splitting
      // this generates a separate chunk (about.[hash].js) for this route
      // which is lazy-loaded when the route is visited.
      component: () =>
        import(
          /* webpackChunkName: "achievements" */ './components/Achievements.vue'
        ),
    },
    {
      path: '/leaderboard/:id',
      name: 'leaderboard',
      // route level code-splitting
      // this generates a separate chunk (about.[hash].js) for this route
      // which is lazy-loaded when the route is visited.
      component: () =>
        import(
          /* webpackChunkName: "leaderboard" */ './components/LeaderboardScores.vue'
        ),
    },
    {
      path: '/user/:address',
      name: 'userUnlockedAchievements',
      component: () =>
        import(
          /* webpackChunkName: "userUnlockedAchievements" */ './components/UserUnlockedAchievements.vue'
        ),
    },
  ],
})
