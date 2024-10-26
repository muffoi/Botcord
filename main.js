const { app, BrowserWindow, ipcMain, safeStorage, shell } = require("electron");
const { join, relative } = require("path");
const { background } = require("./src/theme");

let win, package = require("./package.json");

function createWindow () {
    win = new BrowserWindow({
        webPreferences: {
            nodeIntegration:!0,
            sandbox:!1,
            contextIsolation:!1,
            devTools:!app.isPackaged || true,
            additionalArguments: encodeArgs( app.getPath("userData") )
        },
        autoHideMenuBar: true,
        title: package.productName + " v" + package.version,
        icon: join(__dirname, "resources", "icon.ico")
    })

    let allowed = [
        "src\\info.html"
    ]

    win.webContents.setWindowOpenHandler(({url}) => {
        if(allowed.includes(
            relative(
                __dirname,
                url.match(/^file:\/\/\/(.*)/)?.[1] || ""
            )
        )) {
            return {
                action: "allow",
                overrideBrowserWindowOptions: {
                    titleBarStyle: "default",
                    fullscreenable: false,
                    resizable: false,
                    autoHideMenuBar: true,
                    maximizable: false,
                    minimizable:false,
                    backgroundColor: background,
                    icon: join(__dirname, "resources", "icon-sm.ico"),
                    webPreferences: {
                        devTools: !app.isPackaged
                    }
                }
            }
        } else {
            shell.openExternal(url);
            return {
                action: "deny"
            }
        }
    });

    win.webContents.on("did-create-window", (window) => {
        window.webContents.setWindowOpenHandler(({url}) => {
            shell.openExternal(url);
            return {
                action: "deny"
            }
        })
    });

    win.loadFile(join(__dirname, "src", "index.html"));
    /* win.on("unresponsive", ()=>{
        dialog.showErrorBox("Not Responding", "App window has gone unresponsive");
    }) */
}

function encodeArgs(...args) {
    return [...args, args.length + ""];
}

app.whenReady().then(() => {
    createWindow();

    ipcMain.handle("encode", (_e, data) => {
        return safeStorage.encryptString(data);
    })

    ipcMain.handle("decode", (_e, data) => {
        return safeStorage.decryptString(data);
    })

    ipcMain.on("restartWindow", () => {
        win.close();
        createWindow();
    });

    app.on("activate", () => {
        if (BrowserWindow.getAllWindows().length === 0) {
            createWindow();
        }
    })
})

app.on("window-all-closed", () => {
    if (process.platform !== "darwin") {
        app.quit();
    }
})

