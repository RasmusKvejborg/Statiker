<template>
  <v-container fluid>
    <div v-if="this.loading">Loading...</div>

    <div v-else>
      <download-button
        color="#FF0000"
        dom="#resultPrinted"
        :name="controlSchemeNumber + ' - ' + controlSchemeName"
        :userId="userId"
      />
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
                    <th class="no-wrap">Kontrolresultat</th>
                    <th class="no-wrap">Dato & navn</th>
                  </tr>
                </thead>
                <tbody>
                  <!-- laver en row for hver række der er i header1 da der er samme antal rækker i alle -->
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
                    <td>
                      <p class="wrap">
                        {{ rightFormData["B" + index]["kontrolRes"][key] }}
                      </p>
                    </td>
                    <td>
                      <p class="wrap">
                        {{ rightFormData["B" + index]["datoInit"][key] }}
                      </p>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>
        <div class="image-container">
          <img
            v-for="(imageUrl, index) in imageUrls"
            :key="index"
            :src="imageUrl"
            alt="Image"
            style="max-height: 250px; margin-right: 10px; display: inline-block"
          />
        </div>
      </div>

      <div></div>
    </div>
  </v-container>
</template>

<style scoped></style>
<script>
///////////////////////////////////////////////////////////////////// script ////////////////////////////////////////////////////////////////////////////////

import { getDoc, doc } from "firebase/firestore";
import { getStorage, ref, listAll, getDownloadURL } from "firebase/storage";
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
          datoInit: {},
          kontrolRes: {},
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
      showSuccess: false,
      selectedFile: null,
      imageUrls: [],
    };
  },

  mounted() {
    this.fetchLeftAndRightTexts(); // Ensure data is fetched first
    this.fetchImages();
  },

  //------------- -------------- ------------- ---------- METHODS ------------ ---------- ------------- ---------------- ----------
  methods: {
    async fetchImages() {
      try {
        const storage = getStorage();
        const userImageRef = ref(storage, `FormImages/${this.parameter}/`);

        listAll(userImageRef).then(async (res) => {
          const { items } = res;
          const urls = await Promise.all(
            items.map((item) => getDownloadURL(item))
          );

          this.imageUrls = urls;
        });
      } catch (error) {
        throw new Error("Failed to fetch image URL: " + error);
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
  },
};
</script>
