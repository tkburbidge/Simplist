<template>
  <md-layout md-column id="Content">
    <md-toolbar>
      <md-button id="SidenavToggleButton" class="md-icon-button" @click="toggleSidenav">
        <md-icon>menu</md-icon>
      </md-button>
      <h2 class="md-title list-name" style="flex: 1">{{list.name}}</h2>
      <md-menu ref="listMenu" v-if="list.name">
        <md-button class="md-icon-button" md-menu-trigger>
          <md-icon>more_horiz</md-icon>
        </md-button>

        <md-menu-content>
          <md-menu-item @click="toggleCompleted">
            {{ showCompleted ? 'Hide completed' : 'Show completed' }}
          </md-menu-item>
          <md-menu-item @click="openRenameListDialog">
            Rename List
          </md-menu-item>
          <md-menu-item @click="openDeleteListDialog" class="md-warn">
            Delete List
          </md-menu-item>
        </md-menu-content>

        <md-dialog-prompt
          md-title="Rename List"
          md-input-placeholder="List name..."
          v-model="prompt.newListName"
          @close="onCloseRenameDialog"
          ref="renameDialog">
        </md-dialog-prompt>
        <md-dialog-confirm
          md-title="Delete List"
          md-content-html="Are you sure you want to delete this list? This cannot be undone."
          md-ok-text="Delete"
          md-cancel-text="Nevermind"
          @close="onCloseDeleteDialog"
          ref="deleteDialog">
        </md-dialog-confirm>
      </md-menu>
    </md-toolbar>
    <div class="scroll-view" style="flex: 1" ref="scrollView">
      <div class="scroll-view-content">
        <md-layout md-gutter id="MainContent">
          <md-layout md-column>
              <md-table-card>
                <md-table>
                  <md-table-body>
                    <md-table-row v-for="item in items" :key="item.id">
                      <md-table-cell class="checkbox-cell">
                        <md-checkbox v-model="item.completedDate" @change="markItem(item, true)"></md-checkbox>
                      </md-table-cell>
                      <md-table-cell class="input-cell">
                        <input v-model="item.text" class="item-input" type="text" @keypress.enter="updateItem(item)" @blur="updateItem(item)"/>
                      </md-table-cell>
                    </md-table-row>
                    <template v-if="showCompleted">
                      <md-table-row v-for="item in completedItems" :key="item.id" class="completed">
                        <md-table-cell class="checkbox-cell">
                          <md-checkbox v-model="item.completedDate" @change="markItem(item, false)"></md-checkbox>
                        </md-table-cell>
                        <md-table-cell class="input-cell">
                          <input v-model="item.text" class="item-input" type="text" readonly/>
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
    <md-whiteframe id="NewItemInputContainer" md-elevation="2" v-if="list.name">
      <input placeholder="New item..." class="item-input" type="text" v-model="newItem" @keypress.enter="addItem" @blur="addItem" ref="newItemInput"/>
    </md-whiteframe>
    <md-snackbar ref="snackbar">
      <span>List deleted.</span>
    </md-snackbar>
  </md-layout>
</template>

<script>
import fire from '@/data/fire'
import firebase from 'firebase'
import router from '@/router/index'

export default {
  name: 'ListDetail',
  data () {
    this.listId = this.$route.params.id
    this.fetchInitialData()

    return {
      newItem: '',
      list: {},
      items: [],
      completedItems: [],
      listId: this.$route.params.id,
      showCompleted: false,
      prompt: {
        newListName: ''
      }
    }
  },
  computed: {
    nextOrder () {
      if (this.items.length > 0) {
        return (this.items[this.items.length - 1].order || 0) + 1
      }

      return 1
    }
  },
  watch: {
    showCompleted (newValue) {
      if (newValue === true) {
        this.fetchCompletedItems()
      }
    }
  },
  beforeRouteUpdate (to, from, next) {
    this.listId = to.params.id
    this.fetchInitialData()
    this.showCompleted = false
    next()
  },
  methods: {
    fetchInitialData () {
      this.listDoc = fire.firestore().collection('lists').doc(this.listId)
      this.listItemsCollection = fire.firestore().collection('lists').doc(this.listId).collection('items')
      this.itemsQuery = this.listItemsCollection.where('completedDate', '==', null).orderBy('order')
      this.completedItemsQuery = this.listItemsCollection.where('completedDate', '>', new Date('2010-01-01')).orderBy('completedDate', 'desc')
      this.listDoc.onSnapshot((querySnapshot) => {
        this.list = querySnapshot.data()
      })

      this.itemsQuery.onSnapshot((snap) => {
        this.items = snap.docs.map(d => {
          var temp = {...d.data()}
          temp.id = d.id
          return temp
        })
      })
    },
    fetchCompletedItems () {
      this.completedItemsQuery.onSnapshot((snap) => {
        this.completedItems = snap.docs.map(d => {
          var temp = {...d.data()}
          temp.id = d.id
          return temp
        })
      })
    },
    addItem () {
      if (this.newItem) {
        this.listItemsCollection.add({
          text: this.newItem,
          completedDate: null,
          createdDate: firebase.firestore.FieldValue.serverTimestamp(),
          order: this.nextOrder
        })
        this.newItem = ''

        setTimeout(() => {
          this.$refs.scrollView.scrollTo(0, this.$refs.scrollView.scrollHeight)
        }, 0)
      }
    },
    updateItem (item) {
      this.listItemsCollection.doc(item.id).update({
        text: item.text
      })
    },
    openRenameListDialog () {
      this.prompt.newListName = this.list.name
      setTimeout(() => {
        // Need this setTimeout so that the input inside the dialog retains focus. Otherwise, the closing menu steals it.
        this.$refs.renameDialog.open()
      }, 500)
    },
    onCloseRenameDialog (actionClicked) {
      if (actionClicked === 'ok') {
        this.listDoc.update({
          name: this.prompt.newListName
        })
      }
    },
    openDeleteListDialog () {
      this.$refs.deleteDialog.open()
    },
    onCloseDeleteDialog (actionClicked) {
      if (actionClicked === 'ok') {
        this.listItemsCollection.get().then((snapshot) => snapshot.docs.forEach((doc) => doc.delete()))
        this.listDoc.delete()
        this.$refs.snackbar.open()
        router.push('/Lists')
      }
    },
    markItem (item, completed) {
      var completedDate = completed ? firebase.firestore.FieldValue.serverTimestamp() : null
      this.listItemsCollection.doc(item.id).update({
        completedDate: completedDate
      })
    },
    toggleCompleted () {
      this.showCompleted = !this.showCompleted
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
