class TimeStamp {

  static createTimestamp() {
    var currentDate = new Date();

    var date = currentDate.getDate();
    var month = currentDate.getMonth();
    var year = currentDate.getFullYear();
    var hour = currentDate.getHours();
    var minute = currentDate.getMinutes();
    var second = currentDate.getSeconds();

    var date = year + "-" + (month + 1) + "-" + date;
    var time = hour + ":" + minute + ":" + second;

    return date + " " + time
  }
}
