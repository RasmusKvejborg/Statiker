<template>
  <v-container fluid>
    <div v-if="this.loading">Loading...</div>
    <div v-else-if="!this.leftFormData && !this.loading">
      Fejl: Der mangler at blive gemt noget data til dette kontrolskema da det
      blev oprettet. Rediger-funktion kommer senere
    </div>
    <div v-else>
      <div v-for="index in 6" :key="index" class="controlschemes">
        <h3>B{{ index }}</h3>
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
                  <p class="no-wrap">
                    {{ leftFormData["B" + index]["Header 1"][key] }}
                  </p>
                </td>
                <td>
                  <p class="no-wrap">
                    {{ leftFormData["B" + index]["Header 2"][key] }}
                  </p>
                </td>
                <!--  -->
                <td>
                  <p class="no-wrap">
                    {{ leftFormData["B" + index]["Header 3"][key] }}
                  </p>
                </td>
                <td>
                  <p class="no-wrap">
                    {{ leftFormData["B" + index]["Header 4"][key] }}
                  </p>
                </td>
                <td>
                  <p class="no-wrap">
                    {{ leftFormData["B" + index]["Header 5"][key] }}
                  </p>
                </td>
                <td>
                  <p class="no-wrap">
                    {{ leftFormData["B" + index]["Header 6"][key] }}
                  </p>
                </td>
                <td>
                  <p class="no-wrap">
                    {{ leftFormData["B" + index]["Header 7"][key] }}
                  </p>
                </td>
                <td class="fixedtd">
                  <textarea class="textarea"></textarea>
                </td>
                <td class="fixedtd2">
                  <textarea class="textarea2"></textarea>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
      <!-- --------------------oversigt slut ------------------------->

      <div class="margin20">
        <v-btn color="primary" @click="saveSubmittedData()">Indsend</v-btn>
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
  right: 10px;
}

.fixedtd {
  position: absolute;
  right: 10px;
  width: 184px;
}
.fixedtd2 {
  position: absolute;
  right: 194px;
  width: 420px;
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
// @ is an alias to /src
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
      leftFormData: null,
      rightFormData: {}, // blir gemt...
      loading: true,
      formData: {
        // Assuming 'Header 8' and 'Header 9' need nested objects
        B1: "jek",
        B2: "med",
        B3: "dig",
        B4: "",
        B5: "",
        B6: "",
      },
    };
  },

  created() {
    this.fetchLeftAndRightTexts();
  },
  //------------- -------------- ------------- ---------- METHODS ------------ ---------- ------------- ---------------- ----------
  methods: {
    async fetchLeftAndRightTexts() {
      // sørg for at have styr på hvad der skal ske hvis den er undefinded.
      const docRef = doc(db, "controlSchemes", this.parameter);

      try {
        const docSnapshot = await getDoc(docRef);

        if (docSnapshot.exists()) {
          const docData = docSnapshot.data();

          this.leftFormData = docData.controlSchemeTexts;
          //KU OS VÆRE RELEVANT MED CONTROLSCHEMENAME OG NUMBER... OG så vise det i en h3
          this.rightFormData = docData.rightFormTexts
            ? docData.rightFormTexts
            : {};
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
