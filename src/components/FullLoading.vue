<template>
  <md-layout md-column md-align="center" style="height: 100%">
    <md-layout md-row md-align="center" md-vertical-align="center">
      <md-spinner :md-size="100" :md-indeterminate="true"></md-spinner>
    </md-layout>
  </md-layout>
</template>

<script>
export default {
  name: 'loading'
}
</script>

<style>
html, body, #app {
  height: 100%;
  overflow: hidden;
}

.scroll-view {
  overflow-y: scroll;
  -webkit-overflow-scrolling: touch;
}
</style>
