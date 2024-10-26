const { ipcRenderer } = require("electron");
const fs = require("fs");
const { records } = require("./fspaths");
const { join } = require("path");
const fsAccounts = join(
    records,
    "accounts"
);

function getFS() {
    return fs.readFileSync(fsAccounts);
}

function setFS(buf) {
    fs.writeFileSync(fsAccounts, buf);
}

function sameJSON(o1, o2) {
    return JSON.stringify(o1) == JSON.stringify(o2);
}

function gotoLogin() {
    setErr(api.errorCodes.noUser);
}

function setErr(err) {
    api.status = 1;
    api.error = err;
}

function addUser(userData) {
    api.storage.bots.push(userData);
}

const api = {
    storage: {},
    get userIndex() {
        return +localStorage.getItem("user");
    },
    status: 0,
    error: 0,
    errorCodes: {
        success: 0,
        noUser: 1
    },

    encode(o) {
        return ipcRenderer.invoke(
            "encode",
            JSON.stringify(o)
        )
    },

    async decode(buf) {
        return JSON.parse(
            await ipcRenderer.invoke("decode", buf)
        )
    },

    async load() {
        this.storage = await this.decode(
            getFS()
        );
        return this.storage;
    },

    async save() {
        setFS( await this.encode(this.storage) );
    },

    plainContent() {
        return {
            bots: []
        }
    },

    setCurrentUser(i = this.userIndex) {
        let index = typeof i == "number"? i: this.storage.bots.indexOf(i);

        localStorage.setItem("user", clampNumber(index, 0, this.storage.bots.length-1));
    },

    getCurrentUser(i = this.userIndex) {
        return this.storage.bots[i];
    },

    getUsers() {
        return this.storage.bots;
    },

    async addUser(userData) {
        addUser(userData);
        await api.save();
    },

    async addUsers(...users) {
        for (let userData of users) {
            addUser(userData);
        }
        await api.save();
    },

    async updateUser(index, data, merge = true) {
        
        if(merge) {
            for(let prop in data) {
                this.getUsers()[index][prop] = data[prop];
            }
        } else {
            this.getUsers()[index] = data;
        }

        await api.save();
    },

    async removeUser(index) {
        this.getUsers().splice(index, 1);

        await api.save();
    },

    hasToken(token) {
        let users = api.getUsers();

        for(let user of users) {
            if(user.token == token) return true;
        }

        return false;
    },

    _private: {
        sameJSON,
        gotoLogin,
        getFS,
        setFS,
        addUser
    }
};

module.exports = async (bypassLogin = false) => {

    if(!fs.existsSync(records)) {
        fs.mkdirSync(records);
    }

    let plainContent = api.plainContent();

    if(!bypassLogin) {
        if( !fs.existsSync(fsAccounts) ) {
            setFS( await api.encode(plainContent) );
            gotoLogin();
        } else if( sameJSON(
            await api.decode( getFS() ),
            plainContent
        )) {
            gotoLogin();
        }
    }

    await api.load();

    let u = localStorage.getItem("user");

    if(u === null || +u >= api.getUsers().length) localStorage.setItem("user", 0);

    return api;

}