const { join } = module.require("path");
const { createRequire } = module.require("module");
global.require = createRequire(join(__dirname, "main") + "/");
// global.require = id => {
//     if(id.match(/^\.+\//)) return module.require(
//         resolve(__dirname, "main", id)
//     );
//     return module.require(id);
// }

const times = {
    startTimestamp: Math.round( performance.now() ),
    loader: null,
    client: null,
    login: null,
    finish: null,
    /**
     * @param {"loader"|"client"|"login"|"finish"} key 
     */
    stamp(key) {
        this[key] = Math.round( performance.now() - this.startTimestamp );
    }
}, logger = {
    _log(level, args) {
        console[level](...args);
    },

    log(...args) {
        this._log("log", args);
    },

    warn(...args) {
        this._log("warn", args);
    },

    error(...args) {
        this._log("error", args);
    },

    debug(...args) {
        this._log("info", args);
    },

    report(message, {constr, cause} = {}) {
        if(cause) this.error(cause);
        throw new (constr || Error)(message, cause? {cause}: null);
    }
};

(async function(doc) {
    const scripts = [
        // "helpers",
        "imgFixer",
        "client",
        "quickDev"
    ];
    
    let i = 0;

    for (const name of scripts) {
        let elem = doc.createElement("script");

        doc.body.appendChild(elem);
        await new Promise(r => {
            elem.addEventListener("load", () => {
                i++;
                logger.log(`Script "${name + ".js"}" loaded. (${i}/${scripts.length})`);
                r();
            })
            elem.src = `main/${name}.js`;
        });
    }

    times.stamp("loader");
})(document);