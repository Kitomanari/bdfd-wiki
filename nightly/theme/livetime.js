document.addEventListener("DOMContentLoaded", function() {
    var day = new Date().getDate();
    var time = new Date().getTime();
    var second = new Date().getSeconds();
    var minute = new Date().getMinutes();
    var hour = new Date().getHours();

    var dayElement = document.getElementById('day-mark');
    if (dayElement) {
        dayElement.innerHTML = "Current Day: " + day;
    }

    var unixElement = document.getElementById('unix-mark');
    if (unixElement) {
        unixElement.innerHTML = "Current Unix-time: " + time;
    }

    var secondElement = document.getElementById('second-mark');
    if (secondElement) {
        secondElement.innerHTML = "Current Second: " + second;
    }

    var minuteElement = document.getElementById('minute-mark');
    if (minuteElement) {
        minuteElement.innerHTML = "Current Minute: " + minute;
    }

    var hourElement = document.getElementById('hour-mark');
    if (hourElement) {
        hourElement.innerHTML = "Current Hour: " + hour;
    }
});
