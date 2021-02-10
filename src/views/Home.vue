<template>
  <div>
    <Navbar :title="title" />
    <Subheader :subtitle="subtitle" />

    <v-container fluid>
      <EmployeeDataTable />
    </v-container>

    <Footer :date="date" />
  </div>
</template>

<script>
import EmployeeDataTable from "../components/EmployeeDataTable";
import Navbar from "../components/Navbar";
import Subheader from "../components/Subheader";
import Footer from "../components/Footer";

export default {
  name: "Home",
  components: { EmployeeDataTable, Navbar, Subheader, Footer },
  data() {
    return {
      title: "'N' company employees",
      subtitle: "Hours and payments to employees",
      date: new Date().getFullYear() + " "
    };
  }
};
</script>
