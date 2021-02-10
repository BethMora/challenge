<template>
  <v-app-bar app class="deep-purple darken-4" dark name="navBar">
    <v-icon large color="deep-purple lighten-5" class="ml-6" name="icoCompany">
      mdi-domain
    </v-icon>
    <v-toolbar-title class="ml-6 text-uppercase">
      <span> {{ title }}</span>
    </v-toolbar-title>
    <v-spacer />

    <v-icon large name="icoClock">
      mdi-account-clock
    </v-icon>
    <v-icon large class="mr-6" name="icoCompany">
      mdi-currency-usd
    </v-icon>
  </v-app-bar>
</template>

<script>
export default {
  name: "Navbar",
  props: ["title"]
};
</script>
