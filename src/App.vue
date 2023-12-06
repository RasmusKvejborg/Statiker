<template>
  <nav>
    <v-toolbar flat app>
      <v-toolbar-title
        @click="navigateToHome"
        class="text-uppercase grey--text"
        style="flex: none"
      >
        <span>Nord</span>
        <span class="font-weight-bold pointerOnHover">Statik</span>
      </v-toolbar-title>

      <v-spacer></v-spacer>
      <v-btn flat color="grey" @click="navigateToHome">Hjem</v-btn>

      <v-btn flat color="grey">Om NordStatik</v-btn>

      <v-btn flat color="grey">Kontakt</v-btn>

      <v-btn v-if="isLoggedIn" @click="logout" flat color="grey">Log ud</v-btn>
      <v-btn v-else @click="navigateToLogin" flat color="grey">Log ind</v-btn>
    </v-toolbar>
  </nav>
  <router-view />
</template>

<style src="./style.css" />

<script>
import { getAuth, onAuthStateChanged, signOut } from "firebase/auth";

let auth;

export default {
  data() {
    return {
      isLoggedIn: false,
    };
  },

  created() {
    this.checkForLoggedIn();
  },

  methods: {
    logout() {
      signOut(auth).then(() => {
        this.$router.push("/"); // bør nok ikke gå til homepage medmindre jeg har et tjek på at den redirecter dertil hvis man ikke er logget ind.
      });
    },

    checkForLoggedIn() {
      auth = getAuth();
      onAuthStateChanged(auth, (user) => {
        if (user) {
          console.log("logged in..");
          this.isLoggedIn = true;
        } else {
          console.log("NOT logged in...");
          this.isLoggedIn = false;
        }
      });
    },

    navigateToHome() {
      this.$router.push("/");
    },

    navigateToLogin() {
      this.$router.push("/login");
    },
  },
};
</script>
