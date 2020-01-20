const hours = document.getElementById('hours');
const minutes = document.getElementById('minutes');
const seconds = document.getElementById('seconds');
const startButton = document.getElementById('startButton');
const stopButton = document.getElementById('stopButton');
const resetButton = document.getElementById('resetButton');

const alarm = new Audio('/sounds/alarm.mp3');

// Plus and minus buttons
//////////////////////////////////////////////////////////////////////////////////////
const addSecond = document.getElementById('addSecond');
const removeSecond = document.getElementById('removeSecond');

const addMinute = document.getElementById('addMinute');
const removeMinute = document.getElementById('removeMinute');

const addHour = document.getElementById('addHour');
const removeHour = document.getElementById('removeHour');

const plusButtons = document.querySelectorAll('.plusButton');
const minusButtons = document.querySelectorAll('.minusButton');


Array.from(plusButtons).forEach(function(button) {
  button.addEventListener('click', function () {
    let value = parseInt(this.parentNode.querySelector('h2').innerHTML, 10);
    value += 1;
    this.parentNode.querySelector('h2').innerHTML = value;
  })
})

Array.from(minusButtons).forEach(function(button) {
  button.addEventListener('click', function () {
    let value = parseInt(this.parentNode.querySelector('h2').innerHTML, 10);
    if (value <= 0) {
      return value
    }
    value -= 1;
    this.parentNode.querySelector('h2').innerHTML = value;
  })
})

// Changing ms to seconds, minutes, hours
//////////////////////////////////////////////////////////////////////////////////////


const msInSec = 1000;
const msInMin = msInSec * 60;
const msInH = msInMin * 60;



function valueToNumber (target) {
    return parseInt(target.innerHTML, 10);
}

function interval () {};


function start () {
  let targetTime = new Date();

  targetTime.setHours(targetTime.getHours() + valueToNumber(hours), targetTime.getMinutes() + valueToNumber(minutes), targetTime.getSeconds() + valueToNumber(seconds));



function update () {
  let now = Date.now();
  let differenceInMilliseconds = targetTime - now;
  let differenceInSeconds = Math.floor((differenceInMilliseconds/msInSec)%60);
  let differenceInMinutes = Math.floor((differenceInMilliseconds/msInMin)%60);
  let differenceInHours = Math.floor((differenceInMilliseconds/msInH)%24);
  seconds.innerHTML = differenceInSeconds;
  minutes.innerHTML = differenceInMinutes;
  hours.innerHTML = differenceInHours;

  if(differenceInMilliseconds <= 0) {
    clearInterval(interval);
    alarm.play();
    seconds.innerHTML = minutes.innerHTML = hours.innerHTML = 0;
  }
}

interval = setInterval(update,1000);

stopButton.addEventListener('click', function () {
  clearInterval(interval);
  alarm.pause();
});

}

startButton.addEventListener('click', function () {
  start();
});

resetButton.addEventListener('click', function () {
  seconds.innerHTML = minutes.innerHTML = hours.innerHTML = 0;
  clearInterval(interval);
});
