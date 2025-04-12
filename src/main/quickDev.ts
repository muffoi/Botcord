(function() {
    if(Botcord.args.isPackaged) return;

    let css = document.getElementById("stylesMain") as HTMLLinkElement, backup = document.createElement("link");
    let href = css.href;

    backup.rel = css.rel;
    backup.href = href;
    document.head.appendChild(backup);

    window.addEventListener("keydown", evt => {
        if(evt.ctrlKey == true && evt.code == "Digit1") {
            css.href = "";
            css.href = href;

            let oldScript = elem<HTMLScriptElement>("#themeJs");
            let newScript = mkelem("script", null, "themeJs");

            newScript.src = oldScript.src;
            
            oldScript.remove();
            document.head.appendChild(newScript);

            setTimeout(() => {
                backup.href = "";
                backup.href = href;
            }, 150);
        }

        if(evt.ctrlKey == true && evt.code == "KeyR") location.reload();
    })

})();