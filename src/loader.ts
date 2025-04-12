interface Times {
    startTimestamp: number,
    loader: number | null,
    client: number | null,
    login: number | null,
    finish: number | null,
    stamp(key: "loader" | "client" | "finish" | "login"): void
}

const times: Times = {
    startTimestamp: Math.round( performance.now() ),
    
    loader: null,
    client: null,
    login: null,
    finish: null,

    stamp(key: "loader" | "client" | "finish" | "login") {
        this[key] = Math.round( performance.now() - this.startTimestamp );
    }
}

const logger = {
    _log(level: "log" | "warn" | "error" | "info", args: any[]): void {
        console[level](...args);
    },

    log(...args: any[]) {
        this._log("log", args);
    },

    warn(...args: any[]) {
        this._log("warn", args);
    },

    error(...args: any[]) {
        this._log("error", args);
    },

    debug(...args: any[]) {
        this._log("info", args);
    },

    report(message: string, {constr, cause}: {constr?: { new(): object }, cause?: any}): never {
        if(cause) this.error(cause);
        throw new (constr || Error)(message, {cause});
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
    let promises: Promise<void>[] = [];

    for (const name of scripts) {
        let elem = doc.createElement("script");

        doc.body.appendChild(elem);
        promises.push(new Promise(resolve => {
            elem.addEventListener("load", () => {
                i++;
                logger.log(`Script "${name + ".js"}" loaded. (${i}/${scripts.length})`);
                resolve();
            })
            elem.src = `main/${name}.js`;
        }));
    }

    await Promise.all(promises);

    times.stamp("loader");
})(document);