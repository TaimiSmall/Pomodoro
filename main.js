const { app, BrowserWindow, ipcMain } = require("electron");
const path = require("path");

let mainWindow;

const createWindow = () => {
  mainWindow = new BrowserWindow({
    width: 350,
    height: 300,
    frame: false,
    webPreferences: {
      preload: path.join(__dirname, "preload.js"),
      contextIsolation: true,
    },
  });

  mainWindow.setAlwaysOnTop(true);

  mainWindow.loadFile("start-page.html");
};

app.whenReady().then(() => {
  createWindow();
});

ipcMain.on('navigate-to-timer', (event, settings) => {
  mainWindow.loadFile('timer-page.html');
  mainWindow.setSize(350, 175); // Resize window when navigating to timer-page.html

  mainWindow.webContents.once('did-finish-load', () => {
    mainWindow.webContents.send('timer-settings', settings);
  });
});


ipcMain.on("minimize-window", () => {
  mainWindow.minimize();
});

ipcMain.on("close-window", () => {
  mainWindow.close();
});

app.on("window-all-closed", () => {
  if (process.platform !== "darwin") {
    app.quit();
  }
});
