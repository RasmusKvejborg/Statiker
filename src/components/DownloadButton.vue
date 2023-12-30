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

      const invoice = document.querySelector(me.dom);
      var opt = {
        margin: [2, 2, 2, 2], // top, left, bot, right
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
        console.log(imageUrl);
        const img = new Image();
        img.crossOrigin = "anonymous";
        img.src = imageUrl;
        img.onload = () => {
          html2pdf()
            .from(invoice)
            .set(opt)
            .toPdf()
            .get("pdf")
            .then(function (pdf) {
              // const link = document.createElement("a");
              // link.href = pdf.output("bloburl");
              // link.download = "test56.pdf";
              // link.click();
              // link.remove();

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
                var photoheight = 20;
                pdf.addImage(
                  img,
                  "PNG",
                  15, // 15px fra venstre
                  pdf.internal.pageSize.getHeight() - (1 + photoheight), // 1 px fra bunden
                  20, // bredde
                  photoheight // højde
                );
              }
              pdf.save(me.name);
            });
        };
      } catch (error) {
        console.error("Fejl 124: " + error);
        alert("Fejl 124: " + error);
      }
    },

    async getImageUrl() {
      try {
        const storage = getStorage();
        const userImageRef = ref(storage, `Images/${this.userId}`);
        const imageUrl = await getDownloadURL(userImageRef);
        this.image = imageUrl;
        return imageUrl;
      } catch (error) {
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
