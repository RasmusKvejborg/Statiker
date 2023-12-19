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

      <v-btn flat color="grey" @click="navigateToAccount">Konto</v-btn>

      <v-btn v-if="isLoggedIn" @click="logout" flat color="grey">Log ud</v-btn>
      <v-btn v-else @click="navigateToLogin" flat color="grey">Log ind</v-btn>
    </v-toolbar>
  </nav>
  <!-- DET ER DENNE DER SENDER USERID VIDERE -->
  <router-view :userId="userId" />
</template>

<style src="./style.css" />

<script>
import { getAuth, onAuthStateChanged, signOut } from "firebase/auth";
import Home from "./views/Home.vue";

let auth;

export default {
  components: { Home },

  data() {
    return {
      isLoggedIn: false,
      userId: null,
    };
  },

  created() {
    this.checkForLoggedIn();
  },

  methods: {
    logout() {
      signOut(auth).then(() => {
        this.$router.push("/login");
      });
    },

    checkForLoggedIn() {
      auth = getAuth();
      onAuthStateChanged(auth, (user) => {
        if (user) {
          console.log("logged in.."); // how do I print the user Id?
          this.isLoggedIn = true;
          this.userId = user.uid;
        } else {
          console.log("NOT logged in...");
          this.isLoggedIn = false;
        }
      });
    },

    navigateToHome() {
      this.$router.push({ name: "home" });
    },

    navigateToAccount() {
      this.$router.push({ name: "account" });
    },

    navigateToLogin() {
      this.$router.push("/login");
    },
  },
};
</script>
