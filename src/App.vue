<template>
    <div id="App">
      <router-view></router-view>
    </div>
</template>

<script>
export default {
  name: 'app'
}
</script>

<style>
html, body, #App {
  height: 100%;
  overflow: hidden;
}

.scroll-view {
  overflow-y: scroll;
  -webkit-overflow-scrolling: touch;
}
</style>
