<template>
  <h1>Log ind</h1>
  <p><input type="text" placeholder="Email" v-model="email" /></p>
  <p><input type="password" placeholder="Kodeord" v-model="password" /></p>
  <p v-if="errorMessage">{{ errorMessage }}</p>
  <p><v-btn @click="logIn">Log ind</v-btn></p>
</template>

<script>
import { getAuth, signInWithEmailAndPassword } from "firebase/auth";

export default {
  data() {
    return {
      email: "",
      password: "",
      errorMessage: null,
    };
  },

  methods: {
    logIn() {
      // const auth = getAuth();
      signInWithEmailAndPassword(getAuth(), this.email, this.password)
        .then((data) => {
          console.log("succesfully logged in");
          // console.log("auth.currentuser: " + auth.currentuser);
          this.$router.push("/"); // redirecter til home hvis succesfuld
        })
        .catch((error) => {
          console.log(error.message + ". Error code: " + error.code);

          switch (error.code) {
            case "auth/invalid-email":
              this.errorMessage = "Emailen ser ikke korrekt ud";
              break;
            case "auth/user-not-found":
              this.errorMessage = "Emailen findes ikke i systemet";
              break;
            case "auth/wrong-password":
              this.errorMessage = "Forkert kodeord";
              break;
            default:
              this.errorMessage = "Forkert email eller kodeord";
          }
        });
    },
  },
};
</script>
