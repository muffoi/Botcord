// Compatibility layer
(() => {
    // Override global `require()` to start in ./main
    const { join } = module.require("path");
    const { createRequire } = module.require("module");
    globalThis.require = createRequire(join(__dirname, "main") + "/");


    // Allow TypeScript output to set `exports.__esModule`
    globalThis.exports = {};


    // Override browser timers by Node.js equivalents
    // for NPM package compatibility
    Object.assign(globalThis, Object.fromEntries(
        Object.entries(require("timers"))
            .filter(([key]) => /^set|clear/.test(key))
    ));
})();

// Global variables
const { Client, Partials, DiscordjsErrorCodes } = require("discord.js");
const dayjs = require("dayjs");

const Botcord = new (require("./modules/botcord").BotcordClient);
const FSStorage = require("./modules/storage").FSStorage;
const dialog = require("./modules/dialog").api;
const popouts = new (require("./modules/popouts").Popouts);
const templates = require("./modules/templates");
const { theme, applyColorVars } = require("../theme");
const { logger, times } = require("./modules/debug");

document.addEventListener("DOMContentLoaded", () => {
    // Clear unloaded image placeholders
    const imgs = document.querySelectorAll("img:not([src])");
    for (const img of imgs) img.src = "../resources/blank.png";

    // Enable CSS hot reload in dev mode by pressing Ctrl + 1
    if(!Botcord.args.isPackaged) {
        const css = document.getElementById("stylesMain");
        const backup = document.createElement("link");
        const href = css.href;

        backup.rel = css.rel;
        backup.href = href;
        document.head.appendChild(backup);

        window.addEventListener("keydown", evt => {
            if(evt.ctrlKey == true && evt.code == "Digit1") {
                css.href = "";
                css.href = href;

                const themeModule = require("../theme");

                window.theme = themeModule.theme;
                window.applyColorVars = themeModule.applyColorVars;

                applyColorVars();

                newScript.src = oldScript.src;
                
                oldScript.remove();
                document.head.appendChild(newScript);

                setTimeout(() => {
                    backup.href = "";
                    backup.href = href;
                }, 150);
            }

            // Enable reloading with Ctrl + R
            if(evt.ctrlKey == true && evt.code == "KeyR") location.reload();
        });
    }

    Object.assign(window, require("./client"));
})

applyColorVars();

dayjs.extend(require("dayjs/plugin/calendar"));