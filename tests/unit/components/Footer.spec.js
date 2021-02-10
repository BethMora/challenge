import { shallowMount } from "@vue/test-utils";
import Footer from "@/components/Footer.vue";

describe("Renders footer component", () => {
  it("renders props.date when passed", () => {
    const date = "2021";
    const wrapper = shallowMount(Footer, {
      propsData: { date }
    });
    expect(wrapper.find("span").text()).toMatch("2021");
  });

  it("renders props.date when not passed because it is default", () => {
    const wrapper = shallowMount(Footer);
    expect(wrapper.find("span").text()).toEqual("2021/02");
  });
});
