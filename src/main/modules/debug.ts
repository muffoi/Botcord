interface Times {
    startTimestamp: number,
    loader: number | null,
    client: number | null,
    login: number | null,
    finish: number | null,
    stamp(key: "loader" | "client" | "finish" | "login"): void
}

export const times: Times = {
    startTimestamp: Math.round( performance.now() ),
    
    loader: null,
    client: null,
    login: null,
    finish: null,

    stamp(key: "loader" | "client" | "finish" | "login") {
        this[key] = Math.round( performance.now() - this.startTimestamp );
    }
}

export const logger = {
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

    debug(level: keyof typeof Botcord.debug, ...args: any[]) {
        if(Botcord.args.isPackaged || !Botcord.debug[level]) return;

        this._log("info", args);
    },

    report(message: string, {constr, cause}: {constr?: { new(): object }, cause?: any}): never {
        throw new (constr || Error)(message, {cause});
    }
};