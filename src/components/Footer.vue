<template>
  <v-footer padless dark app>
    <v-col class="text-center deep-purple darken-2" cols="12">
      <span> {{ date }} </span> — <strong>Vuetify</strong>
    </v-col>
  </v-footer>
</template>

<script>
export default {
  name: "Footer",
  props: {
    date: {
      type: String,
      default: "2021/02"
    }
  }
};
</script>
