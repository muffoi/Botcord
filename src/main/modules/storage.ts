import { ipcRenderer } from "electron";
import fs from "fs";
import { records as recordsPath } from "./fspaths";
import { join } from "path";

const fsAccounts = join(
    recordsPath,
    "accounts"
);

function getFS(): Buffer {
    return fs.readFileSync(fsAccounts);
}

function setFS(buf: Buffer): void {
    fs.writeFileSync(fsAccounts, new Uint8Array(buf.buffer));
}

function sameJSON(o1: object, o2: object): boolean {
    return JSON.stringify(o1) == JSON.stringify(o2);
}

function gotoLogin(store: FSStorage): void {
    setErr(store.errorCodes.noUser, store);
}

function setErr(err: number, store: FSStorage): void {
    store.status = 1;
    store.error = err;
}

function addUser(userData: AnyUserData, store: FSStorage): void {
    store.storage.bots.push(userData);
}

export class FSStorage {
    storage: {
        bots: AnyUserData[]
    };

    status: 0 | 1;
    error: number;
    errorCodes: {
        success: 0,
        noUser: 1
    };

    _private: {
        sameJSON: typeof sameJSON,
        gotoLogin: typeof gotoLogin,
        getFS: typeof getFS,
        setFS: typeof setFS,
        addUser: typeof addUser
    };

    constructor() {
        this.storage = {
            bots: []
        };

        this.status = 0;
        this.error = 0;
        this.errorCodes = {
            success: 0,
            noUser: 1
        };

        this._private = {
            sameJSON,
            gotoLogin,
            getFS,
            setFS,
            addUser
        };
    }

    static async build(bypassLogin = false): Promise<FSStorage> {
        const store = new FSStorage();

        if(!fs.existsSync(recordsPath)) {
            fs.mkdirSync(recordsPath);
        }
    
        if(!bypassLogin) {
            if( !fs.existsSync(fsAccounts) ) {
                setFS(
                    await store.encode(store.plainContent())
                );
                gotoLogin(store);
            } else if(sameJSON(
                await store.decode( getFS() ),
                store.plainContent()
            )) {
                gotoLogin(store);
            }
        }
    
        await store.load();
    
        let user = localStorage.getItem("user");
    
        if(user === null || +user >= store.getUsers().length) localStorage.setItem("user", "0");

        return store;
    }

    get userIndex(): number {
        return +(localStorage.getItem("user")!);
    }

    encode(o: object): Promise<Buffer> {
        return ipcRenderer.invoke(
            "encode",
            JSON.stringify(o)
        )
    }

    async decode(buf: Buffer): Promise<{ bots: AnyUserData[]}> {
        return JSON.parse(
            await ipcRenderer.invoke("decode", buf)
        )
    }

    async load(): Promise<void> {
        this.storage = await this.decode(
            getFS()
        );
    }

    async save(): Promise<void> {
        setFS( await this.encode(this.storage) );
    }

    plainContent(): {bots: []} {
        return {
            bots: []
        }
    }

    setCurrentUser(index = this.userIndex): void {
        let clearIndex = typeof index == "number"? index: this.storage.bots.indexOf(index);

        localStorage.setItem("user", clampNumber(clearIndex, 0, this.storage.bots.length - 1) + "");
    }

    getCurrentUser(index = this.userIndex): UserData {
        return this.storage.bots[index] as UserData;
    }

    getUsers(): AnyUserData[] {
        return this.storage.bots;
    }

    async addUser(userData: AnyUserData): Promise<void> {
        addUser(userData, this);
        await this.save();
    }

    async addUsers(...users: AnyUserData[]): Promise<void> {
        for (let userData of users) {
            addUser(userData, this);
        }
        await this.save();
    }

    async updateUser(index: number, data: UserData, merge: false): Promise<void>
    async updateUser(index: number, data: Partial<UserData>, merge?: true): Promise<void>
    async updateUser(index: number, data: Partial<UserData>, merge: boolean = true): Promise<void> {
        if(merge) {
            for(let prop in data) {
                // @ts-ignore
                this.getUsers()[index][prop] = data[prop];
            }
        } else {
            this.getUsers()[index] = data as AnyUserData;
        }

        await this.save();
    }

    async removeUser(index: number): Promise<void> {
        this.getUsers().splice(index, 1);

        await this.save();
    }

    hasToken(token: string): boolean {
        let users = this.getUsers();

        for(let user of users) {
            if(user.token == token) return true;
        }

        return false;
    }
}