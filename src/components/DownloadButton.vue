<template>
  <v-btn @click="downloadFile">Download PDF</v-btn>
</template>

<script>
import html2pdf from "html2pdf.js";
import { getStorage, ref, getDownloadURL } from "firebase/storage";

export default {
  data() {
    return {
      image: null,
    };
  },
  props: {
    dom: String,
    name: String,
    userId: String,
  },
  methods: {
    async downloadFile() {
      const me = this;
      console.log(me.name);

      const dom = document.querySelector(me.dom);
      var opt = {
        margin: [2, 2, 35, 2], // top, left, bot, right. Men måske skal top bruges nogle gange for at få bunden til at se rigtig ud..
        filename: "testname44.pdf",
        pagebreak: { mode: "avoid-all" },
        html2canvas: { useCORS: true },
        jsPDF: {
          orientation: "landscape",
          format: "a3",
        },
      };
      try {
        const imageUrl = await this.getImageUrl();
        const img = new Image();
        img.crossOrigin = "anonymous";
        img.src = imageUrl;
        // Wait for the image to load before generating the PDF
        img.onload = () => {
          let naturalWidth = img.naturalWidth; // Get image width
          let naturalHeight = img.naturalHeight; // Get image height
          var maxHeight = 35; // adjust this value to change logo size
          // Conditionally adjust height if it exceeds 35 pixels
          if (naturalHeight > maxHeight) {
            const ratio = maxHeight / naturalHeight;
            naturalHeight = maxHeight; // Set the height to 35 pixels
            naturalWidth *= ratio; // Maintain aspect ratio for width
          }
          // Start PDF generation
          this.generatePdf(
            dom,
            opt,
            imageUrl,
            img,
            me,
            naturalWidth,
            naturalHeight
          );
        };
        // Generate PDF directly if there's no image URL
        if (!imageUrl) {
          this.generatePdf(dom, opt, null, null, me, null, null);
        }
      } catch (error) {
        console.error("Error:", error.message);
        alert("Error: " + error.message);
      }
    },

    generatePdf(dom, opt, imageUrl, img, me, naturalWidth, naturalHeight) {
      html2pdf()
        .from(dom)
        .set(opt)
        .toPdf()
        .get("pdf")
        .then(function (pdf) {
          var totalPages = pdf.internal.getNumberOfPages();
          for (let i = 1; i <= totalPages; i++) {
            pdf.setPage(i);
            pdf.setFontSize(10);
            pdf.setTextColor(100);
            pdf.text(
              "Side " + i + " af " + totalPages,
              pdf.internal.pageSize.getWidth() - 25,
              pdf.internal.pageSize.getHeight() - 4
            );
            // Add the image to the PDF if it exists
            if (imageUrl) {
              pdf.addImage(
                img,
                "PNG",
                15, // 15px from left
                pdf.internal.pageSize.getHeight() - (1 + naturalHeight), // 1px from bottom
                naturalWidth, // width
                naturalHeight // height
              );
            }
          }
          pdf.save(me.name);
        });
    },

    async getImageUrl() {
      try {
        const storage = getStorage();
        const userImageRef = ref(storage, `Images/${this.userId}`);
        const imageUrl = await getDownloadURL(userImageRef);
        this.image = imageUrl;
        return imageUrl;
      } catch (error) {
        if (error.code === "storage/object-not-found") {
          console.log("Image not found.");
          return null; // Return null when image is not found
        }
        throw new Error("Failed to fetch image URL: " + error);
      }
    },

    async imageUrlToBase64(url) {
      try {
        const response = await fetch(url);
        const blob = await response.blob();
        return new Promise((resolve, reject) => {
          const reader = new FileReader();
          reader.onloadend = () => resolve(reader.result);
          reader.onerror = reject;
          reader.readAsDataURL(blob);
        });
      } catch (error) {
        throw new Error("Failed to convert image URL to base64: " + error);
      }
    },
  },
};
</script>
