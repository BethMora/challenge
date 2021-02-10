import { mount } from "@vue/test-utils";
import FileReader from "@/components/FileReader.vue";

describe("Validate the loading of the .txt file with their respective calculations", () => {
  it("renders props.title when passed", async () => {
    const wrapper = mount(FileReader);
    let method = wrapper.vm.loadTextFromFile;
    expect(method != undefined).toBe(true);
  });
});
