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
import router from '@/router/index'

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
        var newListId = this.$firebaseRefs.lists.push({
          name: this.prompt.value
        }).key

        // this.prompt.value = '' this is not workings
        router.push('/Lists/' + newListId)
      }
    }
  }
}

</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="scss">

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
</style>
