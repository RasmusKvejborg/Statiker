<template>
  <v-container>
    <p>
      OBS: Vi har skiftet hjemmeside til
      <a href="http://xn--nordingenir-pgb.dk/">nordingeniør.dk</a>. Denne side
      bliver dedikeret til software med værktøjer til alle jer i branchen.
    </p>
    <br />
    <br />

    <div class="login-container">
      <h2>Log ind</h2>
      <input type="text" placeholder="Email" v-model="email" />
      <input type="password" placeholder="Kodeord" v-model="password" />
      <p v-if="errorMessage">{{ errorMessage }}</p>
      <v-btn @click="logIn" color="primary" class="action-button"
        >Log ind</v-btn
      >
      <p>
        Har dit firma endnu ikke adgang?
        <a href="/register">Opret jer gratis</a>
      </p>
    </div>
  </v-container>
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
