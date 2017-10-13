import firebase from 'firebase'

firebase.auth().onAuthStateChanged((user) => {
  if (user) {
    // User is signed in.

    // var displayName = user.displayName;
    // var email = user.email;
    // var emailVerified = user.emailVerified;
    // var photoURL = user.photoURL;
    // var isAnonymous = user.isAnonymous;
    // var uid = user.uid;
    // var providerData = user.providerData;
    // ...
  } else {
    // User is signed out.
    // ...
  }
})

export function isLoggedIn () {
  return firebase.auth().currentUser !== null
}

export function requireAuth (to, from, next) {
  debugger
  if (!isLoggedIn()) {
    next({
      path: '/login',
      query: { redirect: to.fullPath }
    })
  } else {
    next()
  }
}
