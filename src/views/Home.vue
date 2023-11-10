<template>
  <div>
    <button
      @click="startAddingProject"
      class="action-button"
      v-if="!isAddingProject"
    >
      + Opret nyt projekt
    </button>

    <div v-if="isAddingProject">
      <input
        v-model="newProjectName"
        placeholder="Projektnavn"
        class="project-input"
      />
      <input
        v-model="newProjectNumber"
        placeholder="Sagsnummer"
        class="project-input"
      />
      <button @click="saveProject" class="action-button">Gem sag</button>
    </div>

    <h3>Igangværende sager:</h3>

    <div
      v-for="(project, index) in projects"
      :key="index"
      class="project-container"
    >
      <router-link
        :to="{
          name: 'project',
          params: {
            parameter: project.id,
            projectName: project.projectName,
            projectNumber: project.projectNumber,
          },
        }"
      >
        <span class="block">abc</span>
        <span class="block project-info">
          {{
            project.projectNumber
              ? project.projectNumber + " - " + project.projectName
              : project.projectName
          }}
        </span>
        <span class="block">def</span>
      </router-link>
    </div>
  </div>
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

export default {
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
        accountId: null,
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
      const collectionRef = collection(db, "projects");

      try {
        const querySnapshot = await getDocs(collectionRef);

        const projectList = [];

        querySnapshot.forEach((docSnapshot) => {
          if (docSnapshot.exists()) {
            const data = docSnapshot.data();
            const project = {
              id: docSnapshot.id, // Include the document ID
              projectName: data.projectName ? data.projectName : null,
              projectNumber: data.projectNumber ? data.projectNumber : null,
              date: data.date,
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
  }, // -----end of methods-----

  created() {
    this.fetchData();
  },
};
</script>

<style scoped>
button {
  margin-top: 40px;
}

.project-container {
  display: grid;
  grid-template-columns: 1fr 1fr 1fr;
  background-color: #fff;
  border-radius: 10px;
  margin: 10px 0;
  padding: 10px;
  box-shadow: 0 0 5px rgba(0, 0, 0, 0.2);
}

/* .project-title p {            // god måde at vise at man kan fjerne noget for p tags kun for det her sted.
  margin: 0; /* Remove default margin from p tags */

.project-input {
  flex: 1; /* Take up the available space */
  padding: 10px;
  border: 1px solid var(--headlinebackground);
  border-radius: 5px;
  background-color: #fff;
  color: #333;
  margin-right: 10px; /* Add some spacing between the input and button */
}

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
