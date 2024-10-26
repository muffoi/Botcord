const { Client } = require("discord.js");

let dialog = elem("#dialog");

const api = {
    dom: dialog,
    errors: {
        DISMISSED: "edismissed"
    },

    open() {
        dialog.showModal();
        dialog.classList.add("show");
    },

    close() {
        dialog.classList.remove("show");

        setTimeout(() => {
            dialog.close();
            dialog.classList.remove("small");
        }, theme._dat.tr2);
    },

    toggle() {
        if(dialog.open) {
            api.close()
        } else api.open();
    },

    addUserModal(dismissible, storage) {
        return new Promise((r, reject) => {
            dialog.innerHTML = `
            <div class="loginHeader">Log In</div>
            <form id="loginForm" ${prepEvt(evt => {
                    evt.preventDefault();
                    api.close();

                    r({
                        token: evt.target[0].value,
                        presence: (evt.target[1].value == "on")? "invisible": "online"
                    });
                }, "submit")}>
                <label for="loginToken">Bot Token:</label>
                <input type="text" name="loginToken" required="true" placeholder="Your Discord bot account token" ${prepEvt(async (_e, t) => {
                    let token = t.value;
                    let valid1 = token.match(/[\w-]{24}\.[\w-]{6}\.[\w-]{27}/);
                    let id = "login";
                
                    if(!valid1) invalid(id, "Please input a valid Discord bot token!");
                    else {
                        try {
                            let client = new Client({
                                intents:[]
                            });
                            client.on("ready", () => {
                                elem("#loginPfp").src = client.user.avatarURL({size: 64}) ||
                                                        client.user.defaultAvatarURL;
                                elem("#loginName").textContent = client.user.displayName;
                                client.destroy();
                            });
                            await client.login(token);
                            if(storage) {
                                if(storage.hasToken(token)) {
                                    invalid(id, "This user is already logged in!");
                                } else ok(id);
                            } else ok(id);
                        } catch(e) {
                            // logger.debug(e);
                            invalid(id, "Please input a valid Discord bot token!");
                        }
                    }
                }, "input")}>
                <div id="loginError" class="hide"></div>

                <div class="loginBox">
                    <div class="popItem standalone static">
                        <div class="pfpBox">
                            <img src="https://cdn.discordapp.com/embed/avatars/1.png" alt="Profile picture" class="pfp" id="loginPfp">
                        </div>
                        <div class="usernameBox">
                            <span class="username" id="loginName">User</span>
                            <span class="status"></span>
                        </div>
                    </div>
            
                    <div class="loginDefaultStatusSetter">
                        <input type="checkbox" name="loginDefaultStatus" value="off">
                        Invisible Bot Presence <div class="i info" data-icon="24/info" title="Don't let others see your activity"></div>
                        <div class="checkbox" ${prepEvt((_e, t) => {
                            let value = +t.getAttribute("data-value");
                            value = value == 0? 1: 0;
                            t.setAttribute("data-value", value);
                            t.parentElement.children[0].value = [ "off", "on" ][value];
                        })}>
                            <div class="checkboxThumb"></div>
                        </div>
                    </div>
                </div>
                    
                <input type="submit" name="loginSubmit" title="Log In" value="Log In" disabled>
            </form>` + (dismissible?
            `<div class="i dismiss" ${prepEvt(() => {
                api.close();
                reject(api.errors.DISMISSED);
            })} data-icon="24/delete-sign"></div>`: "");
            evt(dialog, "close", () => {
                api.close();
                reject(api.errors.DISMISSED);
            })
            propIcons();
            api.open();
        });
    },

    confirm(title, description, {main, other, warn, dismissible = true} = {}) {
        return new Promise((r, reject) => {
            dialog.classList.add("small");
            let btnMain = `<button class="dialogBtnMain${warn? " warn": ""}" ${prepEvt(() => {
                api.close();
                r(true);
            })}>${main}</button>`, btnOther = `<button class="dialogBtn" ${prepEvt(() => {
                api.close();
                r(false);
            })}>${other}</button>`;
            dialog.innerHTML = `
            <div class="dialogHeader">${title}</div>
            <div class="dialogDescription">${description}</div>`
            + (warn?
                (btnOther + btnMain):
                ((main?
                    btnMain:
                    ""
                ) + (other?
                    btnOther:
                    ""
                ))
            )
            + (dismissible?
                `<div class="i dismiss" ${prepEvt(() => {
                    api.close();
                    reject(api.errors.DISMISSED);
                })} data-icon="24/delete-sign"></div>`:
                ""
            );
            evt(dialog, "close", () => {
                api.close();
                reject(api.errors.DISMISSED);
            })
            propIcons();
            api.open();
        });
    },

    newToken(username) {
        return new Promise((r, reject) => {
            dialog.innerHTML = `
            <div class="loginHeader">Update Token</div>
            <form id="loginForm" ${prepEvt(evt => {
                    evt.preventDefault();
                    api.close();

                    r(evt.target[0].value);
                }, "submit")}>
                <label for="loginToken">Bot Token for <b>'${username || 'User'}'</b>:</label>
                <input type="text" name="loginToken" required="true" placeholder="Your Discord bot account token" ${prepEvt(async (_e, t) => {
                    let token = t.value;
                    let valid1 = token.match(/[\w-]{24}\.[\w-]{6}\.[\w-]{27}/);
                    let id = "login";
                
                    if(!valid1) invalid(id, "Please input a valid Discord bot token!");
                    else {
                        try {
                            let client = new Client({
                                intents:[]
                            });
                            client.on("ready", () => {
                                elem("#loginPfp").src = client.user.avatarURL({size: 64}) ||
                                                        client.user.defaultAvatarURL;
                                elem("#loginName").textContent = client.user.displayName;
                                client.destroy();
                            });
                            await client.login(token);
                            if(storage) {
                                if(storage.hasToken(token)) {
                                    invalid(id, "This user is already logged in!");
                                } else ok(id);
                            } else ok(id);
                        } catch(e) {
                            invalid(id, "Please input a valid Discord bot token!");
                        }
                    }
                }, "input")}>
                <div id="loginError" class="hide"></div>

                <div class="popItem standalone static">
                    <div class="pfpBox">
                        <img src="https://cdn.discordapp.com/embed/avatars/1.png" alt="Profile picture" class="pfp" id="loginPfp">
                    </div>
                    <div class="usernameBox">
                        <span class="username" id="loginName">User</span>
                        <span class="status"></span>
                    </div>
                </div>

                <input type="submit" name="loginSubmit" title="Update Token" value="Update" disabled>
            </form>`;
            evt(dialog, "close", () => {
                api.close();
                reject(api.errors.DISMISSED);
            })
            propIcons();
            api.open();
        });
    }
}

function ok(id) {
    elem(`#${id}Error`).classList.add("hide");
    elem(`#${id}Form > input[type="submit"]`).removeAttribute("disabled");
}

function invalid(id, info) {
    let errorInfoElem = elem(`#${id}Error`);
    errorInfoElem.textContent = info;
    errorInfoElem.classList.remove("hide");
    elem(`#${id}Form > input[type="submit"]`).setAttribute("disabled", true);
}

module.exports = api;