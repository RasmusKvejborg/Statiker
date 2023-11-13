<template>
  <v-container fluid>
    <div>
      <div v-for="index in 6" :key="index" class="controlschemes">
        <h3>B{{ index }}</h3>
        <v-table>
          <thead>
            <tr class="blue-header">
              <th>Nr.:</th>
              <th>Kontrol af</th>
              <th>Tidspunkt</th>
              <th>Acceptkriterium</th>
              <th>Kontrolomfang</th>
              <th>Kontrolmetode</th>
              <th>Dokumentationsmetode</th>
              <th>Kontrolresultat</th>
              <th>Godkendt Dato & sign.</th>
            </tr>
          </thead>
          <tbody>
            <!-- laver en row for hver række der er i header1 -->
            <tr
              v-for="(value, key) in this.templateTexts['B' + index][
                'Header 1'
              ]"
              :key="key"
            >
              <td>
                <input
                  class="invisible-input"
                  v-model="templateTexts['B' + index]['Header 1'][key]"
                />
              </td>
              <td>
                <input
                  class="invisible-input"
                  v-model="templateTexts['B' + index]['Header 2'][key]"
                />
              </td>
              <!--  -->
              <td>
                <input
                  class="invisible-input"
                  v-model="templateTexts['B' + index]['Header 3'][key]"
                />
              </td>
              <td>
                <input
                  class="invisible-input"
                  v-model="templateTexts['B' + index]['Header 4'][key]"
                />
              </td>
              <td>
                <input
                  class="invisible-input"
                  v-model="templateTexts['B' + index]['Header 5'][key]"
                />
              </td>
              <td>
                <input
                  class="invisible-input"
                  v-model="templateTexts['B' + index]['Header 6'][key]"
                />
              </td>
              <td>
                <input
                  class="invisible-input"
                  v-model="templateTexts['B' + index]['Header 7'][key]"
                />
              </td>
              <td>
                <textarea class="invisible-input width100"></textarea>
              </td>
              <td>
                <textarea class="invisible-input width100"></textarea>
              </td>
            </tr>
          </tbody>
        </v-table>
      </div>
      <!-- --------------------oversigt slut ------------------------->

      <!-- <div v-for="key in this.formData.checkBoxValues" :key="key"> -->
      <!-- ----------------------------------------------------------------------------------------------------------------------------- -->
      <!-- for hver checkbox der er sat flueben i -->
      <table class="kontrolplan-tables">
        <tbody>
          <!-- KONTROLPLAN First table content (second table er blandet ind, ) -->
        </tbody>
      </table>
    </div>

    <div class="margin20">
      <v-btn color="primary" @click="saveSubmittedData()">Indsend</v-btn>
    </div>
    <!-- @click="designSaveResult" -->
    <!-- <div class="notification">Data indsendt!</div> -->
    <!-- v-if="showNotification" -->
    <!-- </div> -->
  </v-container>
</template>

<style scoped>
.width100 {
  width: 100%;
}
.template-input {
  padding: 8px;
  border: 1px solid #ccc;
  border-radius: 4px;
  font-size: 16px;
  background-color: white;
}
.controlschemes h3 {
  margin-bottom: 2px;
}
.controlschemes + .controlschemes {
  margin-top: 50px;
}

.add-row-container {
  margin-top: -20px; /* Adjust as needed */
  margin-left: 3px;
}
.custom-icon-btn {
  min-width: 0; /* Ensures the button doesn't expand */
  border-radius: 0; /* Makes the button square */
}
.custom-col {
  margin-right: 0px; /* Adjust the margin as needed */
}

.margin20 {
  margin-top: 20px; /* Adjust the margin as needed */
}
.margin-20 {
  margin-top: -10px; /* Adjust the margin as needed */
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
          alert("Du mangler at give skabelonen et navn");
          return;
        } else {
          this.saveTemplate();
          console.log("template saved: " + this.newTemplateName);
        }
      }
      // ovenstående skal ikke gøre noget, det er kun for at gemme templates...
      // her skal jeg gemme en masse data måske i en ny collection, måske i project, måske HVAD jeg er træt

      const newId = this.parameter;
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
