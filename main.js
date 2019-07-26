const {app, BrowserWindow, Tray, Menu} = require('electron');

let win = null;
const path = require('path');
let tray = null;

function createWindow() {

    //const imgPath = path.join(process.resourcesPath, '/OneNote.png');
    //console.log(imgPath);
    let iconPath = null;
    //png format works fine both in windows and linux
    iconPath = "/assets/OneNote.png";
    
    if (process.platform == "win32") {
        iconPath = "/assets/OneNote.ico";
        //console.log("This is win32, img path is", iconPath);
    }

    const imgPath = path.join(__dirname, iconPath);
    
    win = new BrowserWindow({
        width: 800,
        height: 600,
        webPreferences: {
            //Enable webview
            webviewTag: true
        },
        //Auto Hide Menu Bar
        autoHideMenuBar: true,
        icon: imgPath
    });

    win.loadFile('index.html');

    //win.loadURL('file://' + __dirname + '/index.html');

    //Use for Debug render process
    //win.webContents.openDevTools();

    win.on('closed', ()=>{
        win = null;
    });

    win.on('close', (event)=>{
        win.hide();
        win.setSkipTaskbar(true);
        event.preventDefault();
    });

    win.on('show', ()=>{
        tray.setHighlightMode('always');
    });

    win.on('hide', ()=>{
        tray.setHighlightMode('never');
    });

    tray = new Tray(path.join(__dirname, iconPath));
    const contentMenu = Menu.buildFromTemplate([
        {label: 'Show', click: ()=>{win.show();win.setSkipTaskbar(false);}},
        {label: 'Quit', click: ()=>{win.destroy();}} 
    ]);
    tray.setContextMenu(contentMenu);
    tray.setToolTip("OneNote");
    
    //This is not worked in Linux
    //Use it in windows & mac

    //isVisble now is not a function??
    /*
    tray.on('click', ()=>{
        win.isVisble? win.hide(): win.show();
        console.log(win.isVisble);
        win.isVisble? win.setSkipTaskbar(false): win.setSkipTaskbar(true);
    });
    */
    
}

//Only allow one OnNote Electron instance
const gotTheLock = app.requestSingleInstanceLock()

if (!gotTheLock) {
  app.quit();
  return;
}


app.on('ready', createWindow);

app.on('window-all-closed', ()=>{
    if (process.platform !== 'darwin'){
        app.quit();
    }
});

app.on('activate', ()=>{
    if (win === null) {
        createWindow();
    }
});

// OneNote can not work w/ onedrive.live.com in China, let us use IP addr to fix it==