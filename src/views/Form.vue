<template>
  <br />

  <h2>{{ this.projectNumber + " - " + this.projectName }}</h2>

  <!-- @click="designSaveResult" -->
  <!-- <div class="notification">Data indsendt!</div> -->
  <!-- v-if="showNotification" -->
  <!-- </div> -->
</template>

<style scoped>
.controlschemes h3 {
  margin-bottom: 2px;
}
</style>

<script>
///////////////////////////////////////////////////////////////////// script ////////////////////////////////////////////////////////////////////////////////
// @ is an alias to /src
import { templateTexts } from "@/components/templateTexts.js";
import { updateProjectStatus } from "@/components/utils.js";

import { collection, addDoc, getDocs, getDoc, doc } from "firebase/firestore";
import { db } from "../firebase.js";

export default {
  props: {
    parameter: String,
    projectName: String,
    projectNumber: String,
  },

  data() {
    return {
      selectedOption: "Beton: Armerede fundamenter",
      alltemplates: templateTexts,
      templateTexts: null, // opdateres i updateTemplatetexts som køres ved created
      selectedValue: null,
      isAddingProject: false, // Flag to show/hide the input field
      newTemplateName: null,
    };
  },

  created() {
    // this.fetchProjectName();
    this.fetchTemplates();
    this.updateTemplateTexts();
  },
  //------------- -------------- ------------- ---------- METHODS ------------ ---------- ------------- ---------------- ----------
  methods: {
    updateTemplateTexts() {
      this.templateTexts = templateTexts[this.selectedOption];
    },

    createLink() {
      //--
      if (this.isAddingProject) {
        if (!this.newTemplateName) {
          console.log("der mangler en Alert her...");
          return;
        } else {
          this.saveTemplate();
          console.log("template saved: " + this.newTemplateName);
        }
      }

      const newId = "yourGeneratedId";
      this.$router.push(`/form/${newId}`);
      // her skal være logik for at gå til næste side...
    },

    startAddingTemplate() {
      // bare til at vise navneinput
      this.isAddingProject = true;
    },

    // -------------------- add row ---------------
    addRow(index) {
      let numberOfHeaders = Object.keys(this.templateTexts["B" + index]).length;

      let keys = Object.keys(this.templateTexts["B" + index]["Header 6"]);
      let lastKey = parseInt(keys[keys.length - 1]) || 0;

      // for each header, set an empty property called 4 (if lastKey is 3) and set the value to "" so it will be {4:""}
      for (
        let headernumber = 1;
        headernumber <= numberOfHeaders;
        headernumber++
      ) {
        this.templateTexts["B" + index]["Header " + headernumber][lastKey + 1] =
          "";
      }

      console.log(this.templateTexts["B" + index]);
    },

    // -------------removeRow-----------------
    removeRow(index, rowNumber) {
      let numberOfHeaders = Object.keys(this.templateTexts["B" + index]).length;

      for (
        let headernumber = 1;
        headernumber <= numberOfHeaders;
        headernumber++
      ) {
        delete this.templateTexts["B" + index]["Header " + headernumber][
          rowNumber
        ];
      }
    },

    async saveTemplate() {
      const colRef = collection(db, "templates");

      const dataObj = {
        accountId: null,
        templateName: this.newTemplateName,
        templateObject: this.templateTexts,
      };
      const docRef = await addDoc(colRef, dataObj);
      console.log("project was created with ID: ", docRef.id); // DET HER SKAL JEG BRUGE
    },

    // async OpenLink(subpage) {
    //   this.linkCreated = `/${subpage}/${this.projectData.designDocId}`;

    //   window.open(this.linkCreated, "_blank");
    // },

    //----------------------------------------------------------

    async fetchTemplates() {
      const collectionRef = collection(db, "templates");

      try {
        const querySnapshot = await getDocs(collectionRef);

        querySnapshot.forEach((docSnapshot) => {
          if (docSnapshot.exists()) {
            const data = docSnapshot.data();
            this.alltemplates[data.templateName] = data.templateObject;
          }
        });

        // templatesList.sort((a, b) => b.date - a.date); // Reverse the order
      } catch (error) {
        console.error("Error fetching documents:", error);
      }
    },
  },
};
</script>
