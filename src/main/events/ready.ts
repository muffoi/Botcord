import { getBotInfo } from "../modules/clientApps";
import { loadGuilds } from "../modules/contentLoader";
import { displayPresence } from "../modules/displays";

export async function handleEvent() {
    logger.log("Connected.");
    times.stamp("login");

    Botcord.client!.user.presence.set({ status: Botcord.current!.presence });

    let user = Botcord.client!.user;
    elem<HTMLImageElement>("#pfp").src = user.avatarURL({size: 64}) || Botcord.client!.user.defaultAvatarURL;
    elem("#username").textContent = user.displayName;
    displayPresence();

    await Botcord.storage!.updateUser(
        Botcord.storage!.userIndex,
        await getBotInfo({token: Botcord.current!.token})
    );

    if(!Botcord.flags.noServerList) await loadGuilds();

    let loader = elem("#loader");
    loader.style.transform = "scaleY(0)";
    loader.style.opacity = "0";

    await Botcord.isInitialized;

    times.stamp("finish");
    logger.debug("timings", `Startup time: ${times.finish}ms; Client time: ${times.client}ms`);

    // Botcord.client.users.fetch()
}