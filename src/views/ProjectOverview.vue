<template>
  <v-container fluid>
    <h2>{{ this.projectNumber + " - " + this.projectName }}</h2>

    <!-- ------------------modal----------------------- -->
    <div class="popup" id="popup-1">
      <div class="overlay" @click="togglePopup()">
        <div class="content" @click.stop>
          <div class="close-btn" @click="togglePopup()">&times;</div>
          <h3>Del linket med dem, der skal udfylde kontrolskemaet</h3>
          <br />
          <p>
            {{ modalLink }}
          </p>
          <v-btn color="primary" @click="copyToClipboard">Kopiér link</v-btn>
          <p>{{ hiddenMessage }}</p>
        </div>
      </div>
    </div>
    <!--  --------------------------------------------->

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
      <div v-if="!controlSchemesLoaded">
        <p>Henter fra databasen...</p>
      </div>
      <div v-else>
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

          <div
            v-for="(controlScheme, index) in controlSchemes"
            :key="index"
            class="project-container"
            @click="
              controlScheme.controlSchemeTexts
                ? navigateToForm(controlScheme.id)
                : navigateToProject(controlScheme.id)
            "
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

              <v-col
                @click.stop
                @click="togglePopup(controlScheme.id)"
                cols="1"
              >
                <button v-if="controlScheme.controlSchemeTexts">
                  Del link
                </button>
              </v-col>
            </v-row>
          </div>
        </div>
        <div v-else>
          <p>
            Der er ikke oprettet nogen kontrolskemaer endnu på dette projekt.
          </p>
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
    parameter: String, // project id
    projectName: String,
    projectNumber: String,
    userId: String,
  },

  data() {
    return {
      isAddingControl: false,
      newControlName: "", //controlSchemeName
      newControlNumber: "",
      controlSchemes: {},
      modalLink: "",
      controlSchemesLoaded: false,
      hiddenMessage: "",
    };
  },

  methods: {
    copyToClipboard() {
      (this.hiddenMessage = ""),
        navigator.clipboard
          .writeText(this.modalLink)
          .then(() => {
            // Success message or further actions on successful copy
            this.hiddenMessage = "Link kopieret!";
          })
          .catch((error) => {
            // Handling error if the copy operation fails
            console.error("Copy failed:", error);
            // You can also provide an alternative method here if the Clipboard API is not available
          });
    },

    togglePopup(id) {
      this.hiddenMessage = "";
      const baseDomain = window.location.origin;
      this.modalLink = `${baseDomain}/form/${id}`;
      console.log("closing or opening");
      document.getElementById("popup-1").classList.toggle("active");
    },

    startAddingControlScheme() {
      // bare til at vise navneinput
      this.isAddingControl = true;
      console.log(Object.keys(this.controlSchemes).length);
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
        accountId: this.userId,
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
      console.log("this happens");

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
                controlSchemeTexts: data.controlSchemeTexts
                  ? data.controlSchemeTexts
                  : null,
                date: data.date ? data.date.toDate() : null, // Convert to Date object
              };
              controlSchemesList.push(controlScheme);
            }
          }
        });

        controlSchemesList.sort((a, b) => b.date - a.date); // Reverse the order

        this.controlSchemes = controlSchemesList; // Update the projects data property
        this.controlSchemesLoaded = true; // sætter loading text til at fjerne sig
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
          parameter: controlSchemeId,
          projectName: this.projectNumber,
          projectNumber: this.projectName,
        },
      });
    },

    navigateToForm(controlSchemeId) {
      // this.linkCreated = `/form/${controlSchemeId}`;
      // window.open(this.linkCreated, "_blank");
      this.$router.push({
        name: "form",
        params: { parameter: controlSchemeId },
      });
    },
    navigateToProject(controlSchemeId) {
      this.$router.push({
        name: "project",
        params: {
          parameter: controlSchemeId,
          projectNumber: this.projectNumber,
          projectName: this.projectName,
        },
      });
    },
  },
  created() {
    this.fetchControlSchemes();
  },
};
</script>
