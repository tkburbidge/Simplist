import fire from '@/data/fire'
import firebase from 'firebase'

export default {

  watchCurrentUserLists (callback) {
    fire.firestore().collection('lists').orderBy('order').onSnapshot((querySnapshot) => {
      var lists = querySnapshot.docs.map(d => {
        var thing = {...d.data()}
        thing.id = d.id
        return thing
      })

      callback(lists)
    })
  },

  newList (name, order) {
    return fire.firestore().collection('lists').add({
      name: name,
      order: order
    })
  },

  renameList (listId, newName) {
    fire.firestore().collection('lists').doc(listId).update({
      name: newName
    })
  },

  getList (listId, callback) {
    return fire.firestore().collection('lists').doc(listId).onSnapshot((querySnapshot) => {
      callback(querySnapshot.data())
    })
  },

  getItems (listId, callback) {
    return fire.firestore().collection('lists').doc(listId).collection('items').where('completedDate', '==', null).orderBy('order').onSnapshot((snap) => {
      callback(snap.docs.map(d => {
        var temp = {...d.data()}
        temp.id = d.id
        return temp
      }))
    })
  },

  getCompletedItems (listId, callback) {
    return fire.firestore().collection('lists').doc(listId).collection('items').where('completedDate', '>', new Date('2010-01-01')).orderBy('completedDate', 'desc').onSnapshot((snap) => {
      callback(snap.docs.map(d => {
        var temp = {...d.data()}
        temp.id = d.id
        return temp
      }))
    })
  },

  addItemToList (listId, item) {
    item.createdDate = firebase.firestore.FieldValue.serverTimestamp()
    fire.firestore().collection('lists').doc(listId).collection('items').add(item)
  },

  updateItem (listId, itemId, newText) {
    fire.firestore().collection('lists').doc(listId).collection('items').doc(itemId).update({
      text: newText
    })
  },

  deleteList (listId) {
    fire.firestore().collection('lists').doc(listId).collection('items').get().then((snapshot) => snapshot.docs.forEach((doc) => doc.delete()))
    fire.firestore().collection('lists').doc(listId).delete()
  },

  markItem (listId, itemId, completed) {
    var completedDate = completed ? firebase.firestore.FieldValue.serverTimestamp() : null
    fire.firestore().collection('lists').doc(listId).collection('items').doc(itemId).update({
      completedDate: completedDate
    })
  }
}
