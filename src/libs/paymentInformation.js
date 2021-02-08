const paymentInformation = [
  {
    daysRange: ["MO", "TU", "WE", "TH", "FR"],
    pays: [
      {
        interval: ["00:01", "09:00"],
        pay: 25,
      },
      {
        interval: ["09:01", "18:00"],
        pay: 15,
      },
      {
        interval: ["18:01", "00:00"],
        pay: 20,
      },
    ],
  },
  {
    daysRange: ["SA", "SU"],
    pays: [
      {
        interval: ["00:01", "09:00"],
        pay: 30,
      },
      {
        interval: ["09:01", "18:00"],
        pay: 20,
      },
      {
        interval: ["18:01", "00:00"],
        pay: 25,
      },
    ],
  },
];

const regExpDayTime = RegExp(
  "[A-Z]{2}[0-9]{2}:[0-9]{2}-[0-9]{2}:[0-9]{2}",
  "ig"
);

export { paymentInformation, regExpDayTime };
