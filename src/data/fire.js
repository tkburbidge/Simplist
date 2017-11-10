import firebase from 'firebase'
import 'firebase/firestore'

// Initialize Firebase
var config = {
  apiKey: 'AIzaSyCbaSHJDjIEKF0C4q4OvtGUWh7pioeXax0',
  authDomain: 'tkb-reminders.firebaseapp.com',
  databaseURL: 'https://tkb-reminders.firebaseio.com',
  projectId: 'tkb-reminders',
  storageBucket: 'tkb-reminders.appspot.com',
  messagingSenderId: '817223359217'
}

var fire = firebase.initializeApp(config)
// firebase.firestore().enablePersistence()
export default fire
