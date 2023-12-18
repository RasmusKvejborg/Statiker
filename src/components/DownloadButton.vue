<template>
  <v-btn @click="downloadFile">Download PDF</v-btn>
</template>

<script>
import html2pdf from "html2pdf.js";

export default {
  props: ["dom", "name"],
  methods: {
    downloadFile() {
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

      html2pdf()
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
          }

          pdf.save();
        });
    },
  },
};
</script>
