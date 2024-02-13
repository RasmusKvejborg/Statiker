<template>
  <v-container fluid>
    <!--  ------------------popup modal edit project --------------------------->
    <div class="popup" id="popup-2">
      <div class="overlay" @click="toggleEditingPopup()">
        <div class="content" @click.stop>
          <div class="close-btn" @click="toggleEditingPopup()">&times;</div>
          <h3>Rediger projekt</h3>
          <div class="input-group">
            <label for="projectNumber">Projekt ID</label>
            <input
              id="projectNumber"
              type="text"
              v-model="editProject.projectNumber"
            />
          </div>
          <div class="input-group">
            <label for="projectName"> Projekt navn</label>
            <input
              id="projectName"
              type="text"
              v-model="editProject.projectName"
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
                <v-card-title>Slet dette projekt?</v-card-title>
                <v-card-actions>
                  <v-btn color="red" text @click="deleteProject"> Ja </v-btn>
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
      <v-btn color="primary" @click="startAddingProject" v-if="!isAddingProject"
        >+ Opret nyt projekt</v-btn
      >

      <div v-if="isAddingProject">
        <input
          v-model="newProjectNumber"
          placeholder="Sagsnummer"
          class="project-input"
        />
        <input
          v-model="newProjectName"
          placeholder="Projektnavn"
          class="project-input"
        />

        <v-btn class="my-0" color="primary" @click="saveProject">Gem sag</v-btn>
        <v-icon class="close-button" @click="cancelAddingProject"
          >mdi-close</v-icon
        >
      </div>

      <v-row v-if="projects && projects.length > 0" class="project-headlines">
        <v-col cols="3">
          <!-- Headline 1 -->
          <h4>Sagsnummer</h4>
        </v-col>

        <v-col cols="3">
          <!-- Headline 2 -->
          <h4>Projektets navn</h4>
        </v-col>

        <v-col cols="3"> </v-col>

        <v-col cols="2">
          <!-- Headline 4 -->
          <h4>Oprettet</h4>
        </v-col>
      </v-row>

      <div
        v-for="(project, index) in projects"
        :key="index"
        class="project-container pointerOnHover"
        @click="navigateToProject(project)"
      >
        <v-row>
          <v-col cols="3">
            {{ project.projectNumber && project.projectNumber }}
          </v-col>

          <v-col cols="3">
            {{ project.projectName && project.projectName }}
          </v-col>

          <v-col cols="3"> </v-col>

          <v-col cols="2">
            {{ project.date && formatDate(project.date) }}
          </v-col>
          <v-col @click.stop cols="1">
            <button class="mt-0" @click="toggleEditingPopup(project)">
              <v-icon>mdi-pencil</v-icon>
            </button>
          </v-col>
        </v-row>
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
  query,
  where,
  doc,
  updateDoc,
} from "firebase/firestore";
import { formatDate } from "../components/utils.js";

export default {
  props: {
    userId: String,
  },
  data() {
    return {
      projects: null,
      isAddingProject: false, // Flag to show/hide the input field
      newProjectName: "",
      newProjectNumber: "",
      editProject: {},
      deleteConfirmation: false,
    };
  },

  methods: {
    cancelDelete() {
      this.deleteConfirmation = false;
    },

    confirmDelete() {
      this.deleteConfirmation = true;
    },

    async deleteProject() {
      const colRef = collection(db, "projects");
      const docRef = doc(colRef, this.editProject.id);
      console.log("editpro ", this.editProject);
      try {
        await updateDoc(docRef, {
          isDeleted: true,
        });
        this.deleteConfirmation = false;
        this.toggleEditingPopup();
        this.fetchData();
      } catch (error) {
        console.error("Error deleting project:", error);
        alert("Fejl 216: Fejl ved sletning af projekt");
      }
    },

    async saveEditFunction() {
      const number = this.editProject.projectNumber.trim();
      const name = this.editProject.projectName.trim();

      if (!number || !name) {
        // Display a notification or alert to the user
        alert("Venligst udfyld projekt navn og ID.");
        return;
      }

      const colRef = collection(db, "projects");
      const docRef = doc(colRef, this.editProject.id);

      try {
        await updateDoc(docRef, {
          projectNumber: number,
          projectName: name,
          changed: new Date(),
        });
        this.toggleEditingPopup();
        this.fetchData();
      } catch (error) {
        console.error("Error updating project:", error);
        alert("Fejl 215: Fejl ved opdatering af projekt");
      }
    },

    toggleEditingPopup(project) {
      if (project) {
        this.editProject = { ...project };
      }
      document.getElementById("popup-2").classList.toggle("active");
    },

    startAddingProject() {
      // bare til at vise navneinput
      this.isAddingProject = true;
    },

    async saveProject() {
      if (!this.newProjectName.trim() || !this.newProjectNumber.trim()) {
        // Display a notification or alert to the user
        alert("Venligst udfyld projektnavn og sagsnummer.");
        return;
      }

      const colRef = collection(db, "projects");

      const dataObj = {
        accountId: this.userId,
        projectName: this.newProjectName,
        projectNumber: this.newProjectNumber,
        date: new Date(),
      };

      const docRef = await addDoc(colRef, dataObj);

      // this.projects.push(dataObj); // DET KAN JEG IKKE, er nødt til lige at fetche, for ellers får jeg ikke id'et på projektet med som jeg sender over i parameter.
      this.fetchData();
      // Reset the input field and hide it
      this.cancelAddingProject();
    },

    cancelAddingProject() {
      // ku jo os bruges hvis man fortryder og vil trykke kryds...
      this.newProjectName = ""; // Reset the input field
      this.newProjectNumber = ""; // Reset the input field

      this.isAddingProject = false; // Hide the input field
    },

    async fetchData() {
      console.log("user: " + this.userId);
      const collectionRef = collection(db, "projects");

      try {
        const querySnapshot = await getDocs(
          query(collectionRef, where("accountId", "==", this.userId))
        );

        const projectList = [];

        querySnapshot.forEach((docSnapshot) => {
          if (docSnapshot.exists()) {
            const data = docSnapshot.data();

            if (!data.isDeleted || data.isDeleted !== true) {
              const project = {
                id: docSnapshot.id, // Include the document ID
                projectName: data.projectName ? data.projectName : null,
                projectNumber: data.projectNumber ? data.projectNumber : null,
                date: data.date ? data.date.toDate() : null, // Convert to Date object
              };
              projectList.push(project);
            }
          }
        });

        projectList.sort((a, b) => b.date - a.date); // Reverse the order

        this.projects = projectList; // Update the projects data property
      } catch (error) {
        console.error("Error fetching documents:", error);
      }
    },

    formatDate(date) {
      return formatDate(date);
    },

    navigateToProject(project) {
      this.$router.push({
        name: "projectOverview",
        params: {
          parameter: project.id,
          projectName: project.projectName,
          projectNumber: project.projectNumber,
        },
      });
    },
  }, // -----end of methods-----

  watch: {
    userId: {
      immediate: true, // Run on initial mount
      handler(newVal) {
        if (newVal) {
          this.fetchData();
        }
      },
    },
  },
};
</script>

<style scoped>
button {
  margin-top: 10px;
}

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

.close-button {
  cursor: pointer;
  margin-left: 5px;
  font-size: 18px;
  color: #555; /* Adjust the color as needed */
}

.close-button:hover {
  color: #333; /* Change color on hover if desired */
}

/* .project-title p {            // god måde at vise at man kan fjerne noget for p tags kun for det her sted.
  margin: 0; /* Remove default margin from p tags */

.project-title {
  display: flex;
  align-items: center;
  text-decoration: none;
  color: inherit;
}

.block {
  margin: 0 10px; /* Adjust margin as needed */
}

.project-info {
  flex-grow: 1; /* Allow project info to take remaining space */
}

.project-details {
  display: flex;
  justify-content: space-between;
  flex-direction: column;
}
</style>
