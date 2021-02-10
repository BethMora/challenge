import { shallowMount } from "@vue/test-utils";
import Subheader from "@/components/Subheader.vue";

describe("Renders footer component", () => {
  it("renders props.subtitle when passed", () => {
    const subtitle = "Employees list";
    const wrapper = shallowMount(Subheader, {
      propsData: { subtitle }
    });
    expect(wrapper.find("span").text()).toMatch("Employees list");
  });

  it("not renders props.subtitle when not passed", () => {
    const wrapper = shallowMount(Subheader);
    expect(wrapper.find("span").text()).toEqual("");
  });
});
