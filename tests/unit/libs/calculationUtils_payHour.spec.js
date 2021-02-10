import {
  returnIndexDayRange,
  returnIndexIntervalAccordingToRange,
  calculatePayRange
} from "@/libs/calculationUtils";
import { paymentInformation } from "@/libs/paymentInformation";

describe("Returns the index where the day is equal to the one sent as the function parameter", () => {
  it("it should return 0 or 1", () => {
    expect(returnIndexDayRange("MO", paymentInformation)).toBe(0);
    expect(returnIndexDayRange("SU", paymentInformation)).toBe(1);
  });

  it("Should return -1. Because the day does not exist", () => {
    expect(returnIndexDayRange("LU", paymentInformation)).toBe(-1);
  });
});

describe("Returns the index where the day and work hours's is equal to the one sent as the function parameter", () => {
  it("it should return 0 or 1", () => {
    expect(
      returnIndexIntervalAccordingToRange(
        "00:01",
        "09:00",
        "MO",
        paymentInformation
      )
    ).toBe(0);
    expect(
      returnIndexIntervalAccordingToRange(
        "09:01",
        "18:00",
        "WE",
        paymentInformation
      )
    ).toBe(1);
    expect(
      returnIndexIntervalAccordingToRange(
        "18:01",
        "00:00",
        "SU",
        paymentInformation
      )
    ).toBe(2);
    expect(
      returnIndexIntervalAccordingToRange(
        "00:01",
        "08:59",
        "MO",
        paymentInformation
      )
    ).toBe(0);
    expect(
      returnIndexIntervalAccordingToRange(
        "17:00",
        "18:00",
        "WE",
        paymentInformation
      )
    ).toBe(1);
    expect(
      returnIndexIntervalAccordingToRange(
        "22:00",
        "00:00",
        "SU",
        paymentInformation
      )
    ).toBe(2);
  });

  it("Should return -3. Because the day does not exist", () => {
    expect(
      returnIndexIntervalAccordingToRange(
        "00:01",
        "09:00",
        "lu",
        paymentInformation
      )
    ).toBe(-3);
  });

  it("Should return -2. Because the check-in time is greater than the check-out time", () => {
    expect(
      returnIndexIntervalAccordingToRange(
        "22:01",
        "09:00",
        "SA",
        paymentInformation
      )
    ).toBe(-2);
    expect(
      returnIndexIntervalAccordingToRange(
        "01:01",
        "01:00",
        "FR",
        paymentInformation
      )
    ).toBe(-2);
    expect(
      returnIndexIntervalAccordingToRange(
        "19:10",
        "19:09",
        "SU",
        paymentInformation
      )
    ).toBe(-2);
  });

  it("Should return -1. Because the input and output time interval is not within the range defined in the configuration array: 'paymentInformation'", () => {
    expect(
      returnIndexIntervalAccordingToRange(
        "00:00",
        "09:00",
        "TH",
        paymentInformation
      )
    ).toBe(-1);
    expect(
      returnIndexIntervalAccordingToRange(
        "23:59",
        "00:01",
        "TH",
        paymentInformation
      )
    ).toBe(-1);
    expect(
      returnIndexIntervalAccordingToRange(
        "10:00",
        "20:00",
        "TH",
        paymentInformation
      )
    ).toBe(-1);
    expect(
      returnIndexIntervalAccordingToRange(
        "09:00",
        "18:00",
        "SA",
        paymentInformation
      )
    ).toBe(-1);
    expect(
      returnIndexIntervalAccordingToRange(
        "18:01",
        "00:01",
        "TH",
        paymentInformation
      )
    ).toBe(-1);
  });

  describe("It should return a number that is the hourly payment value according to work hours on days from Monday to Friday", () => {
    it("Should return 25 for hours from 01: 00 - 09:00 on days from Monday to Friday", () => {
      expect(
        calculatePayRange("00:01", "09:00", "MO", paymentInformation)
      ).toBe(25);

      expect(
        calculatePayRange("00:01", "08:59", "TU", paymentInformation)
      ).toBe(25);

      expect(
        calculatePayRange("00:59", "07:59", "FR", paymentInformation)
      ).toBe(25);

      expect(
        calculatePayRange("02:00", "09:00", "TH", paymentInformation)
      ).toBe(25);
    });

    it("Should return 15 for hours from 09:01 - 18:00 on days from Monday to Friday ", () => {
      expect(
        calculatePayRange("09:01", "18:00", "MO", paymentInformation)
      ).toBe(15);

      expect(
        calculatePayRange("09:01", "17:00", "TU", paymentInformation)
      ).toBe(15);

      expect(
        calculatePayRange("13:59", "18:00", "FR", paymentInformation)
      ).toBe(15);

      expect(
        calculatePayRange("12:30", "15:00", "TH", paymentInformation)
      ).toBe(15);
    });

    it("Should return 20 for hours from 18:01 - 00:00 on days from Monday to Friday ", () => {
      expect(
        calculatePayRange("18:01", "00:00", "MO", paymentInformation)
      ).toBe(20);

      expect(
        calculatePayRange("18:01", "23:59", "TU", paymentInformation)
      ).toBe(20);

      expect(
        calculatePayRange("20:59", "00:00", "FR", paymentInformation)
      ).toBe(20);

      expect(
        calculatePayRange("22:40", "23:20", "TH", paymentInformation)
      ).toBe(20);
    });
  });

  describe("It should return a number that is the hourly payment value according to work hours on days from SATURDAY to SUNDAY", () => {
    it("Should return 30 for hours from 00: 01 - 09:00", () => {
      expect(
        calculatePayRange("00:01", "09:00", "sa", paymentInformation)
      ).toBe(30);

      expect(
        calculatePayRange("00:01", "08:59", "sa", paymentInformation)
      ).toBe(30);

      expect(
        calculatePayRange("00:59", "07:59", "SU", paymentInformation)
      ).toBe(30);

      expect(
        calculatePayRange("02:00", "09:00", "su", paymentInformation)
      ).toBe(30);
    });

    it("Should return 20 for hours from 09:01 - 18:00", () => {
      expect(
        calculatePayRange("09:01", "18:00", "SA", paymentInformation)
      ).toBe(20);

      expect(
        calculatePayRange("09:01", "17:00", "Sa", paymentInformation)
      ).toBe(20);

      expect(
        calculatePayRange("13:59", "18:00", "Su", paymentInformation)
      ).toBe(20);

      expect(
        calculatePayRange("12:30", "15:00", "sU", paymentInformation)
      ).toBe(20);
    });

    it("Should return 25 for hours from 18:01 - 00:00", () => {
      expect(
        calculatePayRange("18:01", "00:00", "sU", paymentInformation)
      ).toBe(25);

      expect(
        calculatePayRange("18:01", "23:59", "Sa", paymentInformation)
      ).toBe(25);

      expect(
        calculatePayRange("20:59", "00:00", "sA", paymentInformation)
      ).toBe(25);

      expect(
        calculatePayRange("22:40", "23:20", "sU", paymentInformation)
      ).toBe(25);
    });
  });

  describe("Should return -1 because the day does not exist in the configuration array: 'paymentInformation'", () => {
    it("Should return -1. Because the day does not exist", () => {
      expect(
        calculatePayRange("00:01", "09:00", "lu", paymentInformation)
      ).toBe(-1);
    });
    it("Should return -1. Because the input and output time interval is not within the range defined in the configuration array: 'paymentInformation'", () => {
      expect(
        calculatePayRange("00:01", "23:00", "MO", paymentInformation)
      ).toBe(-1);
    });
    it("Should return -2. Because the check-in time is greater than the check-out time", () => {
      expect(
        calculatePayRange("22:01", "09:00", "SA", paymentInformation)
      ).toBe(-1);
    });
  });
});
