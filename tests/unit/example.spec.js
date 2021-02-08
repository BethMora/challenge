import { shallowMount } from "@vue/test-utils";
import Navbar from "@/components/Navbar.vue";

describe("Navbar.vue", () => {
  it("renders props.title when passed", () => {
    const title = "new message";
    const wrapper = shallowMount(Navbar, {
      propsData: { title }
    });
    expect(wrapper.text()).toMatch(title);
  });
});
