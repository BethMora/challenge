import { shallowMount } from "@vue/test-utils";
import EmployeeDataTable from "@/components/EmployeeDataTable.vue";

describe("Valida la carga del archivo .txt con sus respectivos calculos", () => {
  it("renders props.title when passed", () => {
    const wrapper = shallowMount(EmployeeDataTable);

    // verificar que el error se muestra
    expect(wrapper.find(".error").exists()).toBeFalsy();
  });
});
