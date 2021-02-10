import { shallowMount } from "@vue/test-utils";
import EmployeeDataTable from "@/components/EmployeeDataTable";

import sinon from "sinon";

const data =
  "RENE = MO10: 00-12: 00, TU10: 00-12: 00, TH01: 00-03: 00, SA14: 00-18: 00, SU20: 00-21: 00\n" +
  "ASTRID = MO10: 00-12: 00, TH12: 00-14: 00 , SU20: 00-21: 00";

describe("Validate the loading of the .txt file with their respective calculations", () => {
  it("Renders the correct execution of the call to the methods that work with the data of the loaded file", async () => {
    const loadFileTxtSpy = sinon.spy(EmployeeDataTable.methods, "loadFileTxt");
    const sortAndGenerateDataSpy = sinon.spy(
      EmployeeDataTable.methods,
      "sortAndGenerateData"
    );
    const assignTotalHoursAndPaySpy = sinon.spy(
      EmployeeDataTable.methods,
      "assignTotalHoursAndPay"
    );
    const calculateSubtotalAndTotalPaymentSpy = sinon.spy(
      EmployeeDataTable.methods,
      "calculateSubtotalAndTotalPayment"
    );
    const wrapper = shallowMount(EmployeeDataTable);
    wrapper.vm.processData(data);

    wrapper.vm.$nextTick(() => {
      expect(loadFileTxtSpy.calledOnce).toBe(true);
      expect(sortAndGenerateDataSpy.calledOnce).toBe(true);
      expect(assignTotalHoursAndPaySpy.calledOnce).toBe(true);
      expect(calculateSubtotalAndTotalPaymentSpy.calledOnce).toBe(true);
      expect(wrapper.vm.$data.employeesLoades.length > 0).toBe(true);
      expect(wrapper.vm.$data.addTotalPaymentsEmployees != 0).toBe(true);
      expect(wrapper.vm.$data.loadingTable).toBe(false);
    });
  });
});
