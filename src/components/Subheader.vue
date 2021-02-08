<template>
  <v-subheader>
    <v-icon large color="purple">
      mdi-format-list-text
    </v-icon>
    <h3 class="ml-3  text-uppercase purple--text">
      {{ subtitle }}
    </h3>
  </v-subheader>
</template>

<script>
export default {
  name: "Subheader",
  props: ["subtitle"],
};
</script>
