<template>
  <v-container fluid>
    <h2>{{ this.projectNumber + " - " + this.projectName }}</h2>

    <!-- <div class="project-container" @click="navigateToControlScheme(project)">
      Nyt kontrolskema
    </div> -->

    <div>
      <div class="margin20topbot">
        <v-btn
          color="primary"
          @click="startAddingControlScheme"
          v-if="!isAddingControl"
          >+ Opret nyt kontrolskema</v-btn
        >

        <div v-if="isAddingControl">
          <input
            v-model="newControlName"
            placeholder="Kontrolskema Navn"
            class="project-input"
          />
          <input
            v-model="newControlNumber"
            placeholder="Kontrolskema ID"
            class="project-input"
          />

          <v-btn class="my-0" color="primary" @click="saveControlScheme"
            >Opret</v-btn
          >
          <v-icon class="close-button" @click="cancelAddingControlScheme"
            >mdi-close</v-icon
          >
        </div>
      </div>

      <!-- skal kun vises hvis der er kontrolskemaer. -->
      <div v-if="Object.keys(controlSchemes).length > 0">
        <v-row class="project-headlines">
          <v-col cols="3">
            <h4>Kontrolskema navn</h4>
          </v-col>
          <v-col cols="3">
            <h4>Kontrolskema ID</h4>
          </v-col>

          <v-col cols="3">
            <h4>Sidst ændret</h4>
          </v-col>

          <v-col cols="2">
            <h4>Oprettet</h4>
          </v-col>
          <v-col cols="1"> </v-col>
        </v-row>

        <!--         v-for="(project, index) in projects"
        :key="index" -->
        <div
          v-for="(controlScheme, index) in controlSchemes"
          :key="index"
          class="project-container"
          @click="navigateToForm(controlScheme.id)"
        >
          <v-row>
            <v-col cols="3">
              {{
                controlScheme.controlSchemeName &&
                controlScheme.controlSchemeName
              }}
            </v-col>

            <v-col cols="3">
              {{
                controlScheme.controlSchemeNumber &&
                controlScheme.controlSchemeNumber
              }}
            </v-col>

            <v-col cols="3"></v-col>
            <v-col cols="2">{{
              controlScheme.date && formatDate(controlScheme.date)
            }}</v-col>

            <v-col cols="1"> Link?</v-col>
          </v-row>
        </div>
      </div>
    </div>
  </v-container>
</template>

<script>
import { db } from "../firebase.js";
import {
  collection,
  addDoc,
  getDocs,
  querym,
  doc,
  getDoc,
} from "firebase/firestore";
import { formatDate } from "../components/utils.js";

export default {
  props: {
    parameter: String,
    projectName: String,
    projectNumber: String,
  },

  data() {
    return {
      isAddingControl: false,
      newControlName: "", //controlSchemeName
      newControlNumber: "",
      controlSchemes: {},
    };
  },

  methods: {
    startAddingControlScheme() {
      // bare til at vise navneinput
      this.isAddingControl = true;
      console.log(Object.keys(this.controlSchemes).length);
    },

    saveControlScheme() {
      // her skal laves noget!!
      this.cancelAddingControlScheme();
    },

    cancelAddingControlScheme() {
      // ku jo os bruges hvis man fortryder og vil trykke kryds...
      this.newControlName = ""; // Reset the input field
      this.newControlNumber = ""; // Reset the input field

      this.isAddingControl = false; // Hide the input field
    },

    //--- save control scheme --

    async saveControlScheme() {
      if (!this.newControlName.trim() || !this.newControlNumber.trim()) {
        // Display a notification or alert to the user
        alert("Venligst udfyld kontrolskema navn og ID.");
        return;
      }

      const colRef = collection(db, "controlSchemes");

      const dataObj = {
        accountId: null,
        projectId: this.parameter,
        controlSchemeName: this.newControlName,
        controlSchemeNumber: this.newControlNumber,
        date: new Date(),
      };

      const docRef = await addDoc(colRef, dataObj);

      // // this.projects.push(dataObj); // DET KAN JEG IKKE, er nødt til lige at fetche, for ellers får jeg ikke id'et på projektet med som jeg sender over i parameter.
      this.fetchControlSchemes();
      // Reset the input field and hide it
      this.cancelAddingControlScheme();
      this.navigateToControlScheme(docRef.id);
    },
    // -- end of save control scheme end ---

    async fetchControlSchemes() {
      const collectionRef = collection(db, "controlSchemes");

      try {
        const querySnapshot = await getDocs(collectionRef);

        const controlSchemesList = [];

        querySnapshot.forEach((docSnapshot) => {
          if (docSnapshot.exists()) {
            const data = docSnapshot.data();

            if (data.projectId === this.parameter) {
              const controlScheme = {
                id: docSnapshot.id, // Include the document ID
                controlSchemeName: data.controlSchemeName
                  ? data.controlSchemeName
                  : null,
                controlSchemeNumber: data.controlSchemeNumber
                  ? data.controlSchemeNumber
                  : null,
                date: data.date ? data.date.toDate() : null, // Convert to Date object
              };
              controlSchemesList.push(controlScheme);
            }
          }
        });

        controlSchemesList.sort((a, b) => b.date - a.date); // Reverse the order

        this.controlSchemes = controlSchemesList; // Update the projects data property
      } catch (error) {
        console.error("Error fetching documents:", error);
      }
    },

    // ----- end of fetchControlSchemes-----
    formatDate(date) {
      return formatDate(date);
    },

    navigateToControlScheme(controlSchemeId) {
      //navigates to the /project where you can edit the control sceme
      this.$router.push({
        name: "project",
        params: {
          parameter: controlSchemeId, // this.projectId,
          projectName: this.projectNumber,
          projectNumber: this.projectName,
        },
      });
    },

    navigateToForm(controlSchemeId) {
      this.linkCreated = `/form/${controlSchemeId}`;
      window.open(this.linkCreated, "_blank");
    },
  },
  created() {
    this.fetchControlSchemes();
  },
};
</script>
