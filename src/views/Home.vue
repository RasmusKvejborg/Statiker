<template>
  <v-container fluid>
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

        <v-col cols="3">
          <!-- Headline 4 -->
          <h4>Oprettet</h4>
        </v-col>
      </v-row>

      <div
        v-for="(project, index) in projects"
        :key="index"
        class="project-container"
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

          <v-col cols="3">
            {{ project.date && formatDate(project.date) }}
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
  querym,
  doc,
  getDoc,
  query,
  where,
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
      // project findes, men bliver ikk initiliseret før fetch
    };
  },

  methods: {
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
            const project = {
              id: docSnapshot.id, // Include the document ID
              projectName: data.projectName ? data.projectName : null,
              projectNumber: data.projectNumber ? data.projectNumber : null,
              date: data.date ? data.date.toDate() : null, // Convert to Date object
            };
            projectList.push(project);
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
