<template>
  <v-container fluid>
    <h2>{{ this.projectNumber + " - " + this.projectName }}</h2>

    <div>
      <v-select
        v-model="selectedOption"
        :items="Object.keys(alltemplates)"
        @update:modelValue="setCurrentText()"
      >
        <template v-slot:label>
          <span style="font-size: 14px">Vælg skabelon:</span>
        </template>
      </v-select>

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
              v-for="(value, key) in this.currentTexts['B' + index]['Header 1']"
              :key="key"
            >
              <td>
                <input
                  class="invisible-input min-width"
                  v-model="currentTexts['B' + index]['Header 1'][key]"
                />
              </td>
              <td>
                <input
                  class="invisible-input"
                  v-model="currentTexts['B' + index]['Header 2'][key]"
                />
              </td>
              <!--  -->
              <td>
                <input
                  id="autocompleteInput"
                  class="invisible-input"
                  v-model="currentTexts['B' + index]['Header 3'][key]"
                />
              </td>
              <td>
                <input
                  class="invisible-input"
                  v-model="currentTexts['B' + index]['Header 4'][key]"
                />
              </td>
              <td>
                <input
                  class="invisible-input"
                  v-model="currentTexts['B' + index]['Header 5'][key]"
                />
              </td>
              <td>
                <input
                  class="invisible-input"
                  v-model="currentTexts['B' + index]['Header 6'][key]"
                />
              </td>
              <td>
                <input
                  class="invisible-input"
                  v-model="currentTexts['B' + index]['Header 7'][key]"
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
    </div>

    <div class="margin20">
      <v-row>
        <v-col>
          <v-btn color="primary" @click="createLink()">Få link</v-btn>
        </v-col>
        <v-col v-if="isAddingProject">
          <input
            v-model="newTemplateName"
            placeholder="Skabelon-navn"
            class="template-input"
          />
        </v-col>
        <v-col>
          <v-checkbox
            class="margin-20"
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

.add-row-container {
  margin-top: -20px; /* Adjust as needed */
  margin-left: 3px;
}
.custom-icon-btn {
  min-width: 0; /* Ensures the button doesn't expand */
  border-radius: 0; /* Makes the button square */
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
import { templateTexts as templateTextsFromFile } from "@/components/templateTexts.js";
import { updateProjectStatus } from "@/components/utils.js";

import {
  collection,
  addDoc,
  getDocs,
  getDoc,
  doc,
  setDoc,
} from "firebase/firestore";
import { db } from "../firebase.js";

export default {
  props: {
    parameter: String, //parameter er i dette tilfælde controlSchemeId
    projectName: String,
    projectNumber: String,
  },

  data() {
    return {
      selectedOption: "Beton: Armerede fundamenter",
      alltemplates: templateTextsFromFile,
      currentTexts: null, // opdateres i updateTemplatetexts som køres ved created
      selectedValue: null,
      isAddingProject: false, // Flag to show/hide the input field
      newTemplateName: null,
    };
  },

  created() {
    this.fetchTemplates();
    this.setCurrentText();
  },
  //------------- -------------- ------------- ---------- METHODS ------------ ---------- ------------- ---------------- ----------
  methods: {
    setCurrentText() {
      // her ku jeg måske sige indsæt fetched templatetexts hvis der er nogle, ellers vil den gå derind:
      this.currentTexts = templateTextsFromFile[this.selectedOption];
    },

    async createLink() {
      if (this.isAddingProject) {
        if (!this.newTemplateName) {
          alert("Du mangler at give skabelonen et navn");
          return;
        } else {
          this.saveTemplate();
          console.log("template saved: " + this.newTemplateName);
        }
      }

      // this.addObjectToControlScheme();
      // create an alert here and dont go to the routing before you've pressed OK to the alert
      alert("hdfjasf");
      // const newId = this.parameter;
      // this.$router.push(`/form/${newId}`);
    },

    //------ update controlschemes -----
    async addObjectToControlScheme() {
      console.log("den har nu et object");
      const controlSchemeRef = doc(db, "controlSchemes", this.parameter); //parameter er i dette tilfælde controlSchemeId

      try {
        const dataObj = {
          controlSchemeTexts: this.currentTexts,
        };

        const docRef = await setDoc(controlSchemeRef, dataObj, { merge: true });

        return;
      } catch (error) {
        console.error("Error adding/updating field in the project:", error);
      }
    },

    startAddingTemplate() {
      // bare til at vise navneinput
      this.isAddingProject = true;
    },

    // -------------------- add row ---------------
    addRow(index) {
      let numberOfHeaders = Object.keys(this.currentTexts["B" + index]).length;

      let keys = Object.keys(this.currentTexts["B" + index]["Header 6"]);
      let lastKey = parseInt(keys[keys.length - 1]) || 0;

      // for each header, set an empty property called 4 (if lastKey is 3) and set the value to "" so it will be {4:""}
      for (
        let headernumber = 1;
        headernumber <= numberOfHeaders;
        headernumber++
      ) {
        this.currentTexts["B" + index]["Header " + headernumber][lastKey + 1] =
          headernumber == 1 ? lastKey + 1 : ""; // adds 4 to the first column
      }
    },

    // -------------removeRow-----------------
    removeRow(index, rowNumber) {
      let numberOfHeaders = Object.keys(this.currentTexts["B" + index]).length;

      for (
        let headernumber = 1;
        headernumber <= numberOfHeaders;
        headernumber++
      ) {
        delete this.currentTexts["B" + index]["Header " + headernumber][
          rowNumber
        ];
      }
    },

    async saveTemplate() {
      const colRef = collection(db, "templates");

      const dataObj = {
        accountId: null,
        templateName: this.newTemplateName,
        templateObject: this.currentTexts,
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
