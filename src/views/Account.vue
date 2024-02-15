<template>
  <v-container>
    <div>
      <h3>Upload logo</h3>
      <p>Vælg logo som skal fremgå på den endelige PDF fil.</p>
      <br />
      <input type="file" @change="onFileSelected" />
      <v-btn color="primary" @click="onUpload" :disabled="!canUpload"
        >Upload</v-btn
      >
      <p v-if="successMessage" style="color: green">{{ successMessage }}</p>
    </div>
    <div class="mt-16">
      <h3>Kontrolskema-skabeloner</h3>
      <!-- og slette senere... HUSK at man ikke bare skal slette where == name, men måske lige ha et id på den, så man ikke sletter en nabos, fordi de har kaldt den det samme -->
      <p>Her kan du de skabeloner, du selv har oprettet.</p>
      <v-select
        v-model="selectedOption"
        :items="Object.keys(allTemplates)"
        class="maxwidth300"
      >
        <template v-slot:label>
          <span style="font-size: 14px">Vælg skabelon:</span>
        </template>
      </v-select>
      <p>{{ this.selectedOption }}</p>
    </div>
  </v-container>
</template>

<script>
import { getStorage, ref, uploadBytes } from "firebase/storage";
import { db } from "../firebase.js";
import { collection, getDocs, where, query } from "firebase/firestore";

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
      allTemplates: {},
      selectedOption: "",
    };
  },

  computed: {
    templateKeys() {
      return Object.keys(this.allTemplates);
    },
  },

  created() {
    this.fetchTemplates();
  },

  methods: {
    async fetchTemplates() {
      const collectionRef = collection(db, "templates");
      try {
        const querySnapshot = await getDocs(
          query(collectionRef, where("accountId", "==", this.userId))
        );
        querySnapshot.forEach((docSnapshot) => {
          if (docSnapshot.exists()) {
            const data = docSnapshot.data();
            this.allTemplates[data.templateName] = data.templateObject;
          }
        });
        console.log(this.allTemplates);
      } catch (error) {
        console.error("Error fetching documents:", error);
      }
    },

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
