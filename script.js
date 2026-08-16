const display = document.getElementById("display");

const millisecondsDisplay =
    document.getElementById("milliseconds");

const startBtn =
    document.getElementById("startBtn");

const pauseBtn =
    document.getElementById("pauseBtn");

const resetBtn =
    document.getElementById("resetBtn");

const lapBtn =
    document.getElementById("lapBtn");

const lapsList =
    document.getElementById("lapsList");

const emptyMessage =
    document.getElementById("emptyMessage");

const lapCount =
    document.getElementById("lapCount");

const statusText =
    document.getElementById("statusText");

const statusDot =
    document.getElementById("statusDot");



let startTime = 0;

let elapsedTime = 0;

let timer = null;

let isRunning = false;

let lapNumber = 0;

let previousLapTime = 0;

let lapTimes = [];



function formatTime(time) {

    const totalMilliseconds =
        Math.floor(time);

    const milliseconds =
        totalMilliseconds % 1000;

    const totalSeconds =
        Math.floor(
            totalMilliseconds / 1000
        );

    const seconds =
        totalSeconds % 60;

    const totalMinutes =
        Math.floor(
            totalSeconds / 60
        );

    const minutes =
        totalMinutes % 60;

    const hours =
        Math.floor(
            totalMinutes / 60
        );


    return {

        hours:
            String(hours).padStart(2, "0"),

        minutes:
            String(minutes).padStart(2, "0"),

        seconds:
            String(seconds).padStart(2, "0"),

        milliseconds:
            String(milliseconds).padStart(3, "0")
    };
}



function updateDisplay() {

    const currentTime =
        performance.now();

    const currentElapsed =
        elapsedTime +
        (currentTime - startTime);


    const time =
        formatTime(currentElapsed);


    display.textContent =
        `${time.hours}:${time.minutes}:${time.seconds}`;


    millisecondsDisplay.textContent =
        `.${time.milliseconds}`;
}



function startStopwatch() {

    if (isRunning) {
        return;
    }


    isRunning = true;


    startTime =
        performance.now();


    timer =
        setInterval(
            updateDisplay,
            10
        );



    startBtn.disabled = true;

    pauseBtn.disabled = false;

    lapBtn.disabled = false;



    statusText.textContent =
        "RUNNING";

    statusDot.classList.remove(
        "paused"
    );

    statusDot.classList.add(
        "running"
    );
}



function pauseStopwatch() {

    if (!isRunning) {
        return;
    }


    isRunning = false;


    elapsedTime +=
        performance.now() -
        startTime;


    clearInterval(timer);


    updateDisplay();



    startBtn.disabled = false;

    pauseBtn.disabled = true;



    statusText.textContent =
        "PAUSED";

    statusDot.classList.remove(
        "running"
    );

    statusDot.classList.add(
        "paused"
    );
}



function resetStopwatch() {

    clearInterval(timer);


    isRunning = false;

    startTime = 0;

    elapsedTime = 0;

    lapNumber = 0;

    previousLapTime = 0;

    lapTimes = [];



    display.textContent =
        "00:00:00";

    millisecondsDisplay.textContent =
        ".000";



    lapsList.innerHTML = "";


    emptyMessage.style.display =
        "block";


    updateLapCount();



    startBtn.disabled = false;

    pauseBtn.disabled = true;

    lapBtn.disabled = true;



    statusText.textContent =
        "READY";

    statusDot.classList.remove(
        "running",
        "paused"
    );
}



function recordLap() {

    if (!isRunning) {
        return;
    }


    const currentTime =
        elapsedTime +
        (performance.now() - startTime);


    const currentLapTime =
        currentTime -
        previousLapTime;


    previousLapTime =
        currentTime;


    lapNumber++;


    lapTimes.push({

        number:
            lapNumber,

        time:
            currentLapTime
    });


    emptyMessage.style.display =
        "none";


    createLapElement();


    updateLapCount();

}



function createLapElement() {

    lapsList.innerHTML = "";



    const reversedLaps =
        [...lapTimes].reverse();


    reversedLaps.forEach(
        function (lap) {

            const li =
                document.createElement("li");


            li.className =
                "lap-item";


            li.innerHTML = `

                <span class="lap-number">
                    LAP ${String(lap.number).padStart(2, "0")}
                </span>

                <span class="lap-time">
                    ${formatLapTime(lap.time)}
                </span>

            `;


            lapsList.appendChild(li);
        }
    );


    highlightFastestLap();

}



function formatLapTime(time) {

    const formatted =
        formatTime(time);


    return `${formatted.minutes}:${formatted.seconds}.${formatted.milliseconds}`;
}



function updateLapCount() {

    lapCount.textContent =
        `${lapTimes.length} ${
            lapTimes.length === 1
            ? "Lap"
            : "Laps"
        }`;
}



function highlightFastestLap() {

    const items =
        document.querySelectorAll(
            ".lap-item"
        );


    items.forEach(
        function (item) {

            item.classList.remove(
                "fastest",
                "slowest"
            );
        }
    );


    if (lapTimes.length < 2) {
        return;
    }


    let fastest =
        lapTimes[0];

    let slowest =
        lapTimes[0];


    lapTimes.forEach(
        function (lap) {

            if (
                lap.time <
                fastest.time
            ) {

                fastest = lap;
            }


            if (
                lap.time >
                slowest.time
            ) {

                slowest = lap;
            }

        }
    );


    items.forEach(
        function (item) {

            const number =
                parseInt(
                    item
                        .querySelector(
                            ".lap-number"
                        )
                        .textContent
                        .replace("LAP", "")
                );


            if (
                number === fastest.number
            ) {

                item.classList.add(
                    "fastest"
                );
            }


            if (
                number === slowest.number
            ) {

                item.classList.add(
                    "slowest"
                );
            }

        }
    );
}



startBtn.addEventListener(
    "click",
    startStopwatch
);


pauseBtn.addEventListener(
    "click",
    pauseStopwatch
);


resetBtn.addEventListener(
    "click",
    resetStopwatch
);


lapBtn.addEventListener(
    "click",
    recordLap
);



document.addEventListener(
    "keydown",
    function (event) {


        if (
            event.code === "Space"
        ) {

            event.preventDefault();


            if (isRunning) {

                pauseStopwatch();

            } else {

                startStopwatch();

            }
        }



        if (
            event.key.toLowerCase() === "l"
        ) {

            recordLap();
        }



        if (
            event.key.toLowerCase() === "r"
        ) {

            resetStopwatch();
        }

    }
);



resetStopwatch();