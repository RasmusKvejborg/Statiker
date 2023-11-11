<template>
  <nav>
    <v-toolbar flat app>
      <v-toolbar-title class="text-uppercase grey--text" style="flex: none">
        <span>Nord</span>
        <span class="font-weight-bold">Statik</span>
      </v-toolbar-title>

      <v-spacer></v-spacer>
      <v-btn flat color="grey" @click="navigateToHome">Hjem</v-btn>

      <v-btn flat color="grey">Om NordStatik</v-btn>

      <v-btn flat color="grey">Kontakt</v-btn>
    </v-toolbar>
  </nav>
  <router-view />
</template>

<style src="./style.css" />

<script>
export default {
  methods: {
    navigateToHome() {
      this.$router.push("/");
    },
  },
};
</script>
