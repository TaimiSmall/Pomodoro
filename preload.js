const { contextBridge, ipcRenderer } = require("electron");

contextBridge.exposeInMainWorld("electron", {
  navigateToTimer: (workTime, breakTime, workSessions) =>
    ipcRenderer.send("navigate-to-timer", {
      workTime,
      breakTime,
      workSessions,
    }),
  onTimerSettings: (callback) => ipcRenderer.on("timer-settings", callback),
  minimize: () => ipcRenderer.send("minimize-window"),
  close: () => ipcRenderer.send("close-window"),
});
