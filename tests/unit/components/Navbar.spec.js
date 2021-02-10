import { shallowMount } from "@vue/test-utils";
import Navbar from "@/components/Navbar.vue";

describe("Renders navbar component", () => {
  it("renders props.title when passed", () => {
    const title = "Employees payments";
    const wrapper = shallowMount(Navbar, {
      propsData: { title }
    });
    expect(wrapper.find("span").text()).toMatch("Employees payments");
  });

  it("not renders props.title when not passed", () => {
    const wrapper = shallowMount(Navbar);
    expect(wrapper.find("span").text()).toEqual("");
  });
});
