<template>
  <md-layout md-column id="Content">
    <md-toolbar>
      <md-button id="SidenavToggleButton" class="md-icon-button" @click="toggleSidenav">
        <md-icon>menu</md-icon>
      </md-button>
      <h2 class="md-title list-name" style="flex: 1">{{list.name}}</h2>
      <md-menu>
        <md-button class="md-icon-button" md-menu-trigger>
          <md-icon>more_horiz</md-icon>
        </md-button>

        <md-menu-content>
          <md-menu-item @click="openRenameListDialog">
            Rename List
          </md-menu-item>
          <md-menu-item @click="toggleCompleted">
            {{ showCompleted ? 'Hide completed' : 'Show completed' }}
          </md-menu-item>
        </md-menu-content>

        <md-dialog-prompt
          md-title="Rename List"
          md-input-placeholder="List name..."
          v-model="prompt.newListName"
          @close="onCloseRenameDialog"
          ref="renameDialog">
        </md-dialog-prompt>
      </md-menu>
    </md-toolbar>
    <div class="scroll-view" style="flex: 1" ref="scrollView">
      <div class="scroll-view-content">
        <md-layout md-gutter id="MainContent">
          <md-layout md-column>
              <md-table-card>
                <md-table>
                  <md-table-body>
                    <md-table-row v-for="item in items" :key="item['.key']">
                      <md-table-cell class="checkbox-cell">
                        <md-checkbox v-model="item.completedDate" @change="markItem(item, true)"></md-checkbox>
                      </md-table-cell>
                      <md-table-cell class="input-cell">
                        <input :value="item.text" v-model="item.text" class="item-input" type="text" @keypress.enter="updateItem(item)" @blur="updateItem(item)"/>
                      </md-table-cell>
                    </md-table-row>
                    <template v-if="showCompleted">
                      <md-table-row v-for="item in orderedCompletedItems" :key="item['.key']" class="completed">
                        <md-table-cell class="checkbox-cell">
                          <md-checkbox v-model="item.completedDate" @change="markItem(item, false)"></md-checkbox>
                        </md-table-cell>
                        <md-table-cell class="input-cell">
                          <input :value="item.text" v-model="item.text" class="item-input" type="text" @keypress.enter="updateItem(item)" @blur="updateItem(item)"/>
                        </md-table-cell>
                      </md-table-row>
                    </template>
                  </md-table-body>
                </md-table>
              </md-table-card>
            </md-layout>
        </md-layout>
      </div>
    </div>
    <md-whiteframe id="NewItemInputContainer" md-elevation="2">
      <input placeholder="New item..." class="item-input" type="text" v-model="newItem" @keypress.enter="addItem" @blur="addItem" ref="newItemInput"/>
    </md-whiteframe>
  </md-layout>
</template>

<script>
import fire from '@/data/fire'

export default {
  name: 'ListDetail',
  data () {
    this.listId = this.$route.params.id
    this.$bindAsObject('list', fire.database().ref('/lists/' + this.$route.params.id))
    this.$bindAsArray('items', fire.database().ref('/listItems/' + this.listId).orderByChild('completedDate').endAt(false))
    this.$bindAsArray('completedItems', fire.database().ref('/listItems/' + this.listId).orderByChild('completedDate').startAt(1))

    return {
      newItem: '',
      listId: this.$route.params.id,
      // temporaryCompleted: [],
      showCompleted: false,
      prompt: {
        newListName: ''
      }
    }
  },
  computed: {
    orderedCompletedItems: function () {
      return this.completedItems.sort((a, b) => { return new Date(b.completedDate) - new Date(a.completedDate) })
    }
  },
  beforeRouteUpdate (to, from, next) {
    this.listId = to.params.id
    this.$bindAsArray('items', fire.database().ref('/listItems/' + this.listId).orderByChild('completedDate').endAt(false))
    this.$bindAsArray('completedItems', fire.database().ref('/listItems/' + this.listId).orderByChild('completedDate').startAt(1))
    this.$bindAsObject('list', fire.database().ref('/lists/' + this.listId))
    this.showCompleted = false
    // this.temporaryCompleted = []
    next()
  },
  methods: {
    addItem () {
      if (this.newItem) {
        this.$firebaseRefs.items.push({
          text: this.newItem
        })
        this.newItem = ''

        var self = this
        setTimeout(function () {
          self.$refs.scrollView.scrollTo(0, self.$refs.scrollView.scrollHeight)
        }, 0)
      }
    },
    updateItem (item) {
      this.$firebaseRefs.items.child(item['.key']).child('text').set(item.text)
    },
    openRenameListDialog () {
      this.prompt.newListName = this.list.name
      var self = this
      setTimeout(function () {
        self.$refs.renameDialog.open()
      }, 500)
    },
    onCloseRenameDialog (actionClicked) {
      if (actionClicked === 'ok') {
        this.$firebaseRefs.list.set({
          name: this.prompt.newListName
        })
      }
    },
    // deleteSelectedItems () {
    //   var updates = {}
    //   for (var i in this.selectedItems) {
    //     var key = this.selectedItems[i]['.key']
    //     updates[key] = null
    //   }
    //   this.$firebaseRefs.items.update(updates)
    // },
    // completeSelectedItems () {
    //   var updates = {}
    //   for (var i in this.selectedItems) {
    //     updates[this.selectedItems[i]['.key'] + '/completed'] = !this.selectedItems[i].completed
    //   }
    //   this.$firebaseRefs.items.update(updates)
    // },
    markItem (item, completed) {
      var updates = {}
      var completedDate = completed ? new Date() : null
      updates[item['.key'] + '/completedDate'] = completedDate
      this.$firebaseRefs.items.update(updates)
      // this.temporaryCompleted.push(item)
    },
    // itemsSelected (items) {
    //   this.selectedItems = items
    //   this.completeSelectedItems()
    // },
    toggleCompleted () {
      this.showCompleted = !this.showCompleted
      // if (this.showCompleted) {
      //   this.temporaryCompleted = []
      // }
    },
    toggleSidenav () {
      this.$emit('toggle-sidenav')
    }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="scss">
.item-input {
  width: 100%;
  border: none;
  background: transparent;
  outline: none;
  font-size: 16px;
}

#NewItemInputContainer {
  height: 60px;
  padding: 20px 25px;
}

#NewItemCell .md-table-cell-container {
  padding-left: 8px;
}

.completed {
  .item-input {
    text-decoration: line-through;
  }
}

.checkbox-cell {
  width: 40px;
}

.input-cell .md-table-cell-container {
  padding-left: 8px !important;
}
</style>
