window.addEventListener("DOMContentLoaded", () => {
  document.getElementById("start-button").addEventListener("click", () => {
    const workTime = document.getElementById("work-time").value;
    const breakTime = document.getElementById("break-time").value;
    const workSessions = document.getElementById("work-sessions").value;

    window.electron.navigateToTimer(workTime, breakTime, workSessions);
  });

  document.getElementById("minimize-btn").addEventListener("click", () => {
    window.electron.minimize();
  });

  document.getElementById("close-btn").addEventListener("click", () => {
    window.electron.close();
  });
});
