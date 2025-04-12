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

dayjs.extend(require("dayjs/plugin/calendar"));