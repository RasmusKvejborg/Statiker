<template>
  <v-container>
    <h3>Upload logo</h3>
    <p>Vælg logo som skal fremgå på den endelige PDF fil.</p>
    <br />
    <input type="file" @change="onFileSelected" />
    <v-btn color="primary" @click="onUpload" :disabled="!canUpload"
      >Upload</v-btn
    >
    <p v-if="successMessage" style="color: green">{{ successMessage }}</p>
  </v-container>
</template>

<script>
import { storage } from "../firebase.js";
// import logo from "../assets/logo.png";
import { getStorage, ref, uploadBytes } from "firebase/storage";

// const imageRef = ref(getStorage(), logo);

export default {
  props: {
    userId: String,
  },
  data() {
    return {
      selectedFile: null,
      canUpload: false, // Disable upload if format is incorrect
      successMessage: "",
    };
  },
  methods: {
    onFileSelected(event) {
      this.selectedFile = event.target.files[0];
      console.log(event.target.files[0]);

      this.canUpload = true;

      if (
        event.target.files[0].type != "image/png" &&
        event.target.files[0].type != "image/jpeg"
      ) {
        alert("logoet skal være i .png eller .jpg format");
        this.canUpload = false;
      }

      // //tjek på image højde:

      // const img = new Image();
      // img.src = URL.createObjectURL(this.selectedFile);

      // img.onload = () => {
      //   if (img.height > 600) {
      //     alert("Billedhøjden må ikke overstige 600 pixels.");
      //     this.canUpload = false;
      //   }
      // };

      // // --------------

      if (event.target.files[0].size > 1000000) {
        alert("filen er for stor. Maks er 1 mb");
        this.canUpload = false;
      }
    },

    async onUpload() {
      if (!this.selectedFile) {
        alert("Please select a file to upload");
        return;
      }

      //--

      // const img = new Image();
      // img.src = URL.createObjectURL(this.selectedFile);

      // img.onload = () => {
      //   // Image has loaded, you can access its properties now
      //   console.log("Image height:", img.height, "pixels");

      // };
      //--

      const storage = getStorage();
      const storageRef = ref(storage, "Images/" + this.userId); // navngiver userid så de er unikke, men hver user har kun én og overskriver sin egen.

      try {
        await uploadBytes(storageRef, this.selectedFile);
        // alert("Billedet er uploadet og vil fremgå på PDF dokumenter");
        this.successMessage =
          "Billedet er uploadet og vil fremgå på PDF dokumenter";
      } catch (error) {
        console.error("Error uploading file:", error);
        alert("Fejl med upload af logo: " + error);
      }
    },
  },
};
</script>
