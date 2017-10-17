<template>
  <div style="height: 100%">
    <md-sidenav ref="sidenav" class="md-left md-fixed" @close="sidebarClosing">
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
    toggleSidenav (value) {
      if (value === true) {
        this.$refs.sidenav.open()
      } else if (value === false) {
        this.$refs.sidenav.close()
      } else {
        this.$refs.sidenav.toggle()
      }
    },
    sidebarClosing () {
      if (this.$route.params.id === undefined) {
        this.toggleSidenav(true)
      }
    }
  },
  mounted () {
    this.toggleSidenav(this.$route.params.id === undefined)
  },
  watch: {
    '$route' () {
      this.toggleSidenav(this.$route.params.id === undefined)
    }
  }
}
</script>

<style>

</style>
