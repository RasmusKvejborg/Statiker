<template>
  <v-container fluid>
    <h2>{{ this.projectNumber + " - " + this.projectName }}</h2>

    <div>
      <label for="kontrolskema">Kontrolskema: </label>
      <select
        id="kontrolskema"
        v-model="selectedOption"
        @change="updateTemplateTexts"
      >
        <option
          v-for="templateKey in Object.keys(alltemplates)"
          :value="templateKey"
        >
          {{ templateKey }}
        </option>
      </select>

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
              <th></th>
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
                <v-btn
                  @click="removeRow(index, key)"
                  icon
                  size="extra small"
                  class="custom-icon-btn"
                  color="red"
                >
                  <v-icon>mdi-close</v-icon>
                </v-btn>
              </td>
            </tr>
          </tbody>
        </v-table>

        <div class="add-row-container">
          <v-btn
            @click="addRow(index)"
            icon
            size="extra small"
            class="custom-icon-btn"
            color="green"
          >
            <v-icon>mdi-plus</v-icon>
          </v-btn>
        </div>
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

    <div>
      <v-row>
        <v-col class="custom-col">
          <button class="action-button" @click="createLink()">Få link</button>
        </v-col>
        <v-col v-if="isAddingProject" class="custom-col">
          <input
            v-model="newTemplateName"
            placeholder="Skabelon-navn"
            class="template-input"
          />
        </v-col>
        <v-col class="custom-col">
          <v-checkbox
            v-model="isAddingProject"
            label="Gem ny skabelon til fremtidig brug"
          ></v-checkbox>
        </v-col>
        <v-spacer></v-spacer>
      </v-row>
    </div>
    <!-- @click="designSaveResult" -->
    <!-- <div class="notification">Data indsendt!</div> -->
    <!-- v-if="showNotification" -->
    <!-- </div> -->
  </v-container>
</template>

<style scoped>
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
