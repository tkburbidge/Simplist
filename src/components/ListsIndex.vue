<template>
  <div>
    <md-list>
      <md-list-item v-for="list in lists" :key="list['.key']">
        <router-link :to="{ path: '/Lists/' + list['.key'] }">
          {{list.name}}
        </router-link>
      </md-list-item>
    </md-list>

    <md-button class="md-accent md-raised" id="AddListButton" @click="openAddDialog">
      New List
    </md-button>
    
    <md-dialog-prompt
      :md-title="prompt.title"
      :md-input-placeholder="prompt.placeholder"
      v-model="prompt.value"
      @close="onCloseAddDialog"
      ref="addDialog">
    </md-dialog-prompt>
  </div>
</template>

<script>
import fire from '../data/fire'

export default {
  name: 'ListsIndex',
  data: () => {
    return {
      prompt: {
        title: 'Create List',
        placeholder: 'List name...',
        value: ''
      }
    }
  },
  firebase: {
    lists: fire.database().ref('/lists')
  },
  methods: {
    openAddDialog () {
      this.$refs.addDialog.open()
    },
    onCloseAddDialog (actionClicked) {
      if (actionClicked === 'ok') {
        this.$firebaseRefs.lists.push({
          name: this.prompt.value
        })
      }
    }
  }
}

// document.addEventListener('blur', function (e) {
//   if (e.relatedTarget.nodeName === 'INPUT') {
//     debugger
//   }
// }, true)
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang="scss">
</style>
