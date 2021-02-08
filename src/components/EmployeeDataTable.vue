<template>
  <div class="my-4">
    <v-simple-table v-if="!loadingTable" fixed-header height="530px">
      <template>
        <thead>
          <tr>
            <th class="text-center pink darken-4 white--text text-uppercase">
              #
            </th>
            <th class="text-center pink darken-4 white--text text-uppercase">
              Starting time
            </th>
            <th class="text-center pink darken-4 white--text text-uppercase">
              Finishing time
            </th>
            <th class="text-center pink darken-4 white--text text-uppercase">
              Day
            </th>
            <th class="text-center pink darken-4 white--text text-uppercase">
              Total hours
            </th>
            <th class="text-center pink darken-4 white--text text-uppercase">
              Pay hour
            </th>
            <th class="text-center pink darken-4 white--text text-uppercase">
              Subtotal payment
            </th>
            <th class="text-center pink darken-4 white--text text-uppercase">
              Employee name
            </th>
          </tr>
        </thead>
        <tbody
          class="text-center grey lighten-4"
          v-for="(e, employeeIndex) in this.employeesLoades"
          :key="employeeIndex"
        >
          <tr
            v-for="(reg, employeeRecordIndex) in e.records"
            :key="employeeRecordIndex"
          >
            <td class="pink darken-4"></td>
            <td>{{ reg.startingTime }}</td>
            <td>{{ reg.finishingTime }}</td>
            <td>{{ reg.day }}</td>
            <td v-if="reg.payRange >= 0">
              {{ reg.payHourWorked.payHourWorked }}:{{
                reg.payHourWorked.payMinWorked
              }}:{{ reg.payHourWorked.paySecWorked }}
            </td>
            <td v-else>time not valid</td>
            <td v-if="reg.payRange >= 0">
              {{ reg.payRange }}
            </td>
            <td v-else>time not valid</td>
            <td>
              {{ reg.subtotalPayment }}
            </td>
            <td>{{ e.name }}</td>
          </tr>
          <tr
            v-if="++employeeIndex"
            class="text-right font-weight-bold grey lighten-3 text-uppercase"
          >
            <td class="pink darken-4"></td>
            <td colspan="5">Full payment to {{ e.name }}</td>
            <td class="text-center ">$ {{ e.totalEmployeePay }}</td>
            <td></td>
          </tr>
          <tr
            v-if="employeeIndex === employeeLengthArray"
            class="pink accent-2 font-weight-bold "
          >
            <td colspan="7" class="text-uppercase text-right">
              Total pay to employees
            </td>
            <td>$ {{ addTotalPaymentsEmployees }}</td>
          </tr>
        </tbody>
      </template>
    </v-simple-table>
    <v-progress-circular v-else :size="50" color="primary" indeterminate>
      Loading data
    </v-progress-circular>
  </div>
</template>

<script>
import { paymentInformation, regExpDayTime } from "../libs/paymentInformation";
import {
  calculatePayRange,
  calculateTotalHoursWorked,
} from "../libs/calculationUtils";

export default {
  name: "EmployeeDataTable",
  data() {
    return {
      pay: paymentInformation,
      employeesLoades: [],
      regExpDayTime: regExpDayTime,
      addTotalPaymentsEmployees: 0,
      loadingTable: true,
      employeeLengthArray: 0,
    };
  },


  async created() {
    try {
      const dataFile = await this.loadFileTxt();
      this.sortAndGenerateData(dataFile);
      this.assignTotalHoursAndPay();
      this.calculateSubtotalAndTotalPayment();
      this.loadingTable = false;
    } catch (error) {
      console.error("The following error has occurred  " + error);
      alert("The following error has occurred  " + error);
    }
  },
  methods: {
    /**
     * @description Load file with data of employees
     * @param {Array} dataFile This param contains all data
     * @param {Array} anotherParam bla bla bla
     */
    async loadFileTxt() {
      const arrayWithoutSpaces = [];
      try {
        
        const data = await fetch("employees.txt");
        const answer = await data.text();

        const arrayLineByLine = [];
        arrayLineByLine.push(answer.split("\n"));

        arrayLineByLine.forEach((e) => {
          for (const iterator of e) {
            let noSpaces = iterator.replace(/ /g, "");
            if (noSpaces.length >= 15) {
              arrayWithoutSpaces.push(noSpaces);
            }
          }
        });
      } catch (error) {
        console.error(`Sorry, the file could not be read ` + error);
        alert(`Sorry, the file could not be read ` + error);
      }

      return arrayWithoutSpaces;
    },

    sortAndGenerateData(dataFile) {
      let readLine = "";
      dataFile.forEach((e) => {
        const longName = e.indexOf("=");
        const name = e.substring(0, longName);
        readLine = e.slice(longName + 1);
        const daysRead = readLine.match(regExpDayTime);
        if (daysRead != null) {
          const objEmployee = {
            name: name,
            records: [],
          };
          for (const iterator of daysRead) {
            objEmployee.records.push({
              startingTime: iterator.substring(2, 7),
              finishingTime: iterator.substring(8),
              day: iterator.substring(0, 2),
            });
          }
          this.employeesLoades.push(objEmployee);
        }
      });
      this.employeeLengthArray = this.employeesLoades.length;
    },

    assignTotalHoursAndPay() {
      this.employeesLoades.forEach((e) => {
        e.records.forEach((reg) => {
          const startingTime = reg.startingTime;
          const finishTime = reg.finishingTime;
          const day = reg.day;
          const hoursWorked = calculateTotalHoursWorked(
            startingTime,
            finishTime
          );

          reg.payHourWorked = {
            payHourWorked: hoursWorked.hora,
            payMinWorked: hoursWorked.minutos,
            paySecWorked: hoursWorked.segundos,
          };
          const payRange = calculatePayRange(
            startingTime,
            finishTime,
            day,
            this.pay
          );
          reg.payRange = payRange;
        });
      });
    },
    calculateSubtotalAndTotalPayment() {
      let totalAddition = 0;
      let recorderCounter;
      this.employeesLoades.forEach((e) => {
        let additionRecords = 0;
        recorderCounter = e.records.length;
        e.records.forEach((reg, counter) => {
          const hourMinuteWorked = parseFloat(
            reg.payHourWorked.payHourWorked +
              "." +
              reg.payHourWorked.payMinWorked
          );

          if (reg.payRange >= 0) {
            reg.subtotalPayment = reg.payRange * hourMinuteWorked;
            totalAddition += reg.subtotalPayment;
            this.addTotalPaymentsEmployees = totalAddition;

            if (counter < recorderCounter) {
              additionRecords += reg.subtotalPayment;
              e.totalEmployeePay = additionRecords;
            }
          }
        });
      });
    },
  },
};
</script>
