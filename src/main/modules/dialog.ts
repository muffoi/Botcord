import { propIcons } from "./displays";
import { FSStorage } from "./storage";

let dialogElem = elem<HTMLDialogElement>("#dialog");

document.addEventListener("DOMContentLoaded", () => {
    if(dialogElem === null) dialogElem = elem<HTMLDialogElement>("#dialog");
});

export const api = {
    dom: dialogElem,
    errors: {
        DISMISSED: "edismissed"
    },

    open(): void {
        dialogElem.showModal();
        dialogElem.classList.add("show");
    },

    close(): void {
        dialogElem.classList.remove("show");

        setTimeout(() => {
            dialogElem.close();
            dialogElem.classList.remove("small");
        }, theme._dat.tr2);
    },

    toggle(): void {
        if(dialogElem.open) {
            api.close()
        } else api.open();
    },

    addUserModal(dismissible: boolean, storage?: FSStorage): Promise<BaseUserData | never> {
        return new Promise((resolve, reject) => {
            dialogElem.innerHTML = `
            <div class="loginHeader">Log In</div>
            <form id="loginForm" ${prepEvt((evt, form: HTMLFormElement) => {
                    evt.preventDefault();
                    api.close();

                    let data = new FormData(form);

                    resolve({
                        token: data.get("loginToken") as string,
                        presence: (data.get("loginDefaultStatus") == "on")? "invisible": "online"
                    });
                }, "submit")}>
                <label for="loginToken">Bot Token:</label>
                <input type="text" name="loginToken" required="true" placeholder="Your Discord bot account token" ${prepEvt(async (_e, t: HTMLInputElement) => {
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
                                elem<HTMLImageElement>("#loginPfp").src = client.user?.avatarURL({size: 64}) ||
                                    client.user?.defaultAvatarURL || "";
                                
                                elem("#loginName").textContent = client.user?.displayName || "User";
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
                        <input type="checkbox" name="loginDefaultStatus" value="on">
                        Invisible Bot Presence <div class="i info" data-icon="24/info" title="Don't let others see your activity"></div>
                        <div class="checkbox" ${prepEvt((_e, t) => {
                            let value = +(t.getAttribute("data-value") as string);

                            value = value == 0? 1: 0;
                            t.setAttribute("data-value", value + "");

                            let checkbox = t.parentElement!.children[0] as HTMLInputElement;
                            checkbox.checked = !!value;
                        }, "click")}>
                            <div class="checkboxThumb"></div>
                        </div>
                    </div>
                </div>
                    
                <input type="submit" name="loginSubmit" title="Log In" value="Log In" disabled>
            </form>` + (dismissible?
            `<div class="i dismiss" ${prepEvt(() => {
                api.close();
                reject(api.errors.DISMISSED);
            }, "click")} data-icon="24/delete-sign"></div>`: "");
            evt(dialogElem, "close", () => {
                api.close();
                reject(api.errors.DISMISSED);
            })
            propIcons();
            api.open();
        });
    },

    confirm({
        title,
        description,
        options: {main, other, warn, dismissible = true}
    }: {
        title: string,
        description: string,
        options: {
            main?: string,
            other?: string,
            warn?: boolean,
            dismissible?: boolean
        }
    }): Promise<boolean | never> {
        return new Promise((resolve, reject) => {
            dialogElem.classList.add("small");
            let btnMain = `<button class="dialogBtnMain${warn? " warn": ""}" ${prepEvt(() => {
                api.close();
                resolve(true);
            }, "click")}>${main}</button>`, btnOther = `<button class="dialogBtn" ${prepEvt(() => {
                api.close();
                resolve(false);
            }, "click")}>${other}</button>`;
            dialogElem.innerHTML = `
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
                }, "click")} data-icon="24/delete-sign"></div>`:
                ""
            );
            evt(dialogElem, "close", () => {
                api.close();
                reject(api.errors.DISMISSED);
            })
            propIcons();
            api.open();
        });
    },

    newToken(username?: string, storage?: FSStorage): Promise<string | never> {
        return new Promise((resolve, reject) => {
            dialogElem.innerHTML = `
            <div class="loginHeader">Update Token</div>
            <form id="loginForm" ${prepEvt((evt, form: HTMLFormElement) => {
                    evt.preventDefault();
                    api.close();

                    let data = new FormData(form);

                    resolve(data.get("loginToken") as string);
                }, "submit")}>
                <label for="loginToken">Bot Token for <b>'${username || 'User'}'</b>:</label>
                <input type="text" name="loginToken" required="true" placeholder="Your Discord bot account token" ${prepEvt(async (_e, t: HTMLInputElement) => {
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
                                elem<HTMLImageElement>("#loginPfp").src = client.user?.avatarURL({size: 64}) ||
                                                        client.user?.defaultAvatarURL || "";
                                elem("#loginName").textContent = client.user?.displayName || "User";
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
            evt(dialogElem, "close", () => {
                api.close();
                reject(api.errors.DISMISSED);
            })
            propIcons();
            api.open();
        });
    }
}

function ok(id: string): void {
    elem(`#${id}Error`).classList.add("hide");
    elem(`#${id}Form > input[type="submit"]`).removeAttribute("disabled");
}

function invalid(id: string, info: string): void {
    let errorInfoElem = elem(`#${id}Error`);
    errorInfoElem.textContent = info;
    errorInfoElem.classList.remove("hide");
    elem(`#${id}Form > input[type="submit"]`).setAttribute("disabled", "true");
}