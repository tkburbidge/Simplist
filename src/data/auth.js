import firebase from 'firebase'

export function isLoggedIn () {
  return firebase.auth().currentUser !== null
}

export function currentUserId () {
  return firebase.auth().currentUser.uid
}

export function requireAuth (to, from, next) {
  if (!isLoggedIn()) {
    next({
      path: '/Login',
      query: { redirect: to.fullPath }
    })
  } else {
    next()
  }
}
