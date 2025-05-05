import { app, BrowserWindow, ipcMain, safeStorage, shell } from "electron";
import { join, relative } from "path";
import { theme } from "./src/theme";
import packageJson from "./package.json";

let win: BrowserWindow;

app.setAppUserModelId("com.muffoi.botcord");

const userDataDirName = app.isPackaged ? packageJson.productName : `${packageJson.productName}_dev`;

app.setPath("userData", join(app.getPath("userData"), "..", userDataDirName))

function createWindow () {
    win = new BrowserWindow({
        webPreferences: {
            nodeIntegration: true,
            sandbox: false,
            contextIsolation: false,
            devTools: !app.isPackaged,
            additionalArguments: [JSON.stringify({
                appData: app.getPath("userData"),
                isPackaged: app.isPackaged
            })]
        },
        autoHideMenuBar: true,
        title: packageJson.productName + " v" + packageJson.version,
        icon: join(__dirname, "resources", "icon.ico"),
        backgroundColor: theme.background
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
                    minimizable: false,
                    backgroundColor: theme.background,
                    icon: join(__dirname, "resources", "icon.ico"),
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

    win.removeMenu();
    if(!app.isPackaged) win.webContents.openDevTools({ mode: "undocked" });

    win.loadFile(join(__dirname, "src", "index.html"));
    /* win.on("unresponsive", ()=>{
        dialog.showErrorBox("Not Responding", "App window has gone unresponsive");
    }) */
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

// app.on("window-all-closed", () => {
//     if (process.platform !== "darwin") {
//         app.quit();
//     }
// })

app.on("window-all-closed", app.quit);