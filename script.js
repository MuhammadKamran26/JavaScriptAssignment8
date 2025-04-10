let alarms = [];
let isAlarmPlaying = false;
let currentAlarmTime = null;

const sounds = {
  sound1: "https://www.soundjay.com/misc/sounds/bell-ringing-05.mp3",
  sound2: "https://www.soundjay.com/button/sounds/beep-07.mp3",
  sound3: "https://www.soundjay.com/button/sounds/button-09.mp3"
};

function updateCurrentTime() {
  const now = new Date();
  const timeString = now.toLocaleTimeString('en-GB', { hour12: false });
  document.getElementById('current-time').textContent = timeString;

  if (alarms.includes(timeString) && !isAlarmPlaying) {
    currentAlarmTime = timeString;
    triggerAlarm(timeString);
  }
}

setInterval(updateCurrentTime, 1000);

function setAlarm() {
  const input = document.getElementById('alarm-time').value;
  const sound = document.getElementById('sound-select').value;
  if (!input) {
    alert("Please enter a valid time!");
    return;
  }

  const alarmTime = input + ":00";
  if (!alarms.includes(alarmTime)) {
    alarms.push(alarmTime);
    updateAlarmList();
    localStorage.setItem(alarmTime, sound);
    alert("Alarm set for " + alarmTime);
  } else {
    alert("This alarm is already set.");
  }
}

function triggerAlarm(time) {
  const soundChoice = localStorage.getItem(time) || "sound1";
  const audio = document.getElementById('alarm-audio');
  audio.src = sounds[soundChoice];
  audio.play();
  isAlarmPlaying = true;

  showNotification(`⏰ Alarm for ${time}`, "Click 'Snooze' or 'Stop'");
  alert(`⏰ Alarm for ${time} is ringing!`);
}

function stopAlarm() {
  const audio = document.getElementById('alarm-audio');
  audio.pause();
  audio.currentTime = 0;
  isAlarmPlaying = false;
  currentAlarmTime = null;
}

function snoozeAlarm() {
  if (!currentAlarmTime) return alert("No alarm is currently ringing.");
  
  stopAlarm();
  
  const time = new Date();
  time.setMinutes(time.getMinutes() + 5);

  const snoozeTime = time.toTimeString().split(" ")[0];
  alarms.push(snoozeTime);
  localStorage.setItem(snoozeTime, localStorage.getItem(currentAlarmTime));
  updateAlarmList();
  alert("Snoozed for 5 minutes!");
}

function updateAlarmList() {
  const list = document.getElementById('alarms-list');
  list.innerHTML = "";

  alarms.forEach((time, index) => {
    const li = document.createElement("li");
    li.textContent = time + " ";

    const delBtn = document.createElement("button");
    delBtn.textContent = "Delete";
    delBtn.onclick = () => {
      alarms.splice(index, 1);
      localStorage.removeItem(time);
      updateAlarmList();
    };
    li.appendChild(delBtn);
    list.appendChild(li);
  });
}

// Notification Permission
if ("Notification" in window && Notification.permission !== "granted") {
  Notification.requestPermission();
}

function showNotification(title, body) {
  if ("Notification" in window && Notification.permission === "granted") {
    new Notification(title, { body });
  }
}
