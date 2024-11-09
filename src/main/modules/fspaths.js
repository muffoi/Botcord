const { join } = require("path");

module.exports = {
    // appdata: Botcord.args.appData,
    records: join(
        Botcord.args.appData,
        "records"
    )
}