function getHourDifference(date1, date2) {
  const diffInMilliseconds = Math.abs(date2 - date1);
  const diffInHours = diffInMilliseconds / (1000 * 60 * 60);
  return diffInHours;
}

function addMinutes(date, minutes) {
  return new Date(date.getTime() + minutes * 60000);
}


function formatDate(date) {
  const year = date.getFullYear() % 100;
  const month = (date.getMonth() + 1).toString().padStart(2, '0');
  const day = date.getDate().toString().padStart(2, '0');
  const hour = date.getHours().toString().padStart(2, '0');
  const minute = date.getMinutes().toString().padStart(2, '0');
  const second = date.getSeconds().toString().padStart(2, '0');
  return `20${year}-${month}-${day} ${hour}:${minute}:${second}`;
}

function getJulianDay(date) {
  const year = date.getFullYear();
  const month = date.getMonth() + 1;
  const day = date.getDate();
  const isLeapYear = year % 4 === 0 && (year % 100 !== 0 || year % 400 === 0);
  const daysInMonth = [31, isLeapYear ? 29 : 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];
  let julianDay = 0;

  for (let i = 0; i < month - 1; i++) {
    julianDay += daysInMonth[i];
  }
  julianDay += day;
  return julianDay;
}

function zeroPad(num, places) {
  num = num.toString();
  var zerosToPad = places - num.length;
  if (zerosToPad > 0) {
    for (var i = 0; i < zerosToPad; i++) {
      num = "0" + num;
    }
  }
  return num;
}

function codeBarGenerator(nTerminal, now) {
  const year = now.getFullYear()- 2000; // YYYY
  let hour = now.getHours() + 1; // 1 - 24
  let minutes = now.getMinutes() + 1; // 1 - 60
  let seconds = now.getSeconds() + 1; // 1 - 60
  let julian_day = getJulianDay(now);

  hour = zeroPad(hour, 2);
  minutes = zeroPad(minutes, 2);
  seconds = zeroPad(seconds, 2);
  julian_day = zeroPad(julian_day, 3);

  return `${nTerminal}${year}${julian_day}${hour}${minutes}${seconds}`;
}

function isExpirate (since, to) {
  const sinceT = since.getTime();
  const toT = to.getTime();
  if (sinceT < toT) return false;
  return true;
}

function getMinutesDiff(date1, date2) {
  const diffInMs = Math.abs(date2.getTime() - date1.getTime());
  return Math.floor(diffInMs / (1000 * 60));
}

function padZeros(number) {
  const factor = 10**2;
  const rounded = Math.round(number * factor) / factor;
  const parts = rounded.toString().split('.');
  const decimalPart = parts.length > 1 ? parts[1] : '';
  const zeros = '0'.repeat(2 - decimalPart.length);
  if (parts.length === 1) return `${rounded}.${zeros}`;
  return `${rounded}${zeros}`;
}

function calculateTotal(otc, listTariff, tariff) {
  let total = 0;
  const trf = listTariff.find((t) => t.id === parseInt(tariff));
  const fractions = trf.f;
  otc.in_ = otc.in;
  otc.out_ = otc.out;
  if (process.env.REACT_APP_ENV === 'dev') {
    otc.time = getMinutesDiff(new Date(otc.out_), new Date(otc.in_.replace('Z', '+05:00')));
  } else {
    otc.time = Math.round(((new Date(otc.out) - new Date(otc.in)) / 1000) / 60);
  }
  if (process.env.REACT_APP_ENV === 'dev') {
    otc.in = new Date(otc.in.replace('Z', '+05:00')).toLocaleString();
  } else {
    otc.in = new Date(otc.in).toLocaleString();
  }
  otc.out = new Date(otc.out).toLocaleString();

  if (otc.time > 60) {
    const hours = parseInt(otc.time / 60);
    const minutes = otc.time % 60;
    total = hours * trf.v_hour;
    total = parseFloat(total.toFixed(2));
    if (minutes > 1) {
      const fraction = fractions.find((f) => minutes >= f.start && minutes <= f.end);
      total += fraction.value;
    }
  }
  if (otc.time <= 60) {
    const fraction = fractions.find((f) => otc.time >= f.start && otc.time <= f.end);
    total += fraction.value;
  }
  return padZeros(total);
}


module.exports = {
  codeBarGenerator,
  isExpirate,
  formatDate,
  addMinutes,
  getHourDifference,
  getMinutesDiff,
  calculateTotal,
  padZeros
};
