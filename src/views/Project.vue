<template>
  <v-container fluid>
    <h2>
      {{ this.projectNumber + " - " + this.projectName }}
    </h2>

    <!-- ----------------------------------------- -->
    <div class="popup" id="popup-1">
      <div class="overlay" @click="togglePopup()">
        <div class="content" @click.stop>
          <div class="close-btn" @click="togglePopup()">&times;</div>
          <h3>Del linket med dem, der skal udfylde kontrolskemaet</h3>
          <br />
          <p>
            {{ modalLink }}
          </p>
          <v-btn color="primary" @click="copyToClipboard">Kopiér link</v-btn>
          <!-- her kommer copy paste halløj. -->
          <p>{{ hiddenMessage }}</p>
        </div>
      </div>
    </div>
    <!--  --------------------------------------------->

    <div>
      <v-select
        v-model="selectedOption"
        :items="Object.keys(allTemplates)"
        @update:modelValue="setCurrentText()"
        class="maxwidth300"
      >
        <template v-slot:label>
          <span style="font-size: 14px">Vælg skabelon:</span>
        </template>
      </v-select>

      <!-----------  opret link / gem skabelon   ------------->

      <div class="">
        <v-row>
          <v-col cols="2">
            <v-btn color="primary" @click="createLink()">
              {{ hasBeenCreatedBefore ? "Gem" : "Opret link" }}
            </v-btn>
          </v-col>
          <v-col cols="3" v-if="isAddingTemplate">
            <input
              v-model="newTemplateName"
              placeholder="Skabelon-navn"
              class="template-input"
            />
          </v-col>
          <v-col>
            <v-checkbox
              class="margin-20"
              v-model="isAddingTemplate"
              label="Gem som skabelon"
            ></v-checkbox>
          </v-col>
          <v-spacer></v-spacer>
        </v-row>
      </div>
      <!-- slut opret link / gem skabelon slut  -->

      <div v-for="index in 6" :key="index" class="controlschemes">
        <h3>B{{ index }}: {{ headerTexts["B" + index] }}</h3>
        <v-table>
          <thead>
            <tr class="blue-header">
              <th><strong>Nr.:</strong></th>
              <th><strong>Kontrol af</strong></th>
              <th><strong>Tidspunkt</strong></th>
              <th><strong>Acceptkriterium</strong></th>
              <th><strong>Kontrolomfang</strong></th>
              <th><strong>Kontrolmetode</strong></th>
              <th><strong>Dokumentationsmetode</strong></th>
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
                  class="invisible-input min-width no-margin"
                  v-model="currentTexts['B' + index]['Header 1'][key]"
                />
              </td>
              <td>
                <textarea
                  class="invisible-input width100 needs-padding"
                  v-model="currentTexts['B' + index]['Header 2'][key]"
                ></textarea>
              </td>
              <!-- tidspunkt: -->
              <td>
                <input
                  class="invisible-input width100 needs-padding"
                  :list="
                    index === 1
                      ? 'tidspunkt-b1'
                      : index === 6
                      ? 'tidspunkt-b6'
                      : ''
                  "
                  v-model="currentTexts['B' + index]['Header 3'][key]"
                />

                <datalist id="tidspunkt-b1">
                  <option value="Inden opstart"></option>
                </datalist>
                <datalist id="tidspunkt-b6">
                  <option value="Ved afslutning af kontrolafsnittet."></option>
                </datalist>
              </td>
              <td>
                <textarea
                  class="invisible-input width100 needs-padding"
                  v-model="currentTexts['B' + index]['Header 4'][key]"
                ></textarea>
              </td>
              <td>
                <textarea
                  class="invisible-input width100 needs-padding"
                  v-model="currentTexts['B' + index]['Header 5'][key]"
                ></textarea>
              </td>
              <td>
                <textarea
                  class="invisible-input width100 needs-padding"
                  v-model="currentTexts['B' + index]['Header 6'][key]"
                ></textarea>
              </td>
              <td>
                <textarea
                  class="invisible-input width100 needs-padding"
                  v-model="currentTexts['B' + index]['Header 7'][key]"
                ></textarea>
              </td>
              <td>
                <v-btn
                  @click="removeRow(index, key)"
                  icon
                  size="extra small"
                  class="custom-icon-btn margin8"
                  color="red"
                >
                  <v-icon>mdi-close</v-icon>
                </v-btn>
              </td>
            </tr>
          </tbody>
        </v-table>

        <div class="add-row-container needs-padding">
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

    <!-----------  opret link / gem skabelon   ------------->

    <div class="">
      <v-row>
        <v-col cols="2">
          <v-btn color="primary" @click="createLink()">
            {{ hasBeenCreatedBefore ? "Gem" : "Opret link" }}
          </v-btn>
        </v-col>
        <v-col cols="3" v-if="isAddingTemplate">
          <input
            v-model="newTemplateName"
            placeholder="Skabelon-navn"
            class="template-input"
          />
        </v-col>
        <v-col>
          <v-checkbox
            class="margin-20"
            v-model="isAddingTemplate"
            label="Gem som skabelon"
          ></v-checkbox>
        </v-col>
        <v-spacer></v-spacer>
      </v-row>
    </div>
    <!-- slut opret link / gem skabelon slut  -->
  </v-container>
</template>

<style scoped>
h3 {
  margin-bottom: 0; /* Set margin-bottom to 0 to remove the default margin */
}
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

.v-table__wrapper table td {
  padding: 0 !important;
}

.needs-padding {
  padding: 8px !important; /* Adjust as needed */
}

.margin8 {
  margin: 8px;
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
  where,
  query,
  updateDoc,
} from "firebase/firestore";
import { db } from "../firebase.js";
import { Text } from "vue";
import { getDate } from "date-fns";

export default {
  props: {
    parameter: String, //parameter er i dette tilfælde controlSchemeId
    projectName: String,
    projectNumber: String,
    userId: String,
  },
  data() {
    return {
      selectedOption: "Tom skabelon",
      allTemplates: templateTextsFromFile,
      currentTexts: null, // opdateres i updateTemplatetexts som køres ved created
      selectedValue: null,
      isAddingTemplate: false, // Flag to show/hide the input field
      newTemplateName: null,
      modalLink: "",
      hiddenMessage: "",
      headerTexts: {
        B1: "Kontrol af gennemgang af udførselsgrundlag fra projektering",
        B2: "Kontrol af udførselsgrundlag for arbejdet",
        B3: "Kontrol af materialer og produkter",
        B4: "Modtagekontrol",
        B5: "Kontrol af udførelse",
        B6: "Slutkontrol",
      },
      hasBeenCreatedBefore: false,
    };
  },
  created() {
    // this.fetchTemplates(); bliver kaldt i watch, når der er et userId
    this.setCurrentText();
    this.initializeTexts();
  },
  //------------- -------------- ------------- ---------- METHODS ------------ ---------- ------------- ---------------- ----------
  methods: {
    async initializeTexts() {
      try {
        const textHasBeenFetched = await this.fetchTexts();
        if (!textHasBeenFetched) {
          this.setCurrentTextByName("Fundamenter EXC2");
        }
      } catch (error) {
        console.error("Error initializing texts:", error);
      }
    },

    async fetchTexts() {
      const docRef = doc(db, "controlSchemes", this.parameter);
      try {
        const docSnapshot = await getDoc(docRef);

        if (docSnapshot.exists()) {
          const docData = docSnapshot.data();

          if (docData.controlSchemeTexts) {
            this.selectedOption = "Ny skabelon";
            this.hasBeenCreatedBefore = true;
            this.currentTexts = docData.controlSchemeTexts;
            return true; // Texts exist
          }

          // this.controlSchemeName = docData.controlSchemeName;
          // this.controlSchemeNumber = docData.controlSchemeNumber;
          // this.rightFormData = // kan bruge dette til at finde ud af om der er udfyldt noget i form
          //   docData.submittedControlData || this.rightFormData;
        }
        return false; // Texts do not exist
      } catch (error) {
        console.error("Error fetching document... ", error);
      }
    },
    //----------
    copyToClipboard() {
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
    setCurrentText() {
      this.currentTexts = templateTextsFromFile[this.selectedOption];
    },
    setCurrentTextByName(nameOfTemplate) {
      this.selectedOption = nameOfTemplate;
      this.setCurrentText();
    },
    togglePopup(id) {
      this.hiddenMessage = "";
      const baseDomain = window.location.origin;
      this.modalLink = `${baseDomain}/form/${id}`;
      document.getElementById("popup-1").classList.toggle("active");
    },

    async createLink() {
      if (this.hasBeenCreatedBefore) {
        window.confirm(
          "Husk at give besked om ændringerne, hvis du har delt kontrolskemaet."
        );
      }

      if (this.isAddingTemplate) {
        if (!this.newTemplateName) {
          alert("Du mangler at give skabelonen et navn");
          return;
        } else {
          this.saveTemplate();
          console.log("template saved: " + this.newTemplateName);
        }
      }
      this.overWriteObjectToControlScheme(); // turn back to addObjectToControl...?
      this.togglePopup(this.parameter);
    },
    //------ update controlschemes -----
    // async addObjectToControlScheme() {
    //   const controlSchemeRef = doc(db, "controlSchemes", this.parameter); //parameter er i dette tilfælde controlSchemeId
    //   try {
    //     const dataObj = {
    //       controlSchemeTexts: this.currentTexts,
    //       changed: new Date(),
    //     };
    //     const docRef = await setDoc(controlSchemeRef, dataObj, { merge: true });
    //     return;
    //   } catch (error) {
    //     console.error("Error adding/updating field in the project:", error);
    //   }
    // },
    async overWriteObjectToControlScheme() {
      const controlSchemeRef = doc(db, "controlSchemes", this.parameter); // Assuming parameter is the controlSchemeId
      try {
        await updateDoc(controlSchemeRef, {
          controlSchemeTexts: this.currentTexts,
          changed: new Date(), // Optionally update a timestamp to track when the data was last changed
        });
        console.log("Control scheme texts updated successfully.");
      } catch (error) {
        console.error("Error updating control scheme texts:", error);
      }
    },

    startAddingTemplate() {
      // bare til at vise navneinput
      this.isAddingTemplate = true;
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
      let numberOfHeaders = Object.keys(this.currentTexts["B" + index]).length; //number of columns
      for (
        let headernumber = 1;
        headernumber <= numberOfHeaders;
        headernumber++
      ) {
        delete this.currentTexts["B" + index]["Header " + headernumber][
          rowNumber
        ];
      }
      console.log(this.currentTexts["B" + index]);
    },

    async saveTemplate() {
      const colRef = collection(db, "templates");
      const dataObj = {
        accountId: this.userId,
        templateName: this.newTemplateName,
        templateObject: this.currentTexts,
      };
      const docRef = await addDoc(colRef, dataObj);
    },
    //----------------------------------------------------------
    async fetchTemplates() {
      const collectionRef = collection(db, "templates");
      try {
        const querySnapshot = await getDocs(
          query(collectionRef, where("accountId", "==", this.userId))
        );
        querySnapshot.forEach((docSnapshot) => {
          if (docSnapshot.exists()) {
            const data = docSnapshot.data();
            this.allTemplates[data.templateName] = data.templateObject;
          }
        });
      } catch (error) {
        console.error("Error fetching documents:", error);
      }
    },
  },
  watch: {
    userId: {
      immediate: true, // Run on initial mount
      handler(newVal) {
        if (newVal) {
          this.fetchTemplates();
        }
      },
    },
  },
  components: { Text },
};
</script>
