module.exports = async() => {
    const fs = require("fs");
    const { join } = require("path");

    let files = fs.readdirSync(__dirname), i = 0;

    for (const name of files) {
        if(name == "subs.js") continue;

        let elem = document.createElement("script");
        document.body.appendChild(elem);
        await new Promise(r => {
            elem.addEventListener("load", () => {
                i++;
                logger.log(`Client sub "${name}" loaded. (${i}/${files.length})`);
                r();
            })
            elem.src = "main/client/" + name;
        });
    }
}