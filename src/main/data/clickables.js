const { newUser } = require("../modules/clientApps");
const { fillBCM, propIcons } = require("../modules/displays");
let creditsWin;

const clickables = {
    btnSwitch: () => {
        let popMain = elem("#profilePopout"), pop = elem("#profilePopoutFill");

        if(popouts.toggle(popMain)) {

            pop.innerHTML = "";
            let users = Botcord.storage.getUsers(), empty = true, i = 0;
            for (const user of users) {
                // if(user.token == Botcord.storage.getCurrentUser().token) continue;
                let opt = mkelem("div", "popItem"), index = i;
                empty = false;

                opt.innerHTML = `
                <div class="pfpBox">
                    <img src="${user.avatar || "https://cdn.discordapp.com/embed/avatars/1.png"}" alt="Profile picture" class="pfp">
                </div>

                <div class="usernameBox">
                    <span class="username">${user.username || "User"}</span>
                    <span class="status"></span>
                </div>
                
                <div class="delBotBtn i" data-icon="24/waste" title="Remove Account" ${prepEvt(async (e) => {
                    e.stopPropagation();
                    let confirmed;
                    try{
                        confirmed = await dialog.confirm(...templates.confirms.REMOVE_ACCOUNT(user, index))
                    } catch(e) {
                        if(e == dialog.errors.DISMISSED) {
                            logger.log(`Account deletion cancelled.`);
                            return;
                        } else throw e;
                    }

                    if(confirmed) {
                        await Botcord.storage.removeUser(index);
                        if(index === Botcord.storage.userIndex) location.reload();
                        
                        let el = elem("#btnSwitch");
                        el.click();
                        el.click();
                    } else {
                        logger.log(`Account deletion cancelled.`);
                    }
                })}></div>`;

                evt(opt, "click", () => {
                    Botcord.storage.setCurrentUser(index);
                    location.reload();
                });

                pop.appendChild(opt);
                i++;
            }

            let addUserBtn = elem(".popItem#addUser");
            if(Botcord.logs.elements) logger.log(`Add User button:`, addUserBtn);
            if(empty) addUserBtn.classList.add("standalone");
                else addUserBtn.classList.remove("standalone");

            propIcons();
        }
    },

    addUser: () => {
        clickables.btnSwitch();
        newUser(true);
    },

    infoProfile: async () => {
        let el = elem("#botClientMenu");
        if(popouts.toggle(el)) {
            elem("#bcmStatusSetter").classList.remove("open");
            await fillBCM();
        }
    },

    bcmStatusPicker: function() {
        this.children[1].classList.toggle("open");
    },

    bcmStatusOnline: () => {
        setStatus("online");
    },

    bcmStatusIdle: () => {
        setStatus("idle");
    },

    bcmStatusDnd: () => {
        setStatus("dnd");
    },

    bcmStatusInvis: () => {
        setStatus("invisible");
    },

    credits: () => {
        if(creditsWin?.closed) {
            creditsWin = null;
        }

        if(creditsWin) {
            creditsWin.close();
            creditsWin = null;
        } else {
            creditsWin = open("info.html", "", "autoHideMenuBar=true,titleBarStyle=hidden,width=420,height=340");
        }
    }
}

module.exports = clickables;