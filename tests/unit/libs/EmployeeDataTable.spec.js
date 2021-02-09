import { paymentInformation, regExpDayTime } from "@/libs/paymentInformation";
import {
  calculatePayRange,
  calculateTotalHoursWorked,
} from "@/libs/calculationUtils";

import { shallowMount } from "@vue/test-utils";
import EmployeeDataTable from "@/components/EmployeeDataTable.vue";

// describe("Valida la carga del archivo .txt con sus respectivos calculos", () => {

//   it("renders props.title when passed", () => {
//     const wrapper = shallowMount(EmployeeDataTable, {
//       data: {
//         employeesLoades: [{
//           name: "David",
//           records: [{ startingTime: "10:00", finishingTime: "15:00", day: "SU" }],
//         }],
//         pay: paymentInformation
//       }
//     })

//     // verificar que el error se muestra
//     expect(wrapper.find('.error').exists()).toBeFalsy()
//   });
// });

// it('works with async/await', async () => {
//   const data = await loadFileTxt();
//   expect(data).toEqual('Mark');
// });
