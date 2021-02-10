/**
 * @description data that has the payment configuration according to: the day and time of entry and exit
 */
const paymentInformation = [
  {
    daysRange: ["MO", "TU", "WE", "TH", "FR"],
    pays: [
      {
        interval: ["00:01", "09:00"],
        pay: 25
      },
      {
        interval: ["09:01", "18:00"],
        pay: 15
      },
      {
        interval: ["18:01", "00:00"],
        pay: 20
      }
    ]
  },
  {
    daysRange: ["SA", "SU"],
    pays: [
      {
        interval: ["00:01", "09:00"],
        pay: 30
      },
      {
        interval: ["09:01", "18:00"],
        pay: 20
      },
      {
        interval: ["18:01", "00:00"],
        pay: 25
      }
    ]
  }
];

/**
 * @description This regular expression is the one that captures only working hours that match:
 *              - First day of work: "MO", "TU", "WE", "TH", "FR", "SA", "SU"
 *              -Followed by: 2 numbers: 2 numbers - 2 numbers: 2 numbers
 *               Example: TH02: 00-06: 00      Otherwise, it does not capture anything
 */
const regExpDayTime = RegExp(
  "(MO|TU|WE|TH|FR|SA|SU)[0-9]{2}:[0-9]{2}-[0-9]{2}:[0-9]{2}",
  "ig"
);

export { paymentInformation, regExpDayTime };
