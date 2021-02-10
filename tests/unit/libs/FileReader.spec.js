import { mount } from "@vue/test-utils";
import FileReader from "@/components/FileReader.vue";

describe("Valida la carga del archivo .txt con sus respectivos calculos", () => {
  it("renders props.title when passed", async () => {
    const wrapper = mount(FileReader);
    const input = wrapper.find('input[type="file"]')
    expect(wrapper.vm.$emit('processDatass')).toBeTruth
    expect(wrapper.emitted().processDatass).toBeTruthy()
  });       
});
