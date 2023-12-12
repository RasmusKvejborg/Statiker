<template>
  <div class="login-container">
    <h1>Opret konto</h1>
    <input type="text" placeholder="Email" v-model="email" />
    <input type="password" placeholder="Kodeord" v-model="password" />
    <v-btn @click="register" color="primary" class="action-button">Opret</v-btn>
  </div>
</template>

<script>
import { getAuth, createUserWithEmailAndPassword } from "firebase/auth";

export default {
  data() {
    return {
      email: "",
      password: "",
    };
  },

  methods: {
    register() {
      // const auth = getAuth();
      createUserWithEmailAndPassword(getAuth(), this.email, this.password)
        .then((data) => {
          console.log("succesfully registered");
          // console.log("auth.currentuser: " + auth.currentuser);
          this.$router.push("/"); // redirexter til home hvis succesfuld
        })
        .catch((error) => {
          console.log(error.message + "error code: " + error.code);
          alert("Fejl: " + error.message);
        });
    },
  },
};
</script>
