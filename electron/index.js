const { app, BrowserWindow, Menu, ipcMain, dialog, ipcRenderer } = require('electron');
const fs = require('fs');
const isDevMode = require('electron-is-dev');
const { CapacitorSplashScreen, configCapacitor } = require('@capacitor/electron');

const path = require('path');

// Place holders for our windows so they don't get garbage collected.
let mainWindow = null;

// Placeholder for SplashScreen ref
let splashScreen = null;

//Change this if you do not wish to have a splash screen
let useSplashScreen = false;

// Create simple menu for easy devtools access, and for demo
const menuTemplateDev = [
  {
    label: 'Options',
    submenu: [
      {
        label: 'Open Dev Tools',
        click() {
          mainWindow.openDevTools();
        },
      },
    ],
  },
];

const nativeImage = require('electron').nativeImage;
var image = nativeImage.createFromPath(__dirname + '/src/assets/icon/favicon_invert.ico');

async function createWindow() {
  // Define our main window size
  mainWindow = new BrowserWindow({
    height: 920,
    width: 1600,
    minWidth: 640,
    minHeight: 360,
    show: false,
    //icon: __dirname + '/src/assets/icon/favicon_invert.ico',
    webPreferences: {
      nodeIntegration: true,
      preload: path.join(__dirname, 'node_modules', '@capacitor', 'electron', 'dist', 'electron-bridge.js')
    }
  });

  configCapacitor(mainWindow);

  if (isDevMode) {
    // Set our above template to the Menu Object if we are in development mode, dont want users having the devtools.
    Menu.setApplicationMenu(Menu.buildFromTemplate(menuTemplateDev));
    // If we are developers we might as well open the devtools by default.
    mainWindow.webContents.openDevTools();
  } else {
    Menu.setApplicationMenu(null);
  }

  if (useSplashScreen) {
    splashScreen = new CapacitorSplashScreen(mainWindow);
    splashScreen.init();
  } else {
    mainWindow.loadURL(`file://${__dirname}/app/index.html`);
    mainWindow.webContents.on('dom-ready', () => {
      mainWindow.show();
    });
  }

}

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some Electron APIs can only be used after this event occurs.
app.on('ready', createWindow);

app.on('open-file', (event, path) => {
  console.log(path);
});

// Quit when all windows are closed.
app.on('window-all-closed', function () {
  // On OS X it is common for applications and their menu bar
  // to stay active until the user quits explicitly with Cmd + Q
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

app.on('activate', function () {
  // On OS X it's common to re-create a window in the app when the
  // dock icon is clicked and there are no other windows open.
  if (mainWindow === null) {
    createWindow();
  }
});

// Define any IPC or other custom functionality below here
// read the file and send data to the render process
ipcMain.on('get-file-data', function(event) {
  var data = null
  if (process.platform == 'win32' && process.argv.length >= 2) {
    var openFilePath = process.argv[1]
    data = openFilePath
  }
  event.returnValue = data
})


ipcMain.on('save-file', async function(event,json,path = undefined,defaultName = '') {

  let success = false;
  let canceled = false;
  if (path === undefined){
    const { filePath, cancel } = await dialog.showSaveDialog({
      defaultPath: defaultName,
      filters : [{ name: 'In18 project', extensions: ['in18'] }]
      
    });
    path = filePath;
    canceled = cancel;
  }
  

  if (path && !canceled) {
    
    fs.writeFile(path, json, (err) => {
      if (!err) throw err;
      success = true
    });
  }

  event.reply('save-file', path, !canceled)
});

ipcMain.on('load-file', async function(event, path = '', noExplorer = false){
  let canceled = false;
  if (!noExplorer){
    const data = await dialog.showOpenDialog({
      defaultPath: path,
      filters : [{ name: 'In18 project', extensions: ['in18'] }]
      
    });
    path = data.filePaths[0]
    canceled = data.canceled
  }
  
  
  const file = fs.readFileSync(path, {encoding:'utf8', flag:'r'}); 
 event.reply('load-file', path, file, !canceled)
});
