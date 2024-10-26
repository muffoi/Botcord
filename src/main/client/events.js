const fs = require("fs");
const path = require("path");

const initClientEvents = () => {
    let files = fs.readdirSync(path.join(__dirname, "main", "events"));

    for (const file of files) {
        client.on(path.basename(file, ".js"), require("./main/events/" + file));
    }
}