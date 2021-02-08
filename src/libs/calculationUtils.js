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

function hourMinStartingFinishing(starting, finishing) {
  const hourStarting = parseInt(starting.substring(0, starting.indexOf(":")));
  const minStarting = parseInt(starting.substring(starting.indexOf(":") + 1));
  const hourFinishing = parseInt(finishing.substring(0, finishing.indexOf(":")));
  const minFinishing = parseInt(finishing.substring(finishing.indexOf(":") + 1));

  const objStartingFinishing = {
    startTime: hourStarting,
    minStart: minStarting,
    finTime: hourFinishing,
    minFin: minFinishing,
  };
  return objStartingFinishing;
}

function secondsToHours(seconds) {
  let hour = Math.floor(seconds / 3600);
  hour = hour < 10 ? "0" + hour : hour;
  let minute = Math.floor((seconds / 60) % 60);
  minute = minute < 10 ? "0" + minute : minute;
  let second = seconds % 60;
  second = second < 10 ? "0" + second : second;
  const objHoursWorked = {
    hora: hour,
    minutos: minute,
    segundos: second,
  };
  return objHoursWorked;
}

function calculateTotalHoursWorked(starting, finishing) {
  const objStartingFinishing = hourMinStartingFinishing(starting, finishing);
  let hourFinishing = objStartingFinishing.finTime;

  if (objStartingFinishing.finTime === 0) {
    hourFinishing = 24;
  }
  const startingSeg =
    objStartingFinishing.startTime * 3600 + objStartingFinishing.minStart * 60;
  const finishingSeg = hourFinishing * 3600 + objStartingFinishing.minFin * 60;
  const timeWorked = finishingSeg - startingSeg;
  const convertSecondsToHours = secondsToHours(timeWorked);
  return convertSecondsToHours;
}

function returnIndexIntervalAccordingToRange(starting, finishing, day, pay) {
  const indexDayRange = returnIndexDayRange(day, pay);
  let indexIntervalAccordingToRange = -1;
  const objEmployee = hourMinStartingFinishing(starting, finishing);
  pay[indexDayRange].pays.forEach((e, index) => {
    const minInterval = e.interval[0];
    const maxInterval = e.interval[1];
    const objConfig = hourMinStartingFinishing(
      minInterval,
      maxInterval
    );
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

export { calculatePayRange, calculateTotalHoursWorked };
