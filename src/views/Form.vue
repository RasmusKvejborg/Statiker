<template>
  <v-container fluid>
    <div v-if="this.loading">Loading...</div>
    <!-- <div v-else-if="!this.leftFormData && !this.loading">
      Fejl: Der mangler at blive gemt noget data til dette kontrolskema da det
      blev oprettet. Rediger-funktion kommer senere
    </div> -->
    <div v-else>
      <v-row>
        <v-col cols="7">
          <h2>{{ controlSchemeNumber + " - " + controlSchemeName }}</h2>
        </v-col>
        <!-- <v-col cols="5">
          <div v-if="imageDetails?.length > 0">
            <h5>Vedhæftede billeder:</h5>
            <div style="column-count: 3">
              <a
                v-for="(image, index) in imageDetails"
                :key="index"
                href="#"
                @click.prevent="openModal(image.url)"
                style="
                  display: block; /* Display each link as a block element */
                  margin-bottom: 5px; /* Add margin at the bottom for spacing */
                  white-space: nowrap; /* Prevent line breaks within the anchor element */
                  overflow: hidden; /* Hide overflowing text */
                  text-overflow: ellipsis;
                "
              >
                {{ image.filename.substring(0, 15) }}
              </a>
            </div>
          </div>
        </v-col> -->
      </v-row>
      <div id="resultPrinted">
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
                    <div class="abosoluteContainter">
                      <th class="fixed blue-header">Kontrolresultat</th>
                      <th class="fixed2 blue-header">Dato & navn</th>
                    </div>
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
                    <div class="abosoluteContainter">
                      <!-- -------------------------------------------- -->

                      <td class="fixedtd2">
                        <div
                          style="
                            display: flex;
                            flex-direction: column;
                            height: 100%;
                          "
                        >
                          <div style="flex-grow: 1">
                            <textarea
                              class="textarea2"
                              v-model="
                                rightFormData['B' + index]['kontrolRes'][key]
                              "
                            ></textarea>
                          </div>

                          <div style="display: flex; overflow-x: auto">
                            <div v-for="image in imageDetails" style="">
                              <div style="">
                                <a
                                  v-if="isImageForIndex(image, index, key)"
                                  href="#"
                                  @click.prevent="openModal(image.url)"
                                  style="
                                    font-size: smaller; /* Reduce font size */
                                    margin-right: 10px; /* Remove margin */
                                    padding: 0; /* Remove padding */
                                    white-space: nowrap; /* Prevent wrapping */
                                    text-overflow: ellipsis;
                                  "
                                >
                                  {{ image.filename.substring(0, 20) }}
                                </a>
                              </div>
                            </div>
                          </div>
                        </div>

                        <v-icon
                          @click="handlePhotoClick(index, key)"
                          style="
                            position: absolute;
                            bottom: 5px;
                            right: 5px;
                            cursor: pointer;
                          "
                        >
                          mdi-camera
                        </v-icon>
                        <input
                          type="file"
                          id="getFile"
                          @change="onFileSelected"
                          style="display: none"
                        />
                      </td>

                      <!-- -.....---------------------------------------- -->
                      <td class="fixedtd">
                        <textarea
                          class="textarea"
                          v-model="rightFormData['B' + index]['datoInit'][key]"
                        ></textarea>
                      </td>
                    </div>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
      <!-- --------------------oversigt slut ------------------------->

      <div>
        <!-- indsend knap -->
        <v-btn
          :color="showSuccess ? undefined : 'primary'"
          :class="{ 'success-button': showSuccess }"
          @click="saveSubmittedData"
          style="width: 105px"
        >
          <span v-if="showSuccess">GEMT</span>
          <span v-else>Gem</span></v-btn
        >

        <!-- download pdf -->
        <v-btn @click="saveAndNavigateToPdf(this.parameter)"
          >Videre til PDF</v-btn
        >
      </div>
    </div>
    <!-- Modal component -->
    <v-dialog v-model="modalOpen" max-width="700">
      <template v-slot:activator="{ on }"></template>
      <v-btn icon color="grey" class="close-btn" @click="modalOpen = false">
        <v-icon>mdi-close</v-icon>
      </v-btn>
      <img :src="modalImageUrl" style="max-width: 100%" />
      <v-btn
        icon
        color="error"
        class="delete-btn"
        @click="deleteImage(modalImageUrl)"
      >
        <v-icon>mdi-delete</v-icon>
      </v-btn>
    </v-dialog>
  </v-container>
</template>

<style scoped>
.close-btn {
  position: absolute;
  top: 5px;
  right: 5px;
}

.delete-btn {
  position: absolute;
  bottom: 5px;
  right: 5px;
  border-radius: 5px;
}
.container {
  overflow-x: scroll;
  margin-right: 600px;
}

.abosoluteContainter {
  position: absolute;
  /* sets a margin-right */
  right: 10px;
}

.fixed {
  position: absolute;
  right: 170px;
  width: 420px;
}
.fixed2 {
  position: absolute;
  right: 0px;
  width: 170px;
}

.fixedtd {
  position: absolute;
  right: 0px;
  width: 170px;
}
.fixedtd2 {
  position: absolute;
  right: 170px;
  width: 420px;
}
.tr {
  height: 100px;
}
.textarea {
  width: 100%;
  height: 100%;
  outline: none;
}

.textarea2 {
  width: 100%;
  height: 100%;
  outline: none; /* fjern denne hvis jeg gerne vil se størrelsen af textarea */
}

.success-button {
  background-color: green;
  /* Other styling for the green button */
}
</style>

<script>
///////////////////////////////////////////////////////////////////// script ////////////////////////////////////////////////////////////////////////////////

import { getDoc, doc, setDoc } from "firebase/firestore";
import {
  getStorage,
  ref,
  uploadBytes,
  listAll,
  getDownloadURL,
  deleteObject,
} from "firebase/storage";
import { db } from "../firebase.js";
import DownloadButton from "../components/DownloadButton";
import imageCompression from "browser-image-compression";

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
      imageDetails: [],
      modalOpen: false,
      modalImageUrl: "",
      photoLeadingName: "",
    };
  },

  mounted() {
    this.fetchLeftAndRightTexts(); // Ensure data is fetched first
    this.fetchImages();
  },

  // det her er for at kalde setRowHeights efter DOM'en findes.
  watch: {
    leftFormData: {
      immediate: true, // Trigger on component creation
      handler(newVal) {
        if (newVal && !this.isDataFetched) {
          this.isDataFetched = true;
          this.$nextTick(() => {
            this.setRowHeights(); // Call the function once the data is fetched
          });
        }
      },
    },
  },

  //------------- -------------- ------------- ---------- METHODS ------------ ---------- ------------- ---------------- ----------
  methods: {
    isImageForIndex(image, index, key) {
      console.log(image);

      if (image && image.filename) {
        // Extract the index and key from the filename
        const parts = image.filename.split(".");
        const imageIndex = parseInt(parts[0].substr(1)); // Extract the index after "B"
        const imageKey = parseInt(parts[1]); // Extract the key after the dot

        // Check if the extracted index and key match the provided index and key
        console.log(
          "imageIndex:",
          imageIndex,
          imageIndex === index && imageKey === key,
          imageKey,
          "index: ",
          index,
          "key: ",
          key
        );

        return imageIndex == index && imageKey == key;
      }

      // Return false if image is undefined or does not have the filename property
      return false;
    },

    handlePhotoClick(index, key) {
      console.log("Index:", index);
      console.log("Key:", key);
      this.photoLeadingName = `B${index}.${key}: `;
      document.getElementById("getFile").click();
      console.log("Photo leading name:", this.photoLeadingName);
    },

    async saveAndNavigateToPdf(controlSchemeId) {
      await this.saveSubmittedData();
      this.$router.push({
        name: "pdf",
        params: { parameter: controlSchemeId },
      });
    },

    async deleteImage(imageUrl) {
      try {
        const storage = getStorage();
        const imageRef = ref(storage, imageUrl);
        await deleteObject(imageRef);

        // Remove the deleted image URL from the imageUrls array
        const index = this.imageDetails.findIndex(
          (image) => image.url === imageUrl
        );
        if (index !== -1) {
          this.imageDetails.splice(index, 1);
        }

        this.modalOpen = false;
      } catch (error) {
        console.error("Error deleting image:", error);
        alert("Error deleting image: " + error.message);
      }
    },

    openModal(imageUrl) {
      this.modalImageUrl = imageUrl;
      this.modalOpen = true;
    },

    async onFileSelected(event) {
      this.selectedFile = event.target.files[0];
      console.log("Selected file:", this.selectedFile);

      if (
        this.selectedFile.type != "image/png" &&
        this.selectedFile.type != "image/jpeg"
      ) {
        alert("billede skal være i .PNG eller .JPG format");
        return;
      }

      if (!this.selectedFile) {
        alert("Please select a file to upload");
        return;
      }

      if (this.selectedFile.size > 4) {
        // 00000
        console.log("Compressing file...");
        // this.selectedFile = await this.compressImage();

        try {
          const options = {
            maxSizeMB: 0.5, // Adjust this value based on your requirements
            maxWidthOrHeight: 2048,
            useWebWorker: true,
            maxIteration: 10,
          };

          // Compress the image
          this.selectedFile = await imageCompression(
            this.selectedFile,
            options
          );
        } catch (error) {
          console.error("Error compressing file:", error);
          // Handle the error, for example, show an alert
          alert("Error compressing file: " + error.message);
        }
      }

      const filename = `${this.photoLeadingName}${this.selectedFile.name
        .split("/")
        .pop()}`;

      const storage = getStorage();
      const storageRef = ref(
        storage,
        `FormImages/${this.parameter}/${filename}`
      );

      try {
        await uploadBytes(storageRef, this.selectedFile);

        const url = await getDownloadURL(storageRef);

        // Push the imageUrl to the imageUrls array, så jeg ikke skal fetche hver gang der oploades.
        this.imageDetails.push({ url, filename });
      } catch (error) {
        console.error("Error uploading file:", error);
        alert("Fejl med upload af logo: " + error);
      }
    },

    async fetchImages() {
      try {
        const storage = getStorage();
        const userImageRef = ref(storage, `FormImages/${this.parameter}/`);

        listAll(userImageRef).then(async (res) => {
          const { items } = res;
          const urls = await Promise.all(
            items.map(async (item) => {
              const url = await getDownloadURL(item);

              const filename = item.name
                .split("/")
                .pop()
                .replace(/\.[^/.]+$/, ""); // Removes file extension like .jpg, .png

              return { url, filename };
            })
          );
          this.imageDetails = urls;
        });
      } catch (error) {
        throw new Error("Failed to fetch image URL: " + error);
      }
    },

    async saveSubmittedData() {
      const submittedDataRef = doc(db, "controlSchemes", this.parameter); // parameter er i dette tilfælde controlSchemeId

      try {
        const dataObj = {
          submittedControlData: this.rightFormData,
          changed: new Date(),
        };

        const docRef = await setDoc(submittedDataRef, dataObj, { merge: true }); // opdaterer også, hvis findes i forvejen??

        this.showSuccess = true;
        setTimeout(() => {
          this.showSuccess = false;
        }, 2000);

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

    setRowHeights() {
      const rows = document.querySelectorAll("tbody tr");

      const adjustHeights = () => {
        rows.forEach((row) => {
          const rowHeight = row.clientHeight; // Get the height of the row
          const td1 = row.querySelector(".fixedtd");
          const td2 = row.querySelector(".fixedtd2");

          if (td1 && td2) {
            td1.style.height = `${rowHeight}px`; // Apply row height to textarea1
            td2.style.height = `${rowHeight}px`; // Apply row height to textarea2
          }
        });
      };

      // Initial call to adjust heights
      adjustHeights();

      // Listen for window resize and readjust heights
      window.addEventListener("resize", adjustHeights);
    },

    //----------------------------------------------------------
  },
};
</script>
