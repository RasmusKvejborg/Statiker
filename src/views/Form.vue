<template>
  <v-container fluid>
    <div v-if="this.loading">Loading...</div>
    <!-- <div v-else-if="!this.leftFormData && !this.loading">
      Fejl: Der mangler at blive gemt noget data til dette kontrolskema da det
      blev oprettet. Rediger-funktion kommer senere
    </div> -->
    <div v-else>
      <div id="resultPrinted">
        <h2>{{ controlSchemeNumber + " - " + controlSchemeName }}</h2>
        <div v-for="index in 6" :key="index" class="controlschemes">
          <div class="marginTopAndBot10">
            <h3>B{{ index }}: {{ headerTexts["B" + index] }}</h3>
            <div class="container">
              <table>
                <thead>
                  <tr class="blue-header">
                    <th class="min-width">Nr.:</th>
                    <th class="no-wrap">Kontrol af</th>
                    <th class="no-wrap">Tidspunkt</th>
                    <th class="no-wrap">Acceptkriterium</th>
                    <th class="no-wrap">Kontrolomfang</th>
                    <th class="no-wrap">Kontrolmetode</th>
                    <th class="no-wrap">Dokumentationsmetode</th>
                    <th class="fixed blue-header">Kontrolresultat</th>
                    <th class="fixed2 blue-header">Godkendt dato & init.</th>
                  </tr>
                </thead>
                <tbody>
                  <!-- laver en row for hver række der er i header1 -->
                  <tr
                    class="tr"
                    v-for="(value, key) in this.leftFormData['B' + index][
                      'Header 1'
                    ]"
                    :key="key"
                  >
                    <td>
                      <p class="wrap">
                        {{ leftFormData["B" + index]["Header 1"][key] }}
                      </p>
                    </td>
                    <td>
                      <p class="wrap">
                        {{ leftFormData["B" + index]["Header 2"][key] }}
                      </p>
                    </td>
                    <!--  -->
                    <td>
                      <p class="wrap">
                        {{ leftFormData["B" + index]["Header 3"][key] }}
                      </p>
                    </td>
                    <td>
                      <p class="wrap">
                        {{ leftFormData["B" + index]["Header 4"][key] }}
                      </p>
                    </td>
                    <td>
                      <p class="wrap">
                        {{ leftFormData["B" + index]["Header 5"][key] }}
                      </p>
                    </td>
                    <td>
                      <p class="wrap">
                        {{ leftFormData["B" + index]["Header 6"][key] }}
                      </p>
                    </td>
                    <td>
                      <p class="wrap">
                        {{ leftFormData["B" + index]["Header 7"][key] }}
                      </p>
                    </td>
                    <td class="fixedtd">
                      <textarea
                        class="textarea"
                        v-model="rightFormData['B' + index]['datoInit'][key]"
                      ></textarea>
                    </td>
                    <td class="fixedtd2">
                      <textarea
                        class="textarea2"
                        v-model="rightFormData['B' + index]['kontrolRes'][key]"
                      ></textarea>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
      <!-- --------------------oversigt slut ------------------------->

      <div>
        <v-btn color="primary" @click="saveSubmittedData">Indsend</v-btn>
        <download-button
          class="action-button"
          dom="#resultPrinted"
          :name="controlSchemeNumber + ' - ' + controlSchemeName"
          :userId="userId"
        />
      </div>
    </div>
  </v-container>
</template>

<style scoped>
.container {
  overflow-x: scroll;
  margin-right: 600px;
}

.fixed {
  position: absolute;
  right: 184px;
  width: 430px;
}
.fixed2 {
  position: absolute;
  right: 0px;
}

.fixedtd {
  position: absolute;
  right: 0px;
  width: 184px;
}
.fixedtd2 {
  position: absolute;
  right: 184px;
  width: 430px;
}
.tr {
  height: 100px;
}
.textarea {
  width: 184px;
  height: 95px;
  resize: none;
  outline: none;
  padding-right: 10px;
}

.textarea2 {
  width: 420px;
  height: 95px;
  resize: none;
  outline: none;
  padding-right: 5px;
}
</style>

<script>
///////////////////////////////////////////////////////////////////// script ////////////////////////////////////////////////////////////////////////////////

import {
  collection,
  addDoc,
  getDocs,
  getDoc,
  doc,
  setDoc,
} from "firebase/firestore";
import { db } from "../firebase.js";
import DownloadButton from "../components/DownloadButton";

export default {
  props: {
    userId: String,
    parameter: String,
    projectName: String,
    projectNumber: String,
  },
  components: {
    DownloadButton,
  },

  data() {
    return {
      headerTexts: {
        B1: "Kontrol af gennemgang af udførselsgrundlag fra projektering",
        B2: "Kontrol af udførselsgrundlag for arbejdet",
        B3: "Kontrol af materialer og produkter",
        B4: "Modtagekontrol",
        B5: "Kontrol af udførelse",
        B6: "Slutkontrol",
      },
      controlSchemeName: "",
      controlSchemeNumber: "",

      leftFormData: null,
      rightFormData: {
        //           v-model="rightFormData['B' + index]['kontrolRes'][key]"
        B1: {
          datoInit: {
            1: "",
            2: "",
            3: "",
          },
          kontrolRes: {
            1: "",
            2: "",
            3: "",
          },
        },
        B2: {
          datoInit: {},
          kontrolRes: {},
        },
        B3: {
          datoInit: {},
          kontrolRes: {},
        },
        B4: {
          datoInit: {},
          kontrolRes: {},
        },
        B5: {
          datoInit: {},
          kontrolRes: {},
        },
        B6: {
          datoInit: {},
          kontrolRes: {},
        },
      },
      loading: true,
    };
  },

  created() {
    this.fetchLeftAndRightTexts();
  },
  //------------- -------------- ------------- ---------- METHODS ------------ ---------- ------------- ---------------- ----------
  methods: {
    async saveSubmittedData() {
      const submittedDataRef = doc(db, "controlSchemes", this.parameter); // parameter er i dette tilfælde controlSchemeId

      try {
        const dataObj = {
          submittedControlData: this.rightFormData,
          changed: new Date(),
        };

        const docRef = await setDoc(submittedDataRef, dataObj, { merge: true }); // opdaterer også, hvis findes i forvejen??

        alert("Dataen er gemt");
        return;
      } catch (error) {
        console.error("Error adding/updating field in the project:", error);
      }
    },

    async fetchLeftAndRightTexts() {
      // sørg for at have styr på hvad der skal ske hvis den er undefinded.
      const docRef = doc(db, "controlSchemes", this.parameter);

      try {
        const docSnapshot = await getDoc(docRef);

        if (docSnapshot.exists()) {
          const docData = docSnapshot.data();

          this.leftFormData = docData.controlSchemeTexts;
          this.controlSchemeName = docData.controlSchemeName;
          this.controlSchemeNumber = docData.controlSchemeNumber;
          this.rightFormData =
            docData.submittedControlData || this.rightFormData;
        }
      } catch (error) {
        console.error("Error fetching document... ", error);
      } finally {
        this.loading = false;
      }
    },

    //----------------------------------------------------------
  },
};
</script>
