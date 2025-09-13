const startBtn = document.querySelector("#startBtn");
const stopBtn = document.querySelector("#stopBtn");
const resetBtn = document.querySelector("#resetBtn");
const stopperBtn = document.querySelector("#stopperBtn");
const timerBtn = document.querySelector("#timerBtn");
var timerText = document.querySelector("#timer_text");

setInterval(() => {
    const date = new Date();
    formattedDate = `${date.getMonth() + 1}/${date.getDate()}/${date.getFullYear()} - ${date.getHours()}:${date.getMinutes()}:${date.getSeconds()}`;
    const dateText = document.getElementById("date");
    if (dateText) {
        dateText.innerHTML = formattedDate;
    }
}, 1000);



let mode = "stopper"; // or "timer"
let interval = null;
let stop = false;
let hours = 0; // hours
let minutes = 0; // minutes
let seconds = 0; // seconds

const clockAlarmSound = new Audio('./resources/clock-alarm.wav');

let timerPanel = document.querySelector("#timerPanel");
const timerHTML = `
    <div class="container mt-4 pb-5">
        <div class="card text-center mx-auto border border-primary" style="max-width: 400px;">
            <div class="card-header bg-dark text-white border-bottom border-primary">
                Timer
            </div>
            <div class="card-body bg-dark text-white">
                <div class="d-flex justify-content-center gap-3">
                    <div>
                        <label for="hours" class="form-label">Hour</label>
                        <input type="number" class="form-control bg-secondary text-white" id="hours" min="0" max="23" value="0">
                    </div>
                    <div>
                        <label for="minutes" class="form-label">Minute</label>
                        <input type="number" class="form-control bg-secondary text-white" id="minutes" min="0" max="59" value="0">
                    </div>
                    <div>
                        <label for="seconds" class="form-label">Second</label>
                        <input type="number" class="form-control bg-secondary text-white" id="seconds" min="0" max="59" value="0">
                    </div>
                </div>
            </div>
    </div>
`;

stopperBtn.addEventListener("click", () => { mode = "stopper"; resetTime(); updateDisplay(); timerPanel.innerHTML = ""; });
timerBtn.addEventListener("click", () => {
    mode = "timer";
    
    timerPanel.innerHTML = timerHTML;

    const hoursInput = document.getElementById("hours");
    const minutesInput = document.getElementById("minutes");
    const secondInput = document.getElementById("seconds");

    hours = parseInt(hoursInput.value);
    minutes = parseInt(minutesInput.value);
    seconds = parseInt(secondInput.value);

    // Korlátozások alkalmazása
    clampInput(hoursInput, 0, 23);
    clampInput(minutesInput, 0, 59);
    clampInput(secondInput, 0, 59);

    updateDisplay();
});

startBtn.addEventListener("click", () => {
    if (interval) return;

    if (mode === "timer" && stop === false) {
        const hoursInput = document.getElementById("hours");
        const minutesInput = document.getElementById("minutes");
        const secondsInput = document.getElementById("seconds");

        hours = parseInt(hoursInput.value) || 0;
        minutes = parseInt(minutesInput.value) || 0;
        seconds = parseInt(secondsInput.value) || 0;

        updateDisplay();
    }

    stop = false;
    

    interval = setInterval(() => {
        if (mode === "stopper") {
            incrementTime();
        } else if (mode === "timer") {
            decrementTime();
        } else {
            return;
        } 
        updateDisplay();
    }, 1000);
});

stopBtn.addEventListener("click", () => {
    clearInterval(interval);
    interval = null;
    stop = true;
});

resetBtn.addEventListener("click", () => {
    clearInterval(interval);
    interval = null;
    resetTime();
    updateDisplay();
});

const resetTime = () => {
    hours = 0;
    minutes = 0;
    seconds = 0;
    stop = false;
};

const incrementTime = () => {
    seconds++;
    if (seconds >= 60) {
        seconds = 0;
        minutes++;
        if (minutes >= 60) {
            minutes = 0;
            hours++;
        }
    }
};

const decrementTime = () => {
    if (hours === 0 && minutes === 0 && seconds === 0) {
        clearInterval(interval);
        interval = null;
        clockAlarmSound.play();
        alert("Timer finished!");
        return;
    }

    if (seconds === 0) {
        if (minutes === 0) {
            if (hours > 0) {
                hours--;
                minutes = 59;
                seconds = 59;
            }
        } else {
            minutes--;
            seconds = 59;
        }
    } else {
        seconds--;
    }
    updateDisplay();
};

const updateDisplay = () => {
    const h = String(hours).padStart(2, "0");
    const m = String(minutes).padStart(2, "0");
    const s = String(seconds).padStart(2, "0");
    timerText.textContent = `${h}:${m}:${s}`;
};

function clampInput(input, min, max) {
    input.addEventListener("input", () => {
        let val = parseInt(input.value);
        if (isNaN(val)) val = 0;
        if (val > max) input.value = max;
        if (val < min) input.value = min;
    });
};




