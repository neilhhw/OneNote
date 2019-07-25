const {app, BrowserWindow, Tray, Menu} = require('electron');

let win;
const path = require('path');
let tray = null;

function createWindow() {

    //const imgPath = path.join(process.resourcesPath, '/OneNote.png');
    //console.log(imgPath);
    const imgPath = path.join(__dirname, "/assets/OneNote.png")
    
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

    win.webContents.openDevTools();

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

    tray = new Tray(path.join(__dirname, '/assets/OneNote.png'));
    const contentMenu = Menu.buildFromTemplate([
        {label: 'Show', click: ()=>{win.show()}},
        {label: 'Quit', click: ()=>{win.destroy()}} 
    ]);
    tray.setContextMenu(contentMenu);
    tray.setToolTip("OneNote");
    
    //This is not worked in Linux
    /*
    tray.on('click', ()=>{
        win.isVisble()? win.hide(): win.show();
        console.log(win.isVisble());
        win.isVisble()? win.setSkipTaskbar(false): win.setSkipTaskbar(true);
    });
    */
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

