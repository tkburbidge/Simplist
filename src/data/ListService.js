import fire from '@/data/fire'
import firebase from 'firebase'

export default {

  getCurrentUserLists (callback) {
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
    var owners = {}
    return fire.firestore().collection('lists').add({
      name: name,
      order: order,
      owners: owners
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
    return fire.firestore().collection('lists').doc(listId).collection('items').where('completedDate', '==', null).orderBy('order', 'asc').onSnapshot((snap) => {
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
    return deleteCollection(fire.firestore(), fire.firestore().collection('lists').doc(listId).collection('items'), 10)
      .then(() => {
        fire.firestore().collection('lists').doc(listId).delete()
      })
  },

  markItem (listId, itemId, completed) {
    var completedDate = completed ? firebase.firestore.FieldValue.serverTimestamp() : null
    fire.firestore().collection('lists').doc(listId).collection('items').doc(itemId).update({
      completedDate: completedDate
    })
  }
}

/**
 * Delete a collection, in batches of batchSize. Note that this does
 * not recursively delete subcollections of documents in the collection
 */
function deleteCollection (db, collectionRef, batchSize) {
  var query = collectionRef.orderBy('__name__').limit(batchSize)

  return new Promise(function (resolve, reject) {
    deleteQueryBatch(db, query, batchSize, resolve, reject)
  })
}

function deleteQueryBatch (db, query, batchSize, resolve, reject) {
  query.get()
      .then((snapshot) => {
          // When there are no documents left, we are done
        if (snapshot.size === 0) {
          return 0
        }

        // Delete documents in a batch
        var batch = db.batch()
        snapshot.docs.forEach(function (doc) {
          batch.delete(doc.ref)
        })

        return batch.commit().then(function () {
          return snapshot.size
        })
      }).then(function (numDeleted) {
        if (numDeleted <= batchSize) {
          resolve()
          return
        }

        // Recurse on the next process tick, to avoid
        // exploding the stack.
        process.nextTick(function () {
          deleteQueryBatch(db, query, batchSize, resolve, reject)
        })
      })
      .catch(reject)
}
