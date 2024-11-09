//#region Events

const fs = require("fs");
const path = require("path");

module.exports = () => {
    let files = fs.readdirSync(path.join(__dirname, "..", "events"));

    for (const file of files) {
        Botcord.client.on(path.basename(file, ".js"), require("../events/" + file));
    }
}

//#endregion
