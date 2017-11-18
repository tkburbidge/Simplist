<template>
  <div>
    <md-list>
      <md-list-item v-for="list in lists" :key="list.id">
        <router-link :to="{ path: '/Lists/' + list.id }">
          {{list.name}}
        </router-link>
      </md-list-item>
    </md-list>

    <md-button class="md-accent md-raised" id="AddListButton" @click="openAddDialog">
      New List
    </md-button>
    
    <md-dialog-prompt
      md-title="Create List"
      md-input-placeholder="List name..."
      v-model="prompt.value"
      @close="onCloseAddDialog"
      ref="addDialog">
    </md-dialog-prompt>
  </div>
</template>

<script>
import router from '@/router/index'
import listService from '@/data/listService'

export default {
  name: 'ListsIndex',
  data () {
    listService.getCurrentUserLists((lists) => {
      this.lists = lists
    })

    return {
      lists: [],
      prompt: {
        value: ''
      }
    }
  },
  computed: {
    nextOrder () {
      if (this.lists.length > 0) {
        return (this.lists[this.lists.length - 1].order || 0) + 1
      }

      return 1
    }
  },
  methods: {
    openAddDialog () {
      this.prompt.value = ''
      this.$refs.addDialog.open()
    },
    onCloseAddDialog (actionClicked) {
      if (actionClicked === 'ok') {
        listService.newList(this.prompt.value, this.nextOrder).then((list) => {
          router.push('/Lists/' + list.id)
        })
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
