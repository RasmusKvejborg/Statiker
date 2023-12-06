<template>
  <h1>Opret konto</h1>
  <p><input type="text" placeholder="Email" v-model="email" /></p>
  <p><input type="password" placeholder="Kodeord" v-model="password" /></p>
  <p><v-btn @click="register">Opret</v-btn></p>
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
