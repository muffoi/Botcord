const { join } = require("path");

let arg = (() => {
    try {
        let argv = process.argv;
        let dataLength = +argv[argv.length-2];
        if(isNaN(dataLength) || dataLength == 0) {
            throw new Error("Couldn't separate argv data out of 'process.argv'. Length: " + dataLength);
        }
        return argv.slice(-2 - dataLength, -2);
    } catch(e) {
        logger.report(`FSPaths module failed loading`, {cause: e});
    }
})();

module.exports = {
    appdata: arg[0],
    records: join(
        arg[0],
        "records"
    )
}