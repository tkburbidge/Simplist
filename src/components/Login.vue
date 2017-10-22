<template>
  <div>
    <md-toolbar>
      <h2 class="md-title">Simplist</h2>
    </md-toolbar>
    <br>
    <md-layout md-row>
      <md-layout md-column style="margin: auto; max-width: 500px; padding: 10px;" md-gutter="true">
        <md-whiteframe style="padding: 10px;">
          <!-- <md-tabs md-fixed class="md-transparent"> -->
            <!-- <md-tab md-label="Sign In" md-active> -->
              <form novalidate @submit.stop.prevent="signIn">
                <p class="md-warn">{{signInError}}</p>
                <md-input-container>
                  <label>Email</label>
                  <md-input v-model="email" type="email"></md-input>
                </md-input-container>
                <md-input-container>
                  <label>Password</label>
                  <md-input v-model="password" type="password"></md-input>
                </md-input-container>
                <md-layout md-row md-align="end">
                  <md-button class="md-raised md-primary" type="submit">Sign In</md-button>
                </md-layout>
              </form>
            <!-- </md-tab> -->
            <!-- <md-tab md-label="Sign Up">
              <form novalidate @submit.stop.prevent="signUp">
                <p class="md-warn">{{signUpError}}</p>
                <md-input-container>
                  <label>Email</label>
                  <md-input v-model="email" type="email"></md-input>
                </md-input-container>
                <md-input-container>
                  <label>Password</label>
                  <md-input v-model="password" type="password"></md-input>
                </md-input-container>
                <md-input-container :class="{ 'md-input-invalid': passwordConfirmError }">
                  <label>Confirm Password</label>
                  <md-input v-model="passwordConfirm" type="password" @blur="checkPasswordConfirm"></md-input>
                  <span class="md-error">{{passwordConfirmError}}</span>
                </md-input-container>
                <md-layout md-row md-align="end">
                  <md-button class="md-raised md-primary" type="submit">Sign Up</md-button>
                </md-layout>
              </form>
            </md-tab>
          </md-tabs> -->
        </md-whiteframe>
      </md-layout>
    </md-layout>
  </div>
</template>

<script>
import firebase from 'firebase'
import router from '@/router/index'

export default {
  data: () => {
    return {
      email: '',
      password: '',
      passwordConfirm: '',
      passwordConfirmError: '',
      signUpError: '',
      signInError: ''
    }
  },
  created () {
    firebase.auth().onAuthStateChanged((user) => {
      if (user) {
        router.push('/Lists')
        // alert('user signed in')
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
  },
  methods: {
    signIn () {
      firebase.auth().signInWithEmailAndPassword(this.email, this.password).catch((error) => {
        this.signInError = error.message
      })
    },
    checkPasswordConfirm () {
      if (this.password !== this.passwordConfirm) {
        this.passwordConfirmError = 'Passwords do not match'
        return false
      } else {
        this.passwordConfirmError = ''
        return true
      }
    },
    signUp () {
      if (this.checkPasswordConfirm()) {
        firebase.auth().createUserWithEmailAndPassword(this.email, this.password).catch((error) => {
          this.signUpError = error.message
        })
      }
    }
  }
}

</script>

<style>

</style>