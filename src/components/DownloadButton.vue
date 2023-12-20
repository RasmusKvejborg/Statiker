<template>
  <v-btn @click="downloadFile">Download PDF</v-btn>
</template>

<script>
import html2pdf from "html2pdf.js";
import logo from "../assets/logo.png";
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

      const invoice = document.querySelector(me.dom);
      var opt = {
        margin: [2, 2, 2, 2], // top, left, bot, right
        filename: me.name,
        pagebreak: { mode: "avoid-all" },
        jsPDF: {
          orientation: "landscape",
          format: "a3",
        },
      };

      try {
        const pdf = await html2pdf()
          .from(invoice)
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
              var photoheight = 20;
              pdf.addImage(
                logo,
                "PNG",
                15, // 15px fra venstre
                pdf.internal.pageSize.getHeight() - (1 + photoheight), // 1 px fra bunden
                20, // bredde
                photoheight // højde
              );
            }

            pdf.save();
          });
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
  },
};
</script>
