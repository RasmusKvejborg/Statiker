<template>
  <v-container fluid>
    <h2>{{ this.projectNumber + " - " + this.projectName }}</h2>

    <div class="project-container" @click="navigateToProject(project)">
      Nyt kontrolskema
    </div>

    <div>
      <div class="margin20topbot">
        <v-btn
          color="primary"
          @click="startAddingControl"
          v-if="!isAddingControl"
          >+ Opret nyt kontrolskema</v-btn
        >

        <div v-if="isAddingControl">
          <input
            v-model="newProjectName"
            placeholder="Kontrolskema Navn"
            class="project-input"
          />
          <input
            v-model="newProjectNumber"
            placeholder="Kontrolskema ID"
            class="project-input"
          />

          <v-btn class="my-0" color="primary" @click="saveProject"
            >Gem sag</v-btn
          >
          <v-icon class="close-button" @click="cancelAddingProject"
            >mdi-close</v-icon
          >
        </div>
      </div>

      <!-- skal kun vises hvis der er kontrolskemaer. -->
      <div v-if="true">
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

          <v-col cols="3">
            <h4>Oprettet</h4>
          </v-col>
        </v-row>

        <!--         v-for="(project, index) in projects"
        :key="index" -->
        <div class="project-container">
          <v-row>
            <v-col cols="3"> </v-col>

            <v-col cols="3"> </v-col>

            <v-col cols="3"> </v-col>
          </v-row>
        </div>
      </div>
    </div>
  </v-container>
</template>

<script>
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
    };
  },

  methods: {
    startAddingControl() {
      // bare til at vise navneinput
      this.isAddingControl = true;
    },

    saveControl() {
      // her skal laves noget!!
      this.cancelAddingProject();
    },

    cancelAddingProject() {
      // ku jo os bruges hvis man fortryder og vil trykke kryds...
      this.newControlName = ""; // Reset the input field
      this.newControlNumber = ""; // Reset the input field

      this.isAddingControl = false; // Hide the input field
    },

    navigateToProject(project) {
      this.$router.push({
        name: "project",
        params: {
          parameter: this.parameter,
          projectName: this.projectNumber,
          projectNumber: this.projectName,
        },
      });
    },
  },
};
</script>
