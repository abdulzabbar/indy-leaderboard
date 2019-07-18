<template>
  <div id="app" class="container">
    <div class="row mt-3 align-items-center">
      <router-link to="/" class="col-2 justify-content-center">
        <img alt="Ebakus" src="./assets/logo.png" />
      </router-link>
      <div id="nav" class="col justify-content-start">
        <router-link to="/">Home</router-link> |
        <router-link to="/achievements">Achievements</router-link>
      </div>
    </div>

    <router-view />

    <div class="fixed-bottom p-3 bg-light">
      This demonstration dApp is used as a proof of concept for developers on
      how they can utilize the EbakusDB for their own dApps. <br />
      Code written is not production ready and might not follow the best
      practices either.
    </div>
  </div>
</template>

<script>
export default {
  name: 'app',
}
</script>

<style lang="scss">
#app {
  font-family: 'Avenir', Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
}

#nav {
  a {
    font-weight: bold;
    color: #2c3e50;
    &.router-link-exact-active {
      color: #42b983;
    }
  }
}
</style>
