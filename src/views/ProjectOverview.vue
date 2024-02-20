<template>
  <keep-alive>
    <v-container fluid>
      <h2>{{ this.projectNumber + " - " + this.projectName }}</h2>

      <!-- ------------------popup modal copy sharable link----------------------- -->
      <div class="popup" id="popup-1">
        <div class="overlay" @click="toggleLinkPopup()">
          <div class="content" @click.stop>
            <div class="close-btn" @click="toggleLinkPopup()">&times;</div>
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
      <!--  ------------------popup modal edit control scheme--------------------------->
      <div class="popup" id="popup-2">
        <div class="overlay" @click="toggleEditingPopup()">
          <div class="content" @click.stop>
            <div class="close-btn" @click="toggleEditingPopup()">&times;</div>
            <h3>Rediger kontrolskema</h3>
            <div class="input-group">
              <label for="controlNumber">Kontrolskema ID</label>
              <input
                id="controlNumber"
                type="text"
                v-model="editControlScheme.controlSchemeNumber"
              />
            </div>
            <div class="input-group">
              <label for="controlName"> Kontrolskema navn</label>
              <input
                id="controlName"
                type="text"
                v-model="editControlScheme.controlSchemeName"
              />
            </div>
            <div class="button-group">
              <v-btn class="save-btn" color="primary" @click="saveEditFunction">
                Gem
              </v-btn>
              <v-btn class="delete-btn" color="red" @click="confirmDelete">
                Slet
              </v-btn>
              <v-dialog v-model="deleteConfirmation" max-width="290">
                <v-card>
                  <v-card-title>Slet dette kontrolskema?</v-card-title>
                  <v-card-actions>
                    <v-btn color="red" text @click="deleteControlScheme">
                      Ja
                    </v-btn>
                    <v-btn @click="cancelDelete">Nej</v-btn>
                  </v-card-actions>
                </v-card>
              </v-dialog>
              <v-btn
                class="cancel-btn"
                color="grey"
                @click="toggleEditingPopup()"
              >
                Annuller
              </v-btn>
            </div>
          </div>
        </div>
      </div>
      <!--  ---------------------------------------------------------------->

      <div>
        <div class="margin20topbot">
          <v-btn
            color="primary"
            @click="startAddingControlScheme"
            v-if="!isAddingControl"
            >+ Opret nyt kontrolskema</v-btn
          >

          <div v-if="isAddingControl">
            <form @submit.prevent>
              <input
                v-model="newControlNumber"
                placeholder="Kontrolskema ID"
                class="project-input width150px"
              />
              <input
                v-model="newControlName"
                placeholder="Kontrolskema Navn"
                class="project-input"
              />
              <v-btn
                type="submit"
                class="my-0"
                color="primary"
                @click="saveControlScheme"
                >Opret</v-btn
              >
              <v-icon class="close-button" @click="cancelAddingControlScheme"
                >mdi-close</v-icon
              >
            </form>
          </div>
        </div>

        <!-- skal kun vises hvis der er kontrolskemaer. -->
        <div v-if="!controlSchemesLoaded">
          <p>Henter fra databasen...</p>
        </div>
        <div v-else>
          <div v-if="hasControlSchemes">
            <v-row class="project-headlines">
              <v-col cols="4"> </v-col>
              <v-col cols="2">
                <h4>Kontrolskema ID</h4>
              </v-col>
              <v-col cols="2">
                <h4>Kontrolskema navn</h4>
              </v-col>

              <v-col cols="2">
                <h4>Sidst ændret</h4>
              </v-col>

              <v-col cols="1">
                <h4>Oprettet</h4>
              </v-col>
              <v-col cols="1"> </v-col>
            </v-row>

            <div
              v-for="(controlScheme, index) in controlSchemes"
              :key="index"
              class="project-container"
            >
              <v-row>
                <v-col cols="4">
                  <v-btn
                    @click="navigateToForm(controlScheme.id)"
                    color="primary"
                    :disabled="!controlScheme.controlSchemeTexts"
                  >
                    Vis
                  </v-btn>
                  <v-btn
                    @click="navigateToProject(controlScheme.id)"
                    color="secondary"
                  >
                    {{ controlScheme.controlSchemeTexts ? "Rediger" : "Opret" }}
                  </v-btn>

                  <v-btn
                    v-if="controlScheme.controlSchemeTexts"
                    @click="navigateToPdf(controlScheme.id)"
                    color="#FF8C9D"
                    style="color: white"
                  >
                    PDF
                  </v-btn>
                </v-col>

                <v-col cols="2">
                  {{
                    controlScheme.controlSchemeNumber &&
                    controlScheme.controlSchemeNumber
                  }}
                </v-col>

                <v-col cols="2">
                  {{
                    controlScheme.controlSchemeName &&
                    controlScheme.controlSchemeName
                  }}
                </v-col>

                <v-col cols="2">
                  {{
                    controlScheme.changed &&
                    formatDateWithHours(controlScheme.changed)
                  }}
                </v-col>
                <v-col cols="1">{{
                  controlScheme.date && formatDate(controlScheme.date)
                }}</v-col>

                <v-col cols="1">
                  <button @click="toggleEditingPopup(controlScheme)">
                    <v-icon>mdi-pencil</v-icon>
                  </button>

                  <button
                    @click="toggleLinkPopup(controlScheme.id)"
                    v-if="controlScheme.controlSchemeTexts"
                  >
                    <v-icon>mdi-link</v-icon>
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
  </keep-alive>
</template>

<script>
import { db } from "../firebase.js";
import {
  collection,
  addDoc,
  getDocs,
  where,
  query,
  doc,
  updateDoc,
} from "firebase/firestore";
import { formatDate, formatDateWithHours } from "../components/utils.js";

export default {
  props: {
    parameter: String, // project id
    projectName: String,
    projectNumber: String,
    userId: String,
  },

  computed: {
    // Add a computed property to check if controlSchemes are available
    hasControlSchemes() {
      return Object.keys(this.controlSchemes).length > 0;
    },
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
      isEditing: false,
      editControlScheme: {},
      deleteConfirmation: false,
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

    toggleLinkPopup(id) {
      this.hiddenMessage = "";
      const baseDomain = window.location.origin;
      this.modalLink = `${baseDomain}/form/${id}`;
      document.getElementById("popup-1").classList.toggle("active");
    },

    toggleEditingPopup(controlScheme) {
      if (controlScheme) {
        this.editControlScheme = { ...controlScheme };
      }
      document.getElementById("popup-2").classList.toggle("active");
    },

    cancelDelete() {
      this.deleteConfirmation = false; // Close the delete confirmation dialog
    },

    confirmDelete() {
      this.deleteConfirmation = true;
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
      // this.navigateToControlScheme(docRef.id);
    },
    // -- end of save control scheme end ---

    async saveEditFunction() {
      const number = this.editControlScheme.controlSchemeNumber.trim();
      const name = this.editControlScheme.controlSchemeName.trim();

      if (!number || !name) {
        // Display a notification or alert to the user
        alert("Venligst udfyld kontrolskema navn og ID.");
        return;
      }

      const colRef = collection(db, "controlSchemes");
      const docRef = doc(colRef, this.editControlScheme.id);

      try {
        await updateDoc(docRef, {
          controlSchemeNumber: number,
          controlSchemeName: name,
          changed: new Date(),
        });
        this.toggleEditingPopup();
        this.fetchControlSchemes();
      } catch (error) {
        console.error("Error updating control scheme:", error);
        alert("Fejl 215: Fejl ved opdatering af kontrolskema");
      }
    },

    async deleteControlScheme() {
      const colRef = collection(db, "controlSchemes");
      const docRef = doc(colRef, this.editControlScheme.id);
      try {
        await updateDoc(docRef, {
          isDeleted: true,
        });
        this.deleteConfirmation = false;
        this.toggleEditingPopup();
        this.fetchControlSchemes();
      } catch (error) {
        console.error("Error deleting control scheme:", error);
        alert("Fejl 216: Fejl ved sletning af kontrolskema");
      }
    },

    // ----- end of fetchControlSchemes-----
    async fetchControlSchemes() {
      console.log("fetch kører");
      try {
        console.log("111");

        const collectionRef = collection(db, "controlSchemes");
        console.log("222");

        const querySnapshot = await getDocs(
          query(collectionRef, where("projectId", "==", this.parameter))
        );

        console.log("length: ", querySnapshot.size);
        const controlSchemesList = [];

        querySnapshot.forEach((docSnapshot) => {
          const data = docSnapshot.data();

          if (data) {
            if (!data.isDeleted || data.isDeleted !== true) {
              const controlScheme = {
                id: docSnapshot.id,
                controlSchemeName: data.controlSchemeName || null,
                controlSchemeNumber: data.controlSchemeNumber || null,
                controlSchemeTexts: data.controlSchemeTexts || null,
                date: data.date ? data.date.toDate() : null,
                changed: data.changed ? data.changed.toDate() : null,
              };
              controlSchemesList.push(controlScheme);
            }
          }
        });

        controlSchemesList.sort((a, b) => b.date - a.date); // Reverse the order

        this.controlSchemes = controlSchemesList; // Update the projects data property
        this.controlSchemesLoaded = true; // sætter loading text til at fjerne sig
        console.log("fetch er kørt");
      } catch (error) {
        console.log("Error fetching documents:", error);
      }
    },
    formatDate(date) {
      return formatDate(date);
    },

    formatDateWithHours(date) {
      return formatDateWithHours(date);
    },

    navigateToControlScheme(controlSchemeId) {
      //navigates to the /project where you can edit the control scheme
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
    navigateToPdf(controlSchemeId) {
      this.$router.push({
        name: "pdf",
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

  mounted() {
    this.fetchControlSchemes();
  },
};
</script>
<style scoped>
input {
  background-color: #fff !important; /* Set a light background color */
  color: #333 !important;
  padding: 8px; /* Adjust padding as needed */
  margin-bottom: 10px;
  border: 1px solid #ccc; /* Add a border for better contrast */
  border-radius: 5px;
  font-size: 14px; /* Adjust font size */
}

.close-btn {
  background-color: #fff !important; /* Set background color to white */
  color: #000; /* Set text color to black */
}

h3 {
  margin-bottom: 30px;
}
</style>
