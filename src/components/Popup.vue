<template>
  <v-dialog v-model="dialog" max-width="500">
    <v-card>
      <v-card-title class="headline">Confirmation</v-card-title>
      <v-card-text>
        <div>
          <p>hej</p>
          <v-checkbox v-model="checkboxChecked" label="I confirm"></v-checkbox>
        </div>
      </v-card-text>
      <v-card-actions>
        <v-btn color="primary" @click="confirm">Confirm</v-btn>
        <v-btn @click="cancel">Cancel</v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script>
export default {
  name: "Popup",
  data() {
    return {
      dialog: true, // Set dialog to true initially to show the dialog
      checkboxChecked: false,
    };
  },
  methods: {
    confirm() {
      this.$emit("confirmed", this.checkboxChecked);
      this.dialog = false; // Close the dialog after emitting the confirmed event
    },
    cancel() {
      this.$emit("cancelled");
      this.dialog = false; // Close the dialog if cancelled
    },
  },
};
</script>
