<template>
  <div style="height:530px">
    <FileReader @processData="processData" />
    <div v-if="!error || !flagFileLoaded">
      <v-alert dense outlined type="warning" class="white--text">
        <strong> Sorry </strong> there are no employees to show.
        <p>
          The employees file is empty or does not have with the correct entry
          and exit time format
        </p>
      </v-alert>

      <v-alert
        v-if="!this.flagFileLoaded"
        dense
        outlined
        type="error"
        class="white--text"
      >
        <strong> Sorry </strong> The file must be of type text (.txt)
      </v-alert>
    </div>

    <div v-else>
      <v-simple-table v-if="!loadingTable" fixed-header height="510px">
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
    </div>
    <v-progress-circular
      v-if="loadingTable"
      :size="50"
      color="primary"
      indeterminate
    >
      Loading data
    </v-progress-circular>
  </div>
</template>

<script>
import FileReader from "./FileReader";
import { paymentInformation, regExpDayTime } from "../libs/paymentInformation";
import {
  calculatePayRange,
  calculateTotalHoursWorked,
} from "../libs/calculationUtils";

export default {
  name: "EmployeeDataTable",
  components: { FileReader },
  data() {
    return {
      pay: paymentInformation,
      employeesLoades: [],
      regExpDayTime: regExpDayTime,
      addTotalPaymentsEmployees: 0,
      loadingTable: false,
      employeeLengthArray: 0,
      dataFile: "",
      flagFileLoaded: true,
    };
  },

  /**
   * @description Notify in the UI to user that the file has not been uploaded or has an invalid format
   * @return true if the employee array "employeesLoades" is null or false if it is full
   */
  computed: {
    error() {
      return this.employeesLoades.length > 0 ? true : false;
    },
  },

  methods: {
  /**
   * @description Notify in the UI to user that el archivo no es de extension .txt
   *              or if it is a .txt file.- Present in view: the file uploaded of employees with their respective payment
   * @param {Object} e Receives from the change event of the input, the reading of the content of the .txt file
   * @return false to flagFileLoaded status flag when file is not extension .txt
   */
    processData(e) {
      if (e === false) {
        return (this.flagFileLoaded = e);
      } else {
        this.flagFileLoaded = true;
        const dataFile = this.loadFileTxt(e);
        this.sortAndGenerateData(dataFile);
        this.assignTotalHoursAndPay();
        this.calculateSubtotalAndTotalPayment();
        this.loadingTable = false;
      }
    },

    /**
     * @description Load file line by line, no spaces with employee data
     * @param {Object} fileData Contains the complete reading of the content of the .txt file
     * @return array containing the lines read with no spaces from the file .txt
     */
    loadFileTxt(fileData) {
      this.resetData();
      const arrayWithoutSpaces = [];
      try {
        const arrayLineByLine = [];
        arrayLineByLine.push(fileData.split("\n"));

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

    /**
     * @description For each file load of the file event, the data component values are reset
     * @return nothing, but reset the array of employees and the total payment to employees
     */
    resetData() {
      this.addTotalPaymentsEmployees = 0;
      this.employeesLoades = [];
    },

    /**
     * @description Captures the name of the employee with their respective valid: entry time and exit time records
     * @param {Array} dataFile Contains all data of employees
     * @see regExpDayTime ER that captures valid the day and time of entry and exit
     * @return nothing, but it assigns to the component data: 'employeesLoades', 'employeeLengthArray'
     */
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

    /**
     * @description Calculate the payment for the hours you work, according to the day and time of entry and exit
     * @see calculateTotalHoursWorked Return the number of hours, minutes and seconds jobs
     * @see calculatePayRange Return a number that indicates the payment according to the time of entry and exit
     * @return nothing, but assigns to the component data 'employeesLoades', the hours worked with their pay
     */
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
            payHourWorked: hoursWorked.hour,
            payMinWorked: hoursWorked.minutes,
            paySecWorked: hoursWorked.seconds,
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

    /**
     * @description Calculate the total pay for the hours worked by an employee and calculate the total pay of the employees
     * @return nothing, but registers to each employeesLoades the value of their total pay and assigns in the component data 
     *          the total value to pay of the employees
     */
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
