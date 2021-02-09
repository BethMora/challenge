import {
  hourMinStartingFinishing,
  secondsToHours,
  calculateTotalHoursWorked,
} from "@/libs/calculationUtils.js";
import paymentInformation from "@/libs/paymentInformation.js";

describe("Convert seconds to: hours, minutes and seconds", () => {
  it("should return hours, minutes and seconds typeOf String", () => {
    expect(secondsToHours(3600)).toEqual({
      hour: "01",
      minutes: "00",
      seconds: "00",
    });
    expect(secondsToHours(3900)).toEqual({
      hour: "01",
      minutes: "05",
      seconds: "00",
    });
    expect(secondsToHours(8963)).toEqual({
      hour: "02",
      minutes: "29",
      seconds: "23",
    });
  });

  it("should return 0 hours, 0 minutes and 0 seconds, since it is not a valid time", () => {
    expect(secondsToHours(-3894)).toEqual({
      hour: "00",
      minutes: "00",
      seconds: "00",
    });
  });
});

describe("Converts an starting and finishing time of type String to a time of typeOf Integer", () => {
  it("should return an dates integer object's, with hours and minutes of the entry and exit times", () => {
    expect(hourMinStartingFinishing("10:12", "12:14")).toEqual({
      startTime: 10,
      minStart: 12,
      finTime: 12,
      minFin: 14,
    });
    expect(hourMinStartingFinishing("00:00", "23:59")).toEqual({
      startTime: 0,
      minStart: 0,
      finTime: 23,
      minFin: 59,
    });
    expect(hourMinStartingFinishing("1:0", "3:9")).toEqual({
      startTime: 1,
      minStart: 0,
      finTime: 3,
      minFin: 9,
    });
    expect(hourMinStartingFinishing("1", "3")).toEqual({
      startTime: 0,
      minStart: 1,
      finTime: 0,
      minFin: 3,
    });

    expect(hourMinStartingFinishing("10:00", "3:25")).toEqual({
      startTime: 10,
      minStart: 0,
      finTime: 3,
      minFin: 25,
    });
  });
});

describe("Calculate the hours and minutes worked according to the time of entry and exit", () => {
  it("should return hours, minutes and seconds typeOf String", () => {
    expect(calculateTotalHoursWorked("10:12", "12:14")).toEqual({
      hour: "02",
      minutes: "02",
      seconds: "00",
    });

    expect(calculateTotalHoursWorked("01:29", "23:59")).toEqual({
      hour: "22",
      minutes: "30",
      seconds: "00",
    });

    expect(calculateTotalHoursWorked("00:00", "10:46")).toEqual({
      hour: "10",
      minutes: "46",
      seconds: "00",
    });
  });

  it("should return 0 hours, 0 minutes and 0 seconds, since it is not a valid time. Check in time cannot be greater than check out time", () => {
    expect(calculateTotalHoursWorked("20:12", "12:14")).toEqual({
      hour: "00",
      minutes: "00",
      seconds: "00",
    });
  });
});
