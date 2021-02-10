/**
 * @description Converts the input and output parameters into their equivalent to hours and minutes of type integer
 * @param {String} starting Check in time eg "10:10"
 * @param {String} finishing Check out time eg "12:03"
 * @return {Object} whose keys refer to the time in hours and minutes of entry and exit, whose values are integers
 */
function hourMinStartingFinishing(starting, finishing) {
  let hourStarting = parseInt(starting.substring(0, starting.indexOf(":")));
  const minStarting = parseInt(starting.substring(starting.indexOf(":") + 1));
  let hourFinishing = parseInt(finishing.substring(0, finishing.indexOf(":")));
  const minFinishing = parseInt(
    finishing.substring(finishing.indexOf(":") + 1)
  );

  if (isNaN(hourStarting) || isNaN(hourFinishing)) {
    (hourStarting = 0), (hourFinishing = 0);
  }

  const objStartingFinishing = {
    startTime: hourStarting,
    minStart: minStarting,
    finTime: hourFinishing,
    minFin: minFinishing
  };
  return objStartingFinishing;
}

/**
 * @description Converts segundos a su equivalente en: hora, minutos, segundos
 * @param {Integer} seconds Check in time eg "10:10"
 * @return {Object} whose keys refer to the time in hours, minutes and seconds, with values of type string
 */
function secondsToHours(seconds) {
  let objHoursWorked = {
    hour: "00",
    minutes: "00",
    seconds: "00"
  };
  if (seconds > 0) {
    let hour = Math.floor(seconds / 3600);
    hour = hour < 10 ? "0" + hour : hour + "";
    let minute = Math.floor((seconds / 60) % 60);
    minute = minute < 10 ? "0" + minute : minute + "";
    let second = seconds % 60;
    second = second < 10 ? "0" + second : second + "";
    objHoursWorked = {
      hour: hour,
      minutes: minute,
      seconds: second
    };
  }
  return objHoursWorked;
}

/**
 * @description Calculate the total hours worked according to the time of entry and exit
 * @param {String} starting Check in time eg "00:10"
 * @param {String} finishing Check out time eg "08:59"
 * @see hourMinStartingFinishing First convert the check-in and check-out times to their integer equivalent
 * @see secondsToHours Convert to hours, minutes, seconds; the difference between departure hour-minute and entry hour-minute
 * @return {Object} whose keys refer to the time worked in: hours, minutes and seconds, with values of type string
 */
function calculateTotalHoursWorked(starting, finishing) {
  const objStartingFinishing = hourMinStartingFinishing(starting, finishing);
  let hourFinishing = objStartingFinishing.finTime;

  if (objStartingFinishing.finTime === 0) {
    hourFinishing = 24;
  }
  const startingSeg =
    objStartingFinishing.startTime * 3600 + objStartingFinishing.minStart * 60;
  const finishingSeg = hourFinishing * 3600 + objStartingFinishing.minFin * 60;
  let convertSecondsToHours = { hour: "00", minutes: "00", seconds: "00" };

  if (objStartingFinishing.startTime <= hourFinishing) {
    if (
      objStartingFinishing.startTime < hourFinishing &&
      objStartingFinishing.startTime != hourFinishing
    ) {
      const timeWorked = finishingSeg - startingSeg;
      convertSecondsToHours = secondsToHours(timeWorked);
    }

    if (objStartingFinishing.startTime === hourFinishing) {
      if (objStartingFinishing.minStart <= objStartingFinishing.minFin) {
        const timeWorked = finishingSeg - startingSeg;
        convertSecondsToHours = secondsToHours(timeWorked);
      }
    }
  }
  return convertSecondsToHours;
}

/**
 * @description According to the day searched in the data paymentInformation, it returns the index where day is find
 * @param {String} day Day worked by the employee, eg "SA"
 * @param {Array} pay Array containing payment information according to: working hours and day
 * @return {Integer} index of the pay array that matches the day searched
 */
function returnIndexDayRange(day, pay) {
  let indexDayRange = -1;
  pay.forEach((e, i) => {
    for (const dayRange of e.daysRange) {
      if (day.trim().toLowerCase() === dayRange.trim().toLowerCase()) {
        indexDayRange = i;
        return indexDayRange;
      }
    }
  });
  return indexDayRange;
}

/**
 * @description According to the: day and working hours searched in the data paymentInformation,
 *              it returns the index where day is find and working hours is within the range of the configuration data
 * @param {String} starting Check in time, eg "20:00"
 * @param {String} finishing Check out time, eg "21:00"
 * @param {String} day Day worked by the employee, eg "MO"
 * @param {Array} pay Array containing payment information according to: day, working hours (starting and finishing)
 * @return {Integer} index of the pay array that matches: with the day searched and the hours-minutes of entry and exit
 */
function returnIndexIntervalAccordingToRange(starting, finishing, day, pay) {
  const indexDayRange = returnIndexDayRange(day, pay);
  let indexIntervalAccordingToRange = -1;
  if (indexDayRange === -1) {
    indexIntervalAccordingToRange = -3;
    return indexIntervalAccordingToRange;
  }
  const objEmployee = hourMinStartingFinishing(starting, finishing);
  pay[indexDayRange].pays.forEach((e, index) => {
    const minInterval = e.interval[0];
    const maxInterval = e.interval[1];
    const objConfig = hourMinStartingFinishing(minInterval, maxInterval);
    if (
      objEmployee.startTime > objEmployee.finTime &&
      objEmployee.finTime != 0
    ) {
      indexIntervalAccordingToRange = -2;
    } else if (
      objEmployee.startTime === objEmployee.finTime &&
      objEmployee.minStart >= objEmployee.minFin
    ) {
      indexIntervalAccordingToRange = -2;
    } else {
      if (
        objEmployee.finTime === objConfig.finTime &&
        objEmployee.startTime != objConfig.startTime
      ) {
        //1:00 - 9:00
        if (
          objEmployee.startTime > objConfig.startTime &&
          objEmployee.minFin <= objConfig.minFin
        ) {
          indexIntervalAccordingToRange = index;
        }
      } else if (
        objEmployee.startTime === objConfig.startTime &&
        objEmployee.finTime != objConfig.finTime
      ) {
        if (objConfig.finTime === 0) {
          if (
            objEmployee.startTime >= objConfig.startTime &&
            objEmployee.finTime <= 24
          ) {
            indexIntervalAccordingToRange = index;
          }
        } else {
          if (
            objEmployee.finTime < objConfig.finTime &&
            objEmployee.minStart >= objConfig.minStart
          ) {
            indexIntervalAccordingToRange = index;
          }
        }
        //00:01 - 8:59
        if (
          objEmployee.finTime < objConfig.finTime &&
          objEmployee.minStart >= objConfig.minStart
        ) {
          indexIntervalAccordingToRange = index;
        }

        //00:01 - 09:00
      } else if (
        objEmployee.finTime === objConfig.finTime &&
        objEmployee.startTime === objConfig.startTime
      ) {
        if (
          objEmployee.minFin <= objConfig.minFin &&
          objEmployee.minStart >= objConfig.minStart
        ) {
          indexIntervalAccordingToRange = index;
        }
        //2:00 - 3:00
      } else if (objEmployee.startTime < objEmployee.finTime) {
        if (
          objEmployee.startTime >= objConfig.startTime &&
          objEmployee.finTime <= objConfig.finTime
        ) {
          indexIntervalAccordingToRange = index;
        }

        if (objConfig.finTime === 0) {
          if (
            objEmployee.startTime >= objConfig.startTime &&
            objEmployee.finTime <= 24
          ) {
            indexIntervalAccordingToRange = index;
          }
        }
      } else if (objEmployee.startTime === objEmployee.finTime) {
        //1:10 - 1:50
        if (
          objEmployee.startTime >= objConfig.startTime &&
          objEmployee.finTime <= objConfig.finTime &&
          objEmployee.minStart <= objEmployee.minFin
        ) {
          indexIntervalAccordingToRange = index;
        }
      }
    }
  });
  return indexIntervalAccordingToRange;
}

/**
 * @description Returns the payment according to the working hours and day
 * @param {String} starting Check in time, eg "22:00"
 * @param {String} finishing Check out time, eg "00:00"
 * @param {String} day Day worked by the employee, eg "FR"
 * @param {Array} pay Array containing payment information according to: day, working hours (starting and finishing)
 * @see returnIndexDayRange First it obtains the index in the payment configuration data that matches according to the day
 * @see returnIndexIntervalAccordingToRange Second, it obtains the index in the pay that matches according to work hours
 * @return {Integer}  The payment data type Integer according to the indices: day and working hours
 */
function calculatePayRange(starting, finishing, day, pay) {
  const indexDayRange = returnIndexDayRange(day, pay);
  const indexIntervalAccordingToRange = returnIndexIntervalAccordingToRange(
    starting,
    finishing,
    day,
    pay
  );
  if (indexIntervalAccordingToRange >= 0) {
    return pay[indexDayRange].pays[indexIntervalAccordingToRange].pay;
  } else {
    return -1;
  }
}

export {
  calculatePayRange,
  calculateTotalHoursWorked,
  returnIndexDayRange,
  returnIndexIntervalAccordingToRange,
  hourMinStartingFinishing,
  secondsToHours
};
