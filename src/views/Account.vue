<template>
  <v-container>
    <h3>Upload logo</h3>
    <p>Vælg logo som skal fremgå på den endelige PDF fil.</p>
    <br />
    <input type="file" @change="onFileSelected" />
    <v-btn color="primary" @click="onUpload" :disabled="!canUpload"
      >Upload</v-btn
    >
  </v-container>
</template>

<script>
import { storage } from "../firebase.js";
import logo from "../assets/logo.png";
import { getStorage, ref, uploadBytes } from "firebase/storage";

const imageRef = ref(getStorage(), logo);

export default {
  props: {
    userId: String,
  },
  data() {
    return {
      selectedFile: null,
      canUpload: false, // Disable upload if format is incorrect
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

      const storage = getStorage();
      const storageRef = ref(storage, "Images/" + this.userId); // navngiver userid så de er unikke, men hver user har kun én og overskriver sin egen.

      try {
        await uploadBytes(storageRef, this.selectedFile);
        alert("File uploaded successfully!");
      } catch (error) {
        console.error("Error uploading file:", error);
        alert("Failed to upload file: " + error);
      }
    },
  },
};
</script>
