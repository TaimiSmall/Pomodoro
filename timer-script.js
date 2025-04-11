window.addEventListener("DOMContentLoaded", () => {
  const timerContainer = document.getElementById("timer-container");
  const timerText = document.getElementById("timer-text");
  const timerHeading = document.getElementById("timer-heading");
  const timerProgress = document.getElementById("timer-progress");
  const pausePlayBtn = document.getElementById("pause-play-btn");

  console.log("DOMContentLoaded - script initialized");

  document.getElementById("minimize-btn").addEventListener("click", () => {
    window.electron.minimize();
  });

  document.getElementById("close-btn").addEventListener("click", () => {
    window.electron.close();
  });

  let isPaused = false;
  let currentSession = 0;
  let timer, intervalId;

  // Function to create progress bar items
  const createProgressItems = (workSessions) => {
    for (let i = 0; i < workSessions * 2; i++) {
      const isWorkSession = i % 2 === 0;
      const progressItem = document.createElement("div");
      progressItem.classList.add("progress-item");
      progressItem.classList.add(
        isWorkSession ? "work-session-unsaturated" : "break-session-unsaturated"
      );
      if (i == 0) progressItem.classList.add("active-session");
      timerProgress.appendChild(progressItem);
    }
  };

  // Start timer and update progress
  const startTimer = (duration, isWorkSession) => {
    timer = duration;

    intervalId = setInterval(() => {
      if (!isPaused) {
        const minutes = Math.floor(timer / 60);
        const seconds = timer % 60;
        timerText.textContent = `${String(minutes).padStart(2, "0")}:${String(
          seconds
        ).padStart(2, "0")}`;

        if (--timer < 0) {
          clearInterval(intervalId);
          const progressItems =
            timerProgress.querySelectorAll(".progress-item");
          if (progressItems[currentSession]) {
            progressItems[currentSession].classList.remove(
              "active-session",
              isWorkSession
                ? "work-session-unsaturated"
                : "break-session-unsaturated"
            );
            progressItems[currentSession].classList.add(
              isWorkSession
                ? "work-session-saturated"
                : "break-session-saturated"
            );
          }
          if (progressItems[currentSession + 1]) {
            progressItems[currentSession + 1].classList.add("active-session");
          }
          currentSession++;
          updateSession();
        }
      }
    }, 1000);
  };

  // Update session
  const updateSession = () => {
    if (currentSession < timerSettings.workSessions * 2) {
      const isWorkSession = currentSession % 2 === 0;
      if (isWorkSession) {
        timerHeading.textContent = "Work Section";
        startTimer(timerSettings.workTime * 60, true);
      } else {
        timerHeading.textContent = "Break Section";
        startTimer(timerSettings.breakTime * 60, false);
      }
    } else {
      timerHeading.textContent = "Completed";
      timerText.textContent = "All sessions completed!";
    }
  };

  pausePlayBtn.addEventListener("click", () => {
    isPaused = !isPaused;
    pausePlayBtn.style.backgroundImage = isPaused
      ? "url('./assets/play.png')"
      : "url('./assets/pause.png')";
  });

  window.electron.onTimerSettings((event, settings) => {
    timerSettings = settings;
    createProgressItems(timerSettings.workSessions);
    updateSession();
  });
});
