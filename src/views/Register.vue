<template>
  <div class="login-container">
    <h3 class="marginbot20">Opret konto</h3>

    <form @submit.prevent>
      <input type="text" placeholder="Email" v-model="email" />
      <input type="password" placeholder="Kodeord" v-model="password" />
      <p v-if="errorMessage" class="error-message">{{ errorMessage }}</p>
      <v-btn type="submit" @click="register" color="primary">Opret</v-btn>
    </form>
  </div>
</template>

<style scoped>
/* Your existing styles */
/* ... */
/* Additional styling for input fields */
input[type="text"],
input[type="password"] {
  background-color: #fff; /* Set a light background color */
  color: #333;
  padding: 8px; /* Adjust padding as needed */
  margin-bottom: 10px;
  border: 1px solid #ccc; /* Add a border for better contrast */
  border-radius: 5px;
  box-shadow: none; /* Remove any box shadow */
  font-size: 14px; /* Adjust font size */
}

input[type="password"] + button {
  margin-block: 10px; /* Add extra margin to the button after the input */
}
</style>
<script>
import { getAuth, createUserWithEmailAndPassword } from "firebase/auth";

export default {
  data() {
    return {
      email: "",
      password: "",
      errorMessage: "",
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

          switch (error.code) {
            case "auth/invalid-email":
              this.errorMessage = "Emailen ser ikke korrekt ud";
              break;
            case "auth/weak-password":
              this.errorMessage = "Kodeordet skal være mindst 6 tegn";
              break;
            case "auth/missing-password":
              this.errorMessage = "Indtast kodeord";
              break;

            case "auth/email-already-in-use":
              this.errorMessage =
                "Email er allerede i brug. Klik på 'Log ind' oppe i menuen";
              break;

            default:
              // this.errorMessage = "Forkert email eller kodeord";
              alert("Fejl128: " + error.message);
          }
        });
    },
  },
};
</script>
