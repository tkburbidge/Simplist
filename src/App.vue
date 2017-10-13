<template>
    <div id="App">
      <md-sidenav ref="sidenav" class="md-left md-fixed">
        <md-toolbar md-theme="white">
          <span class="md-title" style="flex:1">Simplist</span>
        </md-toolbar>
        <router-view></router-view>
      </md-sidenav>
      <router-view name="detail" @toggle-sidenav="toggleSidenav"></router-view>
    </div>
</template>

<script>
export default {
  name: 'app',
  methods: {
    toggleSidenav () {
      this.$refs.sidenav.toggle()
    }
  },
  watch: {
    '$route' () {
      this.$refs.sidenav.close()
    }
  }
}
</script>

<style>
html, body, #App {
  height: 100%;
  overflow: hidden;
}

@media (min-width: 700px) {
  #App .md-sidenav .md-sidenav-content {
    box-shadow: 0 1px 5px rgba(0,0,0,.2), 0 2px 2px rgba(0,0,0,.14), 0 3px 1px -2px rgba(0,0,0,.12);
    pointer-events: auto;
    transform: translate3D(0, 0, 0);
  } 
  #App {
    padding-left: 300px;
  }
  #SidenavToggleButton {
    display: none;
  }
  .list-name {
    padding-left: 20px;
  }
}

#Sidenav {
  width: 300px;
}

#Content {
  height: 100%;
}

.scroll-view {
  overflow-y: scroll;
  -webkit-overflow-scrolling: touch;
}

/* #App {
  padding-bottom: 50px;
} */
/* .md-sidenav .md-sidenav-content {
  top: 64px;
} */
/* #app {
  font-family: 'Avenir', Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  margin-top: 60px;
} */
/* #main-content {
  padding-top: 16px;
} */
</style>
