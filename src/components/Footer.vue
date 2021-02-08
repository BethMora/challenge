<template>
    <v-footer padless dark>
      <v-col class="text-center deep-purple darken-2" cols="12">
        {{ new Date().getFullYear() }} — <strong>Vuetify</strong>
      </v-col>
    </v-footer>
</template>

<script>
export default {
  name: "Footer"
};
</script>
