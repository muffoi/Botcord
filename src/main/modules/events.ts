import fs from "fs";
import path from "path";

export function initializeClientEvents() {
    let files = fs.readdirSync(path.join(__dirname, "..", "events"));

    for (const file of files) {
        if(path.extname(file) !== ".js") continue;
        Botcord.client?.on(path.basename(file, ".js"), require("../events/" + file).handleEvent);
    }
}
