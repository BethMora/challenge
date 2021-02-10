<template>
  <v-container class="mb-4">
    <label>
      <input type="file" @change="loadTextFromFile" />
    </label>
  </v-container>
</template>

<script>
export default {
  /**
   * @description From the file upload input it reads its content if it is a .txt file
   * @see FileReader API Js object that allows to read files stored in the client asynchronously
   * @return nothing, but it emits an event called processData false if the file is not .txt 
   *                  otherwise it emits the content read from the valid file with extension .txt
   */
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
    },
  }
};
</script>
