<template>
  <br />
  <div>
    <br />
    <label for="kontrolskema">Kontrolskema: </label>
    <select id="kontrolskema">
      <option value="armerede_fundamenter">Beton: Armerede fundamenter</option>
      <option value="fiberarmerede">Beton: Fiberarmerede</option>
    </select>

    <div v-for="index in 6" :key="index">
      <h3>B{{ index }}</h3>
      <table>
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
            v-for="(value, key) in this.templateTexts['B' + index]['Header 1']"
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
              <button class="delete" @click="removeRow(index, key)">X</button>
            </td>
          </tr>
        </tbody>
      </table>
      <button class="add" @click="addRow(index)">+</button>
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

  <button
    v-if="!isAddingProject"
    @click="startAddingTemplate"
    class="inaction-button"
  >
    Gem skabelon...
  </button>
  <div v-if="isAddingProject">
    <input
      v-model="newProjectName"
      placeholder="Skabelon-navn"
      class="project-input"
    />
    <button @click="saveTemplate" class="action-button">Gem skabelon</button>
  </div>

  <button class="action-button">Få link</button>
  <!-- @click="designSaveResult" -->
  <!-- <div class="notification">Data indsendt!</div> -->
  <!-- v-if="showNotification" -->
  <!-- </div> -->
</template>

<style scoped></style>

<script>
///////////////////////////////////////////////////////////////////// script ////////////////////////////////////////////////////////////////////////////////
// @ is an alias to /src
import { templateTexts } from "@/components/templateTexts.js";
import {
  updateProjectStatus,
  addDocumentIdToProject,
} from "@/components/utils.js";

import { collection, getDoc, doc } from "firebase/firestore";
import { db } from "../firebase.js";

export default {
  props: {
    parameter: String,
  },

  data() {
    return {
      templateTexts: templateTexts["Beton: Armerede fundamenter"],
      selectedValue: null,
      isAddingProject: false, // Flag to show/hide the input field
    };
  },

  created() {
    // this.fetchProjectData();
  },

  methods: {
    startAddingTemplate() {
      // bare til at vise navneinput
      this.isAddingProject = true;
    },

    changeTemplate() {
      this.templateTexts = "hello";
    },

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
    //--------------------

    //--------------------
    //--------------------
    //--------------------
    //--------------------
    //--------------------
    //--------------------
    //--------------------
    //--------------------
    //--------------------
    //--------------------
    //--------------------
    //--------------------

    //--------------------
    //--------------------
    //--------------------
    //--------------------
    //--------------------

    async saveTemplate() {
      const colRef = collection(db, "projects");

      const dataObj = {
        accountId: null,
        projectName: this.newProjectName,
        designStatus: "Ikke lavet",
        projekteringsStatus: "Ikke lavet",
        udforselsStatus: "Ikke lavet",
        date: new Date(),
      };
    },

    // firestore

    async OpenLink(subpage) {
      // skal lige ha et andet navn
      // await this.designSaveForm();

      // await this.fetchProjectData();

      this.linkCreated = `/${subpage}/${this.projectData.designDocId}`;

      window.open(this.linkCreated, "_blank");

      // updateStatusIgang('udførselStatus')
    },

    //----------------------------------------------------------

    async fetchProjectData() {
      const docRef = doc(db, "projects", this.parameter);

      try {
        const docSnapshot = await getDoc(docRef);

        if (docSnapshot.exists()) {
          // If the document exists, set the  data
          this.projectData = docSnapshot.data();
        }
      } catch (error) {
        console.error("Error fetching user data:", error);
      }
    },
  },
};
</script>
