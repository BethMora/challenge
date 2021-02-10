<template>
  <v-container class="mb-4">
    <label>
      <input type="file" @change="loadTextFromFile" />
    </label>
  </v-container>
</template>

<script>
export default {
  methods: {
    loadTextFromFile(ev) {
      const file = ev.target.files[0];
      const reader = new FileReader();
      const extension = file.name.split(".").pop();
      if (extension != "txt") {
        reader.onload = this.$emit("processData", false);
      } else {
        reader.onload = (e) => this.$emit("processData", e.target.result);
        reader.readAsText(file);
      }
    }
  },
};
</script>
