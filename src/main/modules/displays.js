const Vibrant = require("node-vibrant");
const { color } = require("./utils");

function displayPresence() {
    let translations = {
        online: "Online",
        idle: "Idle",
        dnd: "Do Not Disturb",
        invisible: "Invisible"
    }

    let readable = translations[Botcord.client.presence.status];
    let statusIcon = `../resources/status${readable.replace(/\s/g, "")}.svg`;

    elem("#status").textContent = readable;
    elem("#bcmStatus").src = statusIcon;
    elem("#userStatus").src = statusIcon;
}

async function fillBCM(id) {
    let user = await (id? Botcord.client.users.fetch(id, {force: true}): Botcord.client.user.fetch(true));
    let avatar = user.avatarURL({ extension: "png" }) || user.defaultAvatarURL;

    if(user.banner) elem("#bcmBanner").style.backgroundImage = `url(${user.bannerURL({size: 512})})`;
        else elem("#bcmBanner").style.backgroundImage = "none";
    elem("#bcmBanner").style.backgroundColor = user.hexAccentColor || (
        await Vibrant.from(avatar).getPalette()
    ).Vibrant.hex;

    elem("#bcmPfp").src = avatar;
    elem("#bcmDisplayName").textContent = user.displayName;
    elem("#bcmTag").textContent = user.discriminator;

    elem("#bcmSince").textContent = dayjs(user.createdAt).format("MMM D, YYYY");
    // elem("#bcmUsername").textContent = user.username;

    return user;
}

function propIcons() {
    let els = elem(".i:not(.i-done)", true);
    if(Botcord.logs.elements) logger.log(`Propagated 3rd party icons:`, els);

    for(let i = 0; i < els.length; i++) {
        let el = els[i];
        if(el.hasAttribute("data-icon")) {
            let icon = el.getAttribute("data-icon");
            el.style.backgroundImage = `url(https://img.icons8.com/material-rounded/${color(el.classList.contains("static")?theme.color:theme.colorDark)}/${icon})`;
            // if(el.hasAttribute("data-size")) {
            //     el.style.backgroundSize
            // }
            el.classList.add("i-done");
        } else logger.warn(`Element #${i} lacks "data-icon"! (skipped) -`, el);
    }
}

function initClickables() {
    const clickables = require("../data/clickables");

    for(let selector in clickables) {
        let el = elem("#" + selector);
        el.addEventListener(
            "click",
            clickables[selector]
        );
    }
}

module.exports = {
    displayPresence,
    fillBCM,
    propIcons,
    initClickables
}